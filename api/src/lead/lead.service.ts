import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { DataResponseDto } from '@app/common/dto/data-response.dto';
import { FormService } from '@app/form/form.service';
import { DistributionService } from '@app/distribution/distribution.service';
import { LeadStatus } from './enums/lead-status.enum';
import { DateTime } from 'luxon';
import { Broker } from '@generated/prisma/client';
import { EligibleBroker } from './interfaces/eligible-broker.interface';
import { PaginationMetaDataDto, PaginationQueryDto, PaginationResponseDto } from '@app/common/dto/pagination.dto';
import { LeadWhereInput } from '@generated/prisma/models';

@Injectable()
export class LeadService {
    constructor(
        private prismaService: PrismaService,
        private formService: FormService,
        private distributionService: DistributionService,
    ) {}

    async create(createLeadDto: CreateLeadDto & { ipAddress: string; slug: string }) {
        const form = await this.formService.findOneBySlug(createLeadDto.slug.trim());

        if (!form.data) {
            throw new NotFoundException('No form found for this slug.');
        }

        const { slug, email, ...newCreateLeadDto } = createLeadDto;
        const normalizedEmail = email.trim().toLowerCase();
        let status = LeadStatus.UNSENT;
        let selectedBroker: Broker | null = null;
        let distributionId: string | null = null;

        try {
            const distribution = await this.distributionService.findOne();
            distributionId = distribution.data?.id || null;

            const isDuplicate = await this.prismaService.lead.count({
                where: { email: normalizedEmail, status: LeadStatus.SENT },
            });

            if (isDuplicate) {
                status = LeadStatus.DUPLICATE;
            } else if (distribution.data) {
                const eligibleBrokers = await this.#getEligibleBrokers(distribution.data.id);
                if (eligibleBrokers.length > 0) {
                    const sentToday = await this.#getDistributionSentToday(distribution.data.id);
                    const selectedBrokerByDeficit = this.#selectBrokerByDeficit(eligibleBrokers, sentToday);
                    if (selectedBrokerByDeficit) {
                        status = LeadStatus.SENT;
                        selectedBroker = selectedBrokerByDeficit.broker;
                    }
                }
            }
        } catch (err) {
            // Anything unexpected during duplicate/eligibility/assignment logic
            // falls back to FAILED rather than losing the submission or crashing the request.
            status = LeadStatus.FAILED;
            selectedBroker = null;
        }

        const createLead = await this.prismaService.lead.create({
            data: {
                formId: form.data.id,
                distributionId,
                email: normalizedEmail,
                brokerId: selectedBroker?.id ?? null,
                status,
                ...newCreateLeadDto,
            },
        });
        return new DataResponseDto(createLead);
    }

    async findAll(query: PaginationQueryDto, distributionId: string | null = null) {
        const { page, limit, offset, search } = query;
        const whereInput: LeadWhereInput = {
            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search,
                        },
                    },
                    {
                        email: {
                            contains: search,
                        },
                    },
                ],
            }),
        };

        if (distributionId) {
            whereInput.distributionId = distributionId;
        }

        const [data, totalItems] = await Promise.all([
            this.prismaService.lead.findMany({
                skip: offset,
                take: limit,
                where: whereInput,
                orderBy: {
                    ...(query.orderBy && query.orderDirection && { [query.orderBy]: query.orderDirection }),
                },
                include: {
                    broker: {
                        select: {
                            name: true,
                        },
                    },
                    form: {
                        select: {
                            name: true,
                        },
                    },
                },
            }),
            this.prismaService.lead.count({
                where: whereInput,
            }),
        ]);
        const metadata = new PaginationMetaDataDto(page, limit, totalItems);
        return new PaginationResponseDto(data, metadata);
    }

    async assignLead(leadId: string, brokerId: string) {
        const lead = await this.prismaService.lead.count({
            where: {
                id: leadId,
                status: LeadStatus.UNSENT,
            },
        });

        const broker = await this.prismaService.broker.count({
            where: {
                id: brokerId,
            },
        });

        if (!lead) {
            throw new NotFoundException('The lead does not exist.');
        }

        if (!broker) {
            throw new NotFoundException('The broker does not exist.');
        }

        const result = this.prismaService.lead.update({
            where: {
                id: leadId,
            },
            data: {
                brokerId,
                status: LeadStatus.SENT,
            },
        });

        return result;
    }

    #isWithinWorkingHours(broker: Broker): boolean {
        const localNow = DateTime.now().setZone(broker.timezone);

        // Check if today is working day
        const isoWeekday = localNow.weekday;
        if (!broker.workingDays.includes(isoWeekday.toString())) return false;

        const [openH, openM] = broker.openingTime.split(':').map(Number);
        const [closeH, closeM] = broker.closingTime.split(':').map(Number);

        const opening = localNow.set({
            hour: openH,
            minute: openM,
            second: 0,
        });
        const closing = localNow.set({
            hour: closeH,
            minute: closeM,
            second: 0,
        });

        return localNow >= opening && localNow <= closing;
    }

    #getBrokerSentTodayCount(broker: Broker): Promise<number> {
        const localNow = DateTime.now().setZone(broker.timezone);
        const startOfDay = localNow.startOf('day').toUTC().toJSDate();
        const endOfDay = localNow.endOf('day').toUTC().toJSDate();

        return this.prismaService.lead.count({
            where: {
                brokerId: broker.id,
                status: LeadStatus.SENT,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });
    }

    // List of eligible brokers by distribution.
    async #getEligibleBrokers(distributionId: string): Promise<EligibleBroker[]> {
        const eligibles: EligibleBroker[] = [];
        const settings = await this.prismaService.distributionBroker.findMany({
            where: {
                distributionId,
                isActive: true,
            },
            include: {
                broker: true,
            },
        });

        for (const setting of settings) {
            const { broker } = setting;

            // Remove inactive brokers
            if (!broker.isActive) continue;

            // Remove not within working hours
            if (!this.#isWithinWorkingHours(broker)) continue;

            // Remove that reached daily cap.
            const sentToday = await this.#getBrokerSentTodayCount(broker);
            if (sentToday >= broker.dailyCap) continue;

            eligibles.push({
                broker,
                percentage: setting.percentage,
                sentToday,
            });
        }

        return eligibles;
    }

    #selectBrokerByDeficit(eligibleBrokers: EligibleBroker[] = [], totalSentToday: number): EligibleBroker | null {
        const computeDeficit = (totalSentToday: number, brokerPercentage: number, brokerSentToday: number): number => {
            const targetAfterLead = ((totalSentToday + 1) * brokerPercentage) / 100;
            return targetAfterLead - brokerSentToday;
        };

        let best: EligibleBroker | null = null;
        let bestDeficit = -Infinity;

        for (const candidate of eligibleBrokers) {
            const deficit = computeDeficit(totalSentToday, candidate.percentage, candidate.sentToday);
            if (best === null || deficit > bestDeficit || (deficit === bestDeficit && candidate.sentToday < best.sentToday)) {
                best = candidate;
                bestDeficit = deficit;
            }
        }
        return best;
    }

    async #getDistributionSentToday(distributionId: string): Promise<number> {
        // using UTC calendar
        const startOfDayUtc = DateTime.utc().startOf('day').toJSDate();
        const endOfDayUtc = DateTime.utc().endOf('day').toJSDate();

        return this.prismaService.lead.count({
            where: {
                distributionId,
                status: LeadStatus.SENT,
                createdAt: {
                    gte: startOfDayUtc,
                    lte: endOfDayUtc,
                },
            },
        });
    }
}

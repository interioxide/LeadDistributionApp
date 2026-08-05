import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { FormService } from '@app/form/form.service';
import { DataResponseDto } from '@app/common/dto/data-response.dto';
import { AddBrokerDto } from './dto/add-broker.dto';
import { BrokerService } from '@app/broker/broker.service';
import { Prisma } from '@generated/prisma/client';
import { PaginationMetaDataDto, PaginationQueryDto, PaginationResponseDto } from '@app/common/dto/pagination.dto';
import { DistributionBrokerWhereInput } from '@generated/prisma/models';
import { RemoveBrokerDto } from './dto/remove-broker.dto';
import { SaveSettingsDto } from './dto/save-settings.dto';

@Injectable()
export class DistributionService {
    constructor(
        private prismaService: PrismaService,
        private formService: FormService,
        private brokerService: BrokerService,
    ) {}
    async create() {
        const form = await this.formService.findOne();
        const distribution = await this.prismaService.distribution.count();

        if (!form.data) {
            throw new ConflictException('No form has been created yet. Please create a form before setting up a distribution.');
        }

        if (distribution > 0) {
            throw new ConflictException('The distribution already exists.');
        }

        const response = await this.prismaService.distribution.create({
            data: {
                formId: form.data.id,
            },
        });
        return new DataResponseDto(response);
    }

    async findOne() {
        const response = await this.prismaService.distribution.findFirst({
            orderBy: {
                createdAt: 'asc',
            },
        });
        return new DataResponseDto(response);
    }

    async addBroker(addBrokerDto: AddBrokerDto) {
        try {
            const distribution = await this.prismaService.distribution.findFirst({
                orderBy: {
                    createdAt: 'asc',
                },
            });
            const { data: brokerData } = await this.brokerService.findOne(addBrokerDto.brokerId);

            if (!distribution) {
                throw new ConflictException('No distribution exists yet.');
            }

            if (!brokerData) {
                throw new ConflictException('The provided broker ID does not exist.');
            }

            const response = await this.prismaService.distributionBroker.create({
                data: {
                    distributionId: distribution.id,
                    brokerId: brokerData.id,
                    percentage: addBrokerDto.percentage,
                },
            });

            return new DataResponseDto(response);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('The broker is already in the distribution.');
            }
            throw error;
        }
    }

    async findBrokers(query: PaginationQueryDto) {
        const { page, limit, offset } = query;
        const distribution = await this.prismaService.distribution.findFirst({
            orderBy: {
                createdAt: 'asc',
            },
        });
        const whereInput: DistributionBrokerWhereInput = {
            distributionId: distribution?.id,
        };
        const [data, totalItems] = await Promise.all([
            this.prismaService.distributionBroker.findMany({
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
                            isActive: true,
                        },
                    },
                },
            }),
            this.prismaService.distributionBroker.count({
                where: whereInput,
            }),
        ]);
        const metadata = new PaginationMetaDataDto(page, limit, totalItems);
        return new PaginationResponseDto(data, metadata);
    }

    async removeBroker(brokerId: string) {
        const response = await this.prismaService.distributionBroker.deleteMany({
            where: {
                brokerId: brokerId,
            },
        });
        return new DataResponseDto(response);
    }

    async saveSettings(saveSettingsDto: SaveSettingsDto) {
        const distribution = await this.prismaService.distribution.count();
        if (!distribution) {
            throw new ConflictException('No distribution exists yet.');
        }

        const saved = await this.prismaService.$transaction(
            saveSettingsDto.brokers.map((broker) =>
                this.prismaService.distributionBroker.updateMany({
                    data: {
                        percentage: broker.percentage,
                        isActive: broker.isActive,
                    },
                    where: {
                        brokerId: broker.brokerId,
                    },
                }),
            ),
        );
        return new DataResponseDto(saved);
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { LeadStatus } from '@app/lead/enums/lead-status.enum';

@Injectable()
export class MetricsService {
    constructor(
        private prismaService: PrismaService,
    ) {}
    
    async metrics() {
        const [
            totalLeads, 
            sentLeads, 
            unsentLeads, 
            duplicateLeads, 
            failedLeads,
            totalBrokers,
            activeBrokers,
            form,
            distribution,
        ] = await Promise.all([
            this.prismaService.lead.count(),
            this.prismaService.lead.count({
                where: {
                    status: LeadStatus.SENT,
                },
            }),
            this.prismaService.lead.count({
                where: {
                    status: LeadStatus.UNSENT,
                },
            }),
            this.prismaService.lead.count({
                where: {
                    status: LeadStatus.DUPLICATE,
                },
            }),
            this.prismaService.lead.count({
                where: {
                    status: LeadStatus.FAILED,
                },
            }),
            this.prismaService.broker.count(),
            this.prismaService.broker.count({
                where: {
                    isActive: true,
                },
            }),
            this.prismaService.form.findFirst({
                orderBy: {
                    createdAt: 'asc'
                }
            }),
            this.prismaService.distribution.findFirst({
                orderBy: {
                    createdAt: 'asc'
                }
            }),
        ]);
        return {
            totalLeads,
            sentLeads,
            unsentLeads,
            duplicateLeads,
            failedLeads,
            totalBrokers,
            activeBrokers,
            form,
            distribution
        };
    }
}

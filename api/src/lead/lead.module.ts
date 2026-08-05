import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { FormService } from '@app/form/form.service';
import { DistributionService } from '@app/distribution/distribution.service';
import { BrokerService } from '@app/broker/broker.service';

@Module({
    controllers: [LeadController],
    providers: [LeadService, FormService, DistributionService, BrokerService],
})
export class LeadModule {}

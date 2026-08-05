import { Module } from '@nestjs/common';
import { DistributionService } from './distribution.service';
import { DistributionController } from './distribution.controller';
import { FormService } from '@app/form/form.service';
import { BrokerService } from '@app/broker/broker.service';

@Module({
    controllers: [DistributionController],
    providers: [DistributionService, FormService, BrokerService],
})
export class DistributionModule {}

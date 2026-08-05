import { Broker } from '@generated/prisma/client';

export interface EligibleBroker {
    broker: Broker;
    percentage: number;
    sentToday: number;
}

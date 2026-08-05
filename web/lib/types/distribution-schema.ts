import { z } from 'zod';

export const distributionBrokerRowSchema = z.object({
    id: z.string(), // distribution_brokers.id
    brokerId: z.string(),
    brokerName: z.string(),
    brokerIsActive: z.boolean(),
    percentage: z.number().min(1, 'Minimum is 1%').max(100, 'Maximum is 100%'),
    isActive: z.boolean(), // active inside this distribution
});

export const distributionBrokersFormSchema = z.object({
    brokers: z.array(distributionBrokerRowSchema),
});

export type DistributionBroker = z.infer<typeof distributionBrokerRowSchema>;
export type DistributionBrokersFormValues = z.infer<typeof distributionBrokersFormSchema>;

export const addBrokerToDistributionSchema = z.object({
    brokerId: z.string().min(1, 'Select a broker'),
    percentage: z.number().min(1, 'Minimum is 1%').max(100, 'Maximum is 100%'),
});

export type AddBrokerToDistributionValues = z.infer<typeof addBrokerToDistributionSchema>;

export type AddBrokerInput = z.input<typeof addBrokerToDistributionSchema>;
export type AddBrokerOutput = z.output<typeof addBrokerToDistributionSchema>;

export interface Distribution {
    id: string;
    formId: string;
    createdAt: string;
}

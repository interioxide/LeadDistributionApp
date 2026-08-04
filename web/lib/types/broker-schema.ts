import { z } from 'zod';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/; // "HH:MM", 24h

export const brokerSchema = z
    .object({
        name: z.string().trim().min(1, 'Broker name is required'),
        isActive: z.boolean(),
        dailyCap: z.number().min(1),
        timezone: z.string().min(1, 'Timezone is required'),
        openingTime: z.string().regex(TIME_REGEX, 'Enter a valid time'),
        closingTime: z.string().regex(TIME_REGEX, 'Enter a valid time'),
        workingDays: z.array(z.string()).min(1, 'Select at least one working day'),
    })
    .refine((data) => data.openingTime < data.closingTime, {
        message: 'Opening time must be before closing time',
        path: ['closingTime'],
    });

export type BrokerValues = z.infer<typeof brokerSchema>;

export interface Broker extends BrokerValues {
    id: string;
}

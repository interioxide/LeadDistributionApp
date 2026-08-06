import { z } from 'zod';
import { Broker } from './broker-schema';
import { LeadForm } from './lead-form-schema';

export const leadSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z.string().trim().email('Enter a valid email address'),
    phone: z
        .string()
        .trim()
        .min(1, 'Phone number is required')
        .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Enter a valid phone number'),
});

export type LeadValues = z.infer<typeof leadSchema>;

export enum LeadStatus {
    SENT = 'sent',
    UNSENT = 'unsent',
    DUPLICATE = 'duplicate',
    failed = 'failed',
}

export interface Lead extends LeadValues {
    id: string;
    ipAddress: string;
    formId: string;
    distributionId: string;
    brokerId: string | null;
    status: LeadStatus;
    createdAt: string;
    broker: Broker;
    form: LeadForm;
}

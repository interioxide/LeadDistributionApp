import { z } from 'zod';

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

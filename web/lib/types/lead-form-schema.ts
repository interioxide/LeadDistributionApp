import { z } from 'zod';

export const leadFormSchema = z.object({
    name: z.string().trim().min(1, 'Lead form name is required'),
    slug: z
        .string()
        .trim()
        .min(1, 'Slug is required')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only (e.g. sample-page)'),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export interface LeadForm extends LeadFormValues {
    id: string;
    createdAt: string;
}

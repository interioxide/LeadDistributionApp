'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';

import { leadSchema, type LeadValues } from '@/lib/types/lead-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

interface LeadFormProps {
    slug: string;
}

export function PublicLeadForm({ slug }: LeadFormProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm<LeadValues>({
        resolver: zodResolver(leadSchema),
        defaultValues: { name: '', email: '', phone: '' },
    });

    async function onSubmit(values: LeadValues) {
        setSubmitError(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads/${slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
                // IP address is read from the request on the server — never sent
                // from here, since a client-supplied IP can't be trusted.
            });

            if (!res.ok) {
                throw new Error('Submission failed');
            }

            setIsSubmitted(true);
        } catch {
            setSubmitError('Something went wrong. Please try again.');
        }
    }

    // Not explicitly required by the spec (section 6/10 only describe what
    // happens server-side on submit), but a public form with zero feedback
    // after submitting is a bad experience — flagging this as an addition.
    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-lg border p-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" aria-hidden="true" />
                <p className="text-base font-medium">Thanks — your info has been submitted.</p>
                <p className="text-sm text-muted-foreground">Someone will be in touch shortly.</p>
            </div>
        );
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="lead-name">Name</FieldLabel>
                            <Input {...field} id="lead-name" placeholder="Juan Dela Cruz" autoComplete="name" aria-invalid={fieldState.invalid} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="lead-email">Email</FieldLabel>
                            <Input
                                {...field}
                                id="lead-email"
                                type="email"
                                placeholder="juan@example.com"
                                autoComplete="email"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="phone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="lead-phone">Phone</FieldLabel>
                            <Input {...field} id="lead-phone" type="tel" placeholder="09xx xxx xxxx" autoComplete="tel" aria-invalid={fieldState.invalid} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                {submitError && (
                    <p className="text-sm text-destructive" role="alert">
                        {submitError}
                    </p>
                )}

                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                    {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </FieldGroup>
        </form>
    );
}

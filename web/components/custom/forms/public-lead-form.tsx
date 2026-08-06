'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';

import { leadSchema, type LeadValues } from '@/lib/types/lead-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, submitLead } from '@/lib/api';
import { toast } from 'sonner';

interface LeadFormProps {
    slug: string;
}

export function PublicLeadForm({ slug }: LeadFormProps) {
    const form = useForm<LeadValues>({
        resolver: zodResolver(leadSchema),
        defaultValues: { name: '', email: '', phone: '' },
    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: submitLead,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['leads'],
            });

            toast.success('Thank you! Your information has been received.');

            form.reset({
                name: '',
                email: '',
                phone: '',
            });
        },
        onError: (error: ApiError) => {
            toast.error(error.message);
        },
    });

    function onSubmit(values: LeadValues) {
        mutate({
            slug,
            ...values,
        });
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
                            <Input {...field} id="lead-name" placeholder="Juan Dela Cruz" autoComplete="off" aria-invalid={fieldState.invalid} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-xs" />}
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
                                autoComplete="off"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-xs" />}
                        </Field>
                    )}
                />

                <Controller
                    name="phone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="lead-phone">Phone</FieldLabel>
                            <Input {...field} id="lead-phone" type="tel" placeholder="09xx xxx xxxx" autoComplete="off" aria-invalid={fieldState.invalid} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-xs" />}
                        </Field>
                    )}
                />

                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? 'Submitting...' : 'Submit'}
                </Button>
            </FieldGroup>
        </form>
    );
}

'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AddBrokerInput, AddBrokerOutput, addBrokerToDistributionSchema, type AddBrokerToDistributionValues } from '@/lib/types/distribution-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { NumericInput } from './numeric-input';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface AvailableBroker {
    id: string;
    name: string;
}

interface AddBrokerToDistributionProps {
    // Brokers that exist but don't yet have a distribution_brokers row —
    // computed by the parent (all brokers minus ones already in `rows`).
    availableBrokers: AvailableBroker[];
    onAdd: (values: AddBrokerToDistributionValues) => void | Promise<void>;
    isAdding?: boolean;
}

export function AddBrokerToDistribution({ availableBrokers, onAdd, isAdding }: AddBrokerToDistributionProps) {
    const form = useForm<AddBrokerInput, any, AddBrokerOutput>({
        resolver: zodResolver(addBrokerToDistributionSchema),
        defaultValues: { brokerId: '', percentage: 10 },
    });

    async function handleAdd(values: AddBrokerToDistributionValues) {
        await onAdd(values);
        form.reset({ brokerId: '', percentage: 10 });
    }

    if (availableBrokers.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                There are no brokers available for lead distribution yet.{' '}
                <Link href="/brokers/add" className="underline">
                    Add new broker
                </Link>{' '}
                to get started.
            </p>
        );
    }

    return (
        <Card>
            <CardTitle className="text-sm font-medium pl-5">Add broker to distribution</CardTitle>
            <CardContent>
                <form onSubmit={form.handleSubmit(handleAdd)} className="flex items-stretch gap-3 items-start">
                    <Controller
                        name="brokerId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="flex-1">
                                <FieldLabel htmlFor="add-broker-select">Broker</FieldLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger id="add-broker-select" className="w-full" aria-invalid={fieldState.invalid}>
                                        <SelectValue placeholder="Select a broker" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableBrokers.map((broker) => (
                                            <SelectItem key={broker.id} value={broker.id}>
                                                {broker.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-xs" />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="percentage"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="w-32">
                                <FieldLabel htmlFor="add-broker-percentage">Percentage</FieldLabel>
                                <NumericInput
                                    {...field}
                                    id="add-broker-percentage"
                                    placeholder="e.g. 10"
                                    aria-invalid={fieldState.invalid}
                                    onChange={(_, value) => field.onChange(Number(value))}
                                    autoComplete="off"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-xs" />}
                            </Field>
                        )}
                    />
                    <div className="flex flex-col justify-center">
                        <Button type="submit" disabled={isAdding} className="cursor-pointer">
                            <Plus />
                            {isAdding ? 'Adding...' : 'Add'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

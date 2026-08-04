'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { brokerSchema, type BrokerValues } from '@/lib/types/broker-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { TimePicker } from '@/components/custom/time-picker';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { NumericInput } from '../numeric-input';

const WORKING_DAYS = [
    { value: '1', label: 'Mon' },
    { value: '2', label: 'Tue' },
    { value: '3', label: 'Wed' },
    { value: '4', label: 'Thu' },
    { value: '5', label: 'Fri' },
    { value: '6', label: 'Sat' },
    { value: '7', label: 'Sun' },
] as const;

const TIMEZONES = Intl.supportedValuesOf('timeZone');

const EMPTY_DEFAULTS: BrokerValues = {
    name: '',
    isActive: true,
    dailyCap: 10,
    timezone: 'Asia/Manila',
    openingTime: '09:00',
    closingTime: '18:00',
    workingDays: ['1', '2', '3', '4', '5'],
};

interface BrokerFormProps {
    mode: 'add' | 'edit';
    defaultValues?: Partial<BrokerValues>;
    onSubmit: (values: BrokerValues) => void | Promise<void>;
    isSubmitting?: boolean;
}

export function BrokerForm({ mode, defaultValues, onSubmit, isSubmitting }: BrokerFormProps) {
    const router = useRouter();

    const form = useForm<BrokerValues>({
        resolver: zodResolver(brokerSchema),
        defaultValues: { ...EMPTY_DEFAULTS, ...defaultValues },
    });

    return (
        <form id="broker-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex min-h-screen flex-1 flex-col">
                <FieldGroup className="w-full p-10">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="broker-name">Broker name</FieldLabel>
                                    <Input {...field} id="broker-name" placeholder="Broker A - Manila" aria-invalid={fieldState.invalid} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="isActive"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                    <FieldContent>
                                        <FieldLabel htmlFor="broker-status">Status</FieldLabel>
                                        <FieldDescription className="flex flex-row gap-2 pt-2">
                                            <Switch
                                                id="broker-active"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                aria-invalid={fieldState.invalid}
                                            />
                                            {field.value ? 'Active' : 'Inactive'}
                                        </FieldDescription>
                                    </FieldContent>
                                </Field>
                            )}
                        />

                        <Controller
                            name="dailyCap"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="broker-daily-cap">Daily cap</FieldLabel>
                                    <NumericInput
                                        {...field}
                                        onChange={(_, value) => field.onChange(value)}
                                        id="broker-daily-cap"
                                        type="number"
                                        min={1}
                                        placeholder="10"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="timezone"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="broker-timezone">Timezone</FieldLabel>
                                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger id="broker-timezone" className="w-full" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select a timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TIMEZONES.map((tz) => (
                                                <SelectItem key={tz} value={tz}>
                                                    {tz}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="openingTime"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="broker-opening-time">Opening time</FieldLabel>
                                    <TimePicker id="broker-opening-time" value={field.value} onChange={field.onChange} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="closingTime"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="broker-closing-time">Closing time</FieldLabel>
                                    <TimePicker id="broker-closing-time" value={field.value} onChange={field.onChange} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    <Controller
                        name="workingDays"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Working days</FieldLabel>
                                <ToggleGroup
                                    type="multiple"
                                    variant="outline"
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    className="flex-wrap justify-start"
                                >
                                    {WORKING_DAYS.map((day) => (
                                        <ToggleGroupItem className="cursor-pointer" key={day.value} value={day.value} aria-label={day.label}>
                                            {day.label}
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </FieldGroup>
                <FieldGroup className="sticky bottom-0 mt-auto flex w-full flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 bg-background">
                    <Button type="button" variant="outline" onClick={() => router?.back()} className="gap-1.5 cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <Button type="submit" form="broker-form" disabled={isSubmitting} className="cursor-pointer">
                        <Save />
                        {isSubmitting ? (mode === 'add' ? 'Saving...' : 'Updating...') : mode === 'add' ? 'Save broker' : 'Update broker'}
                    </Button>
                </FieldGroup>
            </div>
        </form>
    );
}

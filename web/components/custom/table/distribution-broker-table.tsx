'use client';

import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Save, Trash2 } from 'lucide-react';

import { distributionBrokersFormSchema, type DistributionBroker, type DistributionBrokersFormValues } from '@/lib/types/distribution-schema';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { NumericInput } from '../numeric-input';
import { StatusBadge } from '../status-badge';

interface DistributionBrokerTableProps {
    rows: DistributionBroker[];
    onSave: (values: DistributionBrokersFormValues) => void | Promise<void>;
    onRemove: (rowId: string) => void | Promise<void>;
    isSaving?: boolean;
}

export function DistributionBrokerTable({ rows, onSave, onRemove, isSaving }: DistributionBrokerTableProps) {
    const form = useForm<DistributionBrokersFormValues>({
        resolver: zodResolver(distributionBrokersFormSchema),
        defaultValues: { brokers: [] },
    });

    const { fields } = useFieldArray({ control: form.control, name: 'brokers' });

    const totalActivePercentage = form
        .watch('brokers')
        .filter((b) => b.isActive)
        .reduce((sum, b) => sum + (Number(b.percentage) || 0), 0);

    useEffect(() => {
        form.reset({
            brokers: rows,
        });
    }, [rows, form]);

    return (
        <form onSubmit={form.handleSubmit(onSave)}>
            <div className="flex min-h-screen flex-1 flex-col px-10">
                <Card>
                    <CardTitle className="text-sm font-medium pl-5">{fields.length > 0 ? 'Brokers in this distribution' : ''}</CardTitle>
                    <CardContent>
                        <FieldGroup className="w-full">
                            {fields.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Broker</TableHead>
                                            <TableHead>Broker status</TableHead>
                                            <TableHead>Percentage</TableHead>
                                            <TableHead className="w-20">Active in distribution</TableHead>
                                            <TableHead className="w-10" />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.map((row, index) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{row.brokerName}</TableCell>
                                                <TableCell>
                                                    <StatusBadge status={row.brokerIsActive ? 'success' : 'failed'}>
                                                        {row.brokerIsActive ? 'Active' : 'Inactive (broker-level)'}
                                                    </StatusBadge>
                                                </TableCell>
                                                <TableCell>
                                                    <Controller
                                                        name={`brokers.${index}.percentage`}
                                                        control={form.control}
                                                        render={({ field, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid} className="w-24">
                                                                <div className="flex items-center gap-1">
                                                                    <NumericInput
                                                                        {...field}
                                                                        type="number"
                                                                        placeholder="e.g. 10"
                                                                        aria-invalid={fieldState.invalid}
                                                                        onChange={(_, value) => field.onChange(Number(value))}
                                                                        className="w-20"
                                                                        autoComplete="off"
                                                                    />
                                                                    <span className="text-sm text-muted-foreground">%</span>
                                                                </div>
                                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-xs" />}
                                                            </Field>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Controller
                                                        name={`brokers.${index}.isActive`}
                                                        control={form.control}
                                                        render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        aria-label={`Remove ${row.brokerName} from distribution`}
                                                        onClick={() => onRemove(row.brokerId)}
                                                        title="Remove broker from distribution"
                                                        className="cursor-pointer"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Empty>
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <AlertTriangle />
                                        </EmptyMedia>
                                        <EmptyTitle>No brokers assigned.</EmptyTitle>
                                        <EmptyDescription>This distribution doesn't have any brokers yet.</EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            )}
                        </FieldGroup>
                    </CardContent>
                </Card>
            </div>

            <FieldGroup className="sticky bottom-0 mt-auto flex w-full flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 bg-background">
                <p className="text-sm text-muted-foreground">Total percentage across active-in-distribution brokers: {totalActivePercentage}%</p>
                <Button type="submit" disabled={isSaving} className="cursor-pointer">
                    <Save />
                    {isSaving ? 'Saving...' : 'Save changes'}
                </Button>
            </FieldGroup>
        </form>
    );
}

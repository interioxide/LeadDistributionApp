'use client';

import { useEffect, useState } from 'react';
import { History, Info, AlertTriangle, ArrowRight, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DistributionBrokerTable } from '@/components/custom/table/distribution-broker-table';
import { AddBrokerToDistribution } from '@/components/custom/add-broker-to-distribution';
import type { AddBrokerToDistributionValues, Distribution, DistributionBroker, DistributionBrokersFormValues } from '@/lib/types/distribution-schema';
import { LeadForm } from '@/lib/types/lead-form-schema';
import { Broker } from '@/lib/types/broker-schema';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import Link from 'next/link';
import { StatusBadge } from '../status-badge';

interface DistributionFormProps {
    form: LeadForm | null;
    distribution: Distribution | null;
    rows: DistributionBroker[]; // existing distribution_brokers, joined with broker
    availableBrokers: Broker[]; // brokers not yet in this distribution
    onCreateDistribution: () => void | Promise<void>;
    onSaveBrokers: (values: DistributionBrokersFormValues) => void | Promise<void>;
    onAddBroker: (values: AddBrokerToDistributionValues) => void | Promise<void>;
    onRemoveBroker: (rowId: string) => void | Promise<void>;
    onViewDetail: () => void;
    isCreatingPending?: boolean;
    isAddingPending?: boolean;
    isSavingPending?: boolean;
}

export function DistributionForm({
    form,
    distribution,
    rows,
    availableBrokers,
    onCreateDistribution,
    onSaveBrokers,
    onAddBroker,
    onRemoveBroker,
    onViewDetail,
    isCreatingPending = false,
    isAddingPending = false,
    isSavingPending = false,
}: DistributionFormProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isAdding, setIsAdding] = useState(isAddingPending);

    useEffect(() => {
        setIsCreating(isCreatingPending);
        setIsAdding(isAddingPending);
        setIsSaving(isSavingPending);
    }, [isCreatingPending, isAddingPending, isSavingPending]);

    // State 1: no form exists yet - distribution can never be created.
    // Required message from the spec, shown directly rather than only as a toast.
    if (!form) {
        return (
            <div className="flex items-start p-4">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <AlertTriangle />
                        </EmptyMedia>
                        <EmptyTitle>Oops, please create a form first.</EmptyTitle>
                        <EmptyDescription>
                            A distribution is automatically linked to the one existing form. Please create the form before setting up the distribution.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent className="flex-row justify-center gap-2">
                        <Button asChild>
                            <Link href="/lead-form">
                                Create Lead Form
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </EmptyContent>
                </Empty>
            </div>
        );
    }

    // State 2: form exists, distribution doesn't yet - only action available
    // is to create it. Broker table isn't shown until the distribution row exists.
    if (!distribution) {
        return (
            <div className="flex items-start p-4">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <AlertTriangle />
                        </EmptyMedia>
                        <EmptyTitle>No distribution yet.</EmptyTitle>
                        <EmptyDescription>
                            <p>No distribution has been created yet. </p>
                            <p>
                                It will automatically connect to <span className="font-medium text-foreground">{form.name}</span>.
                            </p>
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent className="flex-row justify-center gap-2">
                        <Button
                            type="button"
                            disabled={isCreating}
                            onClick={async () => {
                                setIsCreating(true);
                                try {
                                    await onCreateDistribution();
                                } finally {
                                    setIsCreating(false);
                                }
                            }}
                        >
                            <Plus className="h-4 w-4" />
                            {isCreating ? 'Creating...' : 'Create distribution'}
                        </Button>
                    </EmptyContent>
                </Empty>
            </div>
        );
    }

    // State 3: distribution exists - full broker management view.
    return (
        <div className="space-y-6 py-5">
            <div className="flex items-center justify-between px-10">
                <StatusBadge status="success">
                    Connected to{' '}
                    <Link href="/lead-form" className="hover:underline">
                        {form.name}
                    </Link>
                </StatusBadge>
                <Button variant="outline" onClick={onViewDetail}>
                    <History className="mr-2 h-4 w-4" aria-hidden="true" />
                    View Distribution Detail
                </Button>
            </div>

            <div className="px-10">
                <AddBrokerToDistribution
                    availableBrokers={availableBrokers}
                    isAdding={isAdding}
                    onAdd={async (values) => {
                        setIsAdding(true);
                        try {
                            await onAddBroker(values);
                        } finally {
                            setIsAdding(false);
                        }
                    }}
                />
            </div>

            <div>
                <DistributionBrokerTable
                    rows={rows}
                    isSaving={isSaving}
                    onSave={async (values) => {
                        setIsSaving(true);
                        try {
                            await onSaveBrokers(values);
                        } finally {
                            setIsSaving(false);
                        }
                    }}
                    onRemove={onRemoveBroker}
                />
            </div>
        </div>
    );
}

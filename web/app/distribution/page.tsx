'use client';

import { useEffect, useState } from 'react';
import type { AddBrokerToDistributionValues, DistributionBroker, DistributionBrokersFormValues } from '@/lib/types/distribution-schema';
import { DistributionForm } from '@/components/custom/forms/distribution-form';
import { PageHeader } from '@/components/custom/page-header';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    addDistributionBroker,
    ApiError,
    createDistribution,
    getBrokers,
    getDistribution,
    getDistributionBrokers,
    getLeadForm,
    removeDistributionBroker,
    saveDistributionSettings,
} from '@/lib/api';
import { toast } from 'sonner';
import { DistributionSkeleton } from '@/components/custom/loaders/distribution-skeleton';

export default function DistributionPage() {
    const queryClient = useQueryClient();

    // Retrieves lead form
    const { data: formData, isSuccess: isFormDataSuccess } = useQuery({
        queryFn: getLeadForm,
        queryKey: ['leadForm'],
    });

    // Retrieves distribution
    const { data: distributionData, isSuccess: isDistributionSuccess } = useQuery({
        queryFn: getDistribution,
        queryKey: ['distribution'],
    });

    // Create Distribution
    const {
        mutate: createDistributionMutate,
        isPending: isCreateDistributionPending,
        isSuccess: isCreateDistributionSuccess,
    } = useMutation({
        mutationFn: createDistribution,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['distribution'],
            });
            toast.success('Distribution has been created successfully.');
        },
        onError: (error: ApiError) => {
            toast.error(error.message);
        },
    });

    // Retrieves brokers
    const { data: brokersData, isSuccess: isBrokersSuccess } = useQuery({
        queryFn: () =>
            getBrokers({
                pagination: { pageIndex: 0, pageSize: 1000 },
            }),
        queryKey: ['brokers'],
    });

    // Retrieves distribution brokers
    const { data: distributionBrokerRows, isSuccess: isDistributionBrokerRowsSuccess } = useQuery({
        queryFn: () =>
            getDistributionBrokers({
                pagination: { pageIndex: 0, pageSize: 1000 },
            }),
        queryKey: ['distributionBrokers'],
    });

    // Add brokers to distribution
    const {
        mutate: addDistributionBrokerMutate,
        isPending: isAddDistributionBrokerPending,
    } = useMutation({
        mutationFn: addDistributionBroker,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['distributionBrokers'],
            });
            toast.success('Broker successfully added to the distribution.');
        },
        onError: (error: ApiError) => {
            toast.error(error.message);
        },
    });

    // Remove brokers to distribution
    const {
        mutate: removeDistributionBrokerMutate,
        isPending: isRemoveDistributionBrokerPending,
        isSuccess: isRemoveDistributionBrokerSuccess,
    } = useMutation({
        mutationFn: removeDistributionBroker,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['distributionBrokers'],
            });
            toast.success('Broker successfully removed from the distribution.');
        },
        onError: (error: ApiError) => {
            toast.error(error.message);
        },
    });

    // Save distribution settings
    const {
        mutate: saveDistributionSettingsMutate,
        isPending: isSaveDistributionSettingsPending,
    } = useMutation({
        mutationFn: saveDistributionSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['distribution'],
            });
            queryClient.invalidateQueries({
                queryKey: ['distributionBrokers'],
            });
            toast.success('Distribution successfully saved.');
        },
        onError: (error: ApiError) => {
            toast.error(error.message);
        },
    });

    async function handleSaveBrokers(values: DistributionBrokersFormValues) {
        saveDistributionSettingsMutate(values);
    }

    async function handleAddBroker(values: AddBrokerToDistributionValues) {
        addDistributionBrokerMutate(values);
    }

    async function handleRemoveBroker(rowId: string) {
        removeDistributionBrokerMutate(rowId);
    }

    async function handleCreateDistribution() {
        createDistributionMutate();
    }

    function handleViewDetail() {
        // Real version: router.push('/distribution/detail')
        console.log('Navigate to Distribution Detail');
    }

    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title={`Distribution`} />
            {isFormDataSuccess && isDistributionSuccess && isBrokersSuccess && isDistributionBrokerRowsSuccess ? (
                <DistributionForm
                    form={formData.data}
                    distribution={distributionData.data}
                    rows={distributionBrokerRows.data || []}
                    availableBrokers={brokersData?.data || []}
                    onCreateDistribution={handleCreateDistribution}
                    onSaveBrokers={handleSaveBrokers}
                    onAddBroker={handleAddBroker}
                    onRemoveBroker={handleRemoveBroker}
                    onViewDetail={handleViewDetail}
                    isCreatingPending={isCreateDistributionPending}
                    isAddingPending={isAddDistributionBrokerPending}
                    isSavingPending={isSaveDistributionSettingsPending}
                />
            ) : (
                <DistributionSkeleton />
            )}
        </div>
    );
}

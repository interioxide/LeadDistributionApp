'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BrokerForm } from '@/components/custom/forms/broker-form';
import type { BrokerValues } from '@/lib/types/broker-schema';
import { PageHeader } from '@/components/custom/page-header';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, getBrokerById, updateBroker } from '@/lib/api';
import { BrokerFormSkeleton } from '@/components/custom/skeleton/broker-form-skeleton';
import { toast } from 'sonner';

export default function EditBrokerPage() {
    const { id } = useParams<{ id: string }>();

    const { data: brokerData, isSuccess: isBrokerSuccess } = useQuery({
        queryFn: () => getBrokerById(id),
        queryKey: ['brokers'],
    });

    const queryClient = useQueryClient();
    const {
        mutate,
        isPending: isUpdateBrokerPending,
        isSuccess: isUpdateBrokerSuccess,
    } = useMutation({
        mutationFn: updateBroker,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['brokers'],
            });
            toast.success('Broker successfully updated.');
        },
        onError: (error: ApiError) => {
            toast.error(error.message);
        },
    });

    function handleSubmit(formData: BrokerValues) {
        mutate({ id, ...formData });
    }

    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title={`Edit Broker`} />
            {isBrokerSuccess ? (
                <BrokerForm mode="edit" onSubmit={handleSubmit} defaultValues={brokerData.data} isSubmitting={isUpdateBrokerPending} />
            ) : (
                <BrokerFormSkeleton />
            )}
        </div>
    );
}

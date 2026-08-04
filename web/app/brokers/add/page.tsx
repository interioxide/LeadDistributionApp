'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BrokerForm } from '@/components/custom/forms/broker-form';
import type { BrokerFormValues } from '@/lib/types/broker-schema';
import { PageHeader } from '@/components/custom/page-header';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, createBroker } from '@/lib/api';
import { toast } from 'sonner';

export default function EditBrokerPage() {
    const router = useRouter();

    const queryClient = useQueryClient();
    const {
        mutate,
        isPending: isAddBrokerPending,
    } = useMutation({
        mutationFn: createBroker,
        onSuccess: (item) => {
            queryClient.invalidateQueries({
                queryKey: ['brokers'],
            });
            toast.success('New broker successfully created.', {
                description: item.data.name,
                action: {
                    label: 'View',
                    onClick: () => router.replace(`/brokers/${item.data.id}/edit`)
                }
            });
            router.replace('/brokers');
        },
        onError: (error: ApiError) => {
            toast.error(error.message);
        },
    });

    function handleSubmit(formData: BrokerFormValues) {
        mutate(formData);
    }

    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title={`Add New Broker`} />
            <BrokerForm mode="add" onSubmit={handleSubmit} isSubmitting={isAddBrokerPending} />
        </div>
    );
}

'use client';

import { useParams } from 'next/navigation';
import type { Broker, BrokerValues } from '@/lib/types/broker-schema';
import { PageHeader } from '@/components/custom/page-header';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, getBrokerById, updateBroker } from '@/lib/api';
import { BrokerFormSkeleton } from '@/components/custom/loaders/broker-form-skeleton';
import { BrokerView } from '@/components/custom/broker-view';

export default function ViewBrokerPage() {
    const { id } = useParams<{ id: string }>();

    const { data: brokerData, isSuccess: isBrokerSuccess } = useQuery({
        queryFn: () => getBrokerById(id),
        queryKey: ['brokers', id],
        refetchOnMount: 'always',
    });

    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title={isBrokerSuccess ? `${brokerData.data.name}` : `Loading...`} />
            {isBrokerSuccess ? <BrokerView data={brokerData.data} /> : <BrokerFormSkeleton />}
        </div>
    );
}

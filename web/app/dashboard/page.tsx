'use client';
import { DashboardMetrics } from '@/components/custom/dashboard-metrics';
import { DashboardMetricsSkeleton } from '@/components/custom/loaders/dashboard-metrics-skeleton';
import { PageHeader } from '@/components/custom/page-header';
import { getMetrics } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function DashboardPage() {
    const { data: metricsData, isSuccess } = useQuery({
        queryFn: getMetrics,
        queryKey: ['metrics'],
        refetchOnMount: 'always',
    });

    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title={`Dashboard`} />
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 p-4 sm:p-6 md:gap-6">
                    {isSuccess ? (
                        <DashboardMetrics
                            leadCounts={{
                                total: metricsData.totalLeads,
                                sent: metricsData.sentLeads,
                                unsent: metricsData.unsentLeads,
                                duplicate: metricsData.duplicateLeads,
                                failed: metricsData.failedLeads,
                            }}
                            form={metricsData.form}
                            distribution={metricsData.distribution}
                            activeBrokerCount={metricsData.activeBrokers}
                            totalBrokerCount={metricsData.totalBrokers}
                        />
                    ) : (
                        <DashboardMetricsSkeleton />
                    )}
                </div>
            </div>
        </div>
    );
}

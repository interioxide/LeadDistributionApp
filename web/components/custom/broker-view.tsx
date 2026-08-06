'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, Clock, Gauge, Globe } from 'lucide-react';
import { FieldGroup } from '../ui/field';
import { Broker } from '@/lib/types/broker-schema';
import { formatWorkingDays } from '@/lib/string';
import { StatusBadge } from './status-badge';
import { useQuery } from '@tanstack/react-query';
import { getAllLeads } from '@/lib/api';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { DataTableSkeleton } from './loaders/data-table-skeleton';
import { brokerColumns } from './table/columns/broker';
import { leadColumns } from './table/columns/lead';
import { useState } from 'react';
import { DataTable } from './table/data-table';
import { leadColumnsV3 } from './table/columns/lead-v3';
import { Card, CardContent, CardTitle } from '../ui/card';

interface BrokerViewProps {
    data: Broker | null;
}

export function BrokerView({ data = null }: BrokerViewProps) {
    const router = useRouter();
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);

    const { data: leadsData, isSuccess: isLeadsDataSuccess } = useQuery({
        queryFn: () =>
            getAllLeads({
                brokerId: data?.id,
                pagination,
                sorting,
            }),
        queryKey: ['distributionLeads', pagination, sorting, data?.id],
        refetchOnMount: 'always',
    });

    return (
        <div>
            <div className="flex min-h-screen flex-1 flex-col">
                <FieldGroup className="w-full px-10 py-5">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            {data?.isActive ? <StatusBadge status="success">Active</StatusBadge> : <StatusBadge status="failed">Inactive</StatusBadge>}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                            {data?.timezone}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {data?.openingTime} - {data?.closingTime}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                            {formatWorkingDays(data?.workingDays)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
                            {`Cap: ${data?.dailyCap} / day`}
                        </span>
                    </div>
                </FieldGroup>

                {/* Data Table */}
                <div className="flex flex-col w-full px-10 py-5">
                    <Card>
                        <CardTitle className="px-5 ">{isLeadsDataSuccess ? `${leadsData.metadata.totalItems} Total leads received.` : 'Loading...'} </CardTitle>
                        <CardContent>
                            {isLeadsDataSuccess ? (
                                <DataTable
                                    data={leadsData.data}
                                    columns={leadColumnsV3}
                                    sorting={sorting}
                                    pagination={pagination}
                                    onPaginationChange={setPagination}
                                    onSortingChange={setSorting}
                                    rowCount={leadsData.metadata.totalItems}
                                    pageCount={leadsData.metadata.totalPages}
                                />
                            ) : (
                                <DataTableSkeleton columnCount={brokerColumns.length} rowCount={pagination.pageSize} showPagination />
                            )}
                        </CardContent>
                    </Card>
                </div>

                <FieldGroup className="sticky bottom-0 mt-auto flex w-full flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 bg-background">
                    <Button type="button" variant="outline" onClick={() => router?.back()} className="gap-1.5 cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </FieldGroup>
            </div>
        </div>
    );
}

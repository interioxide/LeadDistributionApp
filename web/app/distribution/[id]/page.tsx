'use client';
import { PageHeader } from '@/components/custom/page-header';
import { Fragment, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, SearchIcon } from 'lucide-react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getDistributionLeads } from '@/lib/api';
import { DataTable } from '@/components/custom/table/data-table';
import { DataTableSkeleton } from '@/components/custom/loaders/data-table-skeleton';
import { brokerColumns } from '@/components/custom/table/columns/broker';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { leadColumns } from '@/components/custom/table/columns/lead';
import { useParams } from 'next/navigation';

export default function DistributionDetailsPage() {
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);
    const { id } = useParams<{ id: string }>();

    const runSearch = () => {
        setSearch(searchInput);
        setPagination((p) => ({ ...p, pageIndex: 0 }));
    };

    const {
        data: itemData,
        isSuccess: isItemDataSuccess,
        isLoading: isItemDataLoading,
    } = useQuery({
        queryFn: () =>
            getDistributionLeads({
                distributionId: id,
                search,
                pagination,
                sorting,
            }),
        queryKey: ['distributionLeads', search, pagination, sorting],
        refetchOnMount: 'always',
    });

    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title={`Distribution Detail`} />
            <div className="flex flex-col gap-4 p-4 sm:p-6 md:gap-6">
                <Card size="sm">
                    <CardTitle className="text-xs pl-5">Complete history of leads that passed through the distribution.</CardTitle>
                    <CardContent className="space-y-4">
                        <div className="flex flex-row">
                            <div className="relative w-full sm:max-w-lg">
                                <InputGroup className="w-full">
                                    <InputGroupInput
                                        placeholder="Search by name or email"
                                        className="pl-8"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                runSearch();
                                            }
                                        }}
                                        disabled={isItemDataLoading}
                                    />
                                    <InputGroupAddon align="inline-start">
                                        <SearchIcon />
                                    </InputGroupAddon>
                                    <InputGroupAddon align="inline-end">
                                        {isItemDataSuccess && (
                                            <Fragment>
                                                {itemData.metadata.totalItems} result{itemData.metadata.totalItems !== 1 && 's'}
                                            </Fragment>
                                        )}
                                    </InputGroupAddon>
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton variant="outline" className="cursor-pointer" onClick={runSearch} disabled={isItemDataLoading}>
                                            Search
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="flex flex-col">
                            {isItemDataSuccess ? (
                                <DataTable
                                    data={itemData.data}
                                    columns={leadColumns}
                                    sorting={sorting}
                                    pagination={pagination}
                                    onPaginationChange={setPagination}
                                    onSortingChange={setSorting}
                                    rowCount={itemData.metadata.totalItems}
                                    pageCount={itemData.metadata.totalPages}
                                />
                            ) : (
                                <DataTableSkeleton columnCount={brokerColumns.length} rowCount={pagination.pageSize} showPagination />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

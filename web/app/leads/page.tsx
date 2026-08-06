'use client';
import { PageHeader } from '@/components/custom/page-header';
import { Fragment, useState } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { SearchIcon } from 'lucide-react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getAllLeads } from '@/lib/api';
import { DataTable } from '@/components/custom/table/data-table';
import { DataTableSkeleton } from '@/components/custom/loaders/data-table-skeleton';
import { brokerColumns } from '@/components/custom/table/columns/broker';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { leadColumnsV2 } from '@/components/custom/table/columns/lead-v2';

export default function LeadsPage() {
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);

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
            getAllLeads({
                search,
                pagination,
                sorting,
            }),
        queryKey: ['distributionLeads', search, pagination, sorting],
        refetchOnMount: 'always',
    });

    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title={`Leads`} />

            <div className="flex flex-col gap-4 p-4 sm:p-6 md:gap-6">
                <Card size="sm">
                    <CardTitle className="text-xs pl-5">All submitted leads, across every status</CardTitle>
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
                                    columns={leadColumnsV2}
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

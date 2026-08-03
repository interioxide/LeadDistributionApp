'use client';
import { PageHeader } from '@/components/custom/page-header';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getBrokers } from '@/lib/api';
import { DataTable } from '@/components/custom/table/data-table';
import { DataTableSkeleton } from '@/components/custom/table/data-table-skeleton';
import { brokerColumns } from '@/components/custom/table/columns/broker';

export default function BrokersPage() {
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);

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
            getBrokers({
                search,
                pagination,
                sorting,
            }),
        queryKey: ['brokers', search, pagination, sorting],
    });

    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title={`Brokers`} />
            <div className="flex flex-col gap-4 p-4 sm:p-6 md:gap-6">
                <Card size="sm">
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    {isItemDataLoading ? (
                                        'Loading items...'
                                    ) : (
                                        <span>
                                            {itemData.metadata.totalItems} item{itemData.metadata.totalItems !== 1 && 's'} found.
                                        </span>
                                    )}
                                </p>
                            </div>
                            <Button className="w-full sm:w-auto" asChild>
                                <Link href="/brokers/add">
                                    <Plus className="h-4 w-4 mr-1.5" />
                                    Add broker
                                </Link>
                            </Button>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:max-w-sm">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name"
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
                            </div>
                            <Button className="w-full sm:w-auto" onClick={runSearch} disabled={isItemDataSuccess}>
                                Search
                            </Button>
                        </div>

                        {/* Data Table */}
                        <div className="hidden md:block">
                            {isItemDataSuccess ? (
                                <DataTable
                                    data={itemData.data}
                                    columns={brokerColumns}
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

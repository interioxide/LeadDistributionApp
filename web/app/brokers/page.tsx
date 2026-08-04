'use client';
import { PageHeader } from '@/components/custom/page-header';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, SearchIcon } from 'lucide-react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getBrokers } from '@/lib/api';
import { DataTable } from '@/components/custom/table/data-table';
import { DataTableSkeleton } from '@/components/custom/skeleton/data-table-skeleton';
import { brokerColumns } from '@/components/custom/table/columns/broker';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';

export default function BrokersPage() {
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
                <div className="w-full flex justify-end">
                    <Button className="w-full sm:w-auto" asChild>
                        <Link href="/brokers/add">
                            <Plus className="mr-1.5 h-4 w-4" />
                            Add broker
                        </Link>
                    </Button>
                </div>
                <Card size="sm">
                    <CardContent className="space-y-4">
                        <div className="flex flex-row">
                            <div className="relative w-full sm:max-w-lg">
                                <InputGroup className="w-full">
                                    <InputGroupInput
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
                                    <InputGroupAddon align="inline-start">
                                        <SearchIcon />
                                    </InputGroupAddon>
                                    <InputGroupAddon align="inline-end">
                                        {isItemDataSuccess && (
                                            <>
                                                {itemData.metadata.totalItems} result{itemData.metadata.totalItems !== 1 && 's'}
                                            </>
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

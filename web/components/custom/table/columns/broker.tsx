'use client';

import { ColumnDef } from '@tanstack/react-table';
import { StatusBadge } from '../../status-badge';
import { formatWorkingDays } from '@/lib/string';
import Link from 'next/link';
import { ChevronRight, Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Broker } from '@/lib/types/broker-schema';

export const brokerColumns: ColumnDef<Broker>[] = [
    {
        accessorKey: 'name',
        header: () => <div className="w-full font-medium">Broker name</div>,
        cell: ({ row }) => <div className="font-bold">{row.getValue('name')}</div>,
        size: 250,
    },
    {
        accessorKey: 'status',
        header: () => <div className="w-full font-medium">Status</div>,
        enableSorting: false,
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.isActive ? <StatusBadge status="success">Active</StatusBadge> : <StatusBadge status="failed">Inactive</StatusBadge>}
            </div>
        ),
    },
    {
        accessorKey: 'dailyCap',
        header: () => <div className="w-full font-medium">Daily cap</div>,
        cell: ({ row }) => <div className="font-medium">{row.original.dailyCap}</div>,
    },
    {
        accessorKey: 'timezone',
        header: () => <div className="w-full font-medium">Timezone</div>,
        cell: ({ row }) => <div className="font-medium">{row.original.timezone}</div>,
    },
    {
        accessorKey: 'hours',
        header: () => <div className="w-full font-medium">Hours</div>,
        enableSorting: false,
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.openingTime}-{row.original.closingTime}
            </div>
        ),
    },
    {
        accessorKey: 'workingDays',
        enableSorting: false,
        header: () => <div className="w-full font-medium">Working days</div>,
        cell: ({ row }) => <div className="font-medium">{formatWorkingDays(row.original.workingDays || [])}</div>,
    },
    {
        accessorKey: 'actions',
        header: '',
        enableSorting: false,
        size: 10,
        cell: ({ row }) => (
            <>
                <Button variant="ghost" className="hover:bg-transparent hover:underline" asChild>
                    <Link href={`/brokers/${row.original.id}/edit`}>
                        <Pencil className="size-4" />
                        Edit
                    </Link>
                </Button>
                <Button variant="ghost" className="hover:bg-transparent hover:underline" asChild>
                    <Link href={`/brokers/${row.original.id}/view`}>
                        <Eye className="size-4" />
                        View
                    </Link>
                </Button>
            </>
        ),
    },
];

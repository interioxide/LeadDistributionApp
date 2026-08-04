'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusBadge } from '../../status-badge';
import { formatWorkingDays } from '@/lib/string';
import Link from 'next/link';
import { ChevronRight, Pencil } from 'lucide-react';
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
            <Button variant="ghost" size="icon" className="hover:bg-transparent" asChild>
                <Link href={`/brokers/${row.original.id}/edit`}>
                    <ChevronRight className="size-4" />
                </Link>
            </Button>
        ),
    },
];

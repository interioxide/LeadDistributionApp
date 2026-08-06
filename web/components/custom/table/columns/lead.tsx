'use client';

import { ColumnDef } from '@tanstack/react-table';
import { StatusBadge } from '../../status-badge';
import { Lead, LeadStatus } from '@/lib/types/lead-schema';
import { AssignLeadDialog } from '../../lead-assign-dialog';

export const leadColumns: ColumnDef<Lead>[] = [
    {
        accessorKey: 'name',
        header: () => <div className="w-full font-medium">Lead name</div>,
        cell: ({ row }) => <div className="font-bold">{row.getValue('name')}</div>,
        size: 250,
    },
    {
        accessorKey: 'email',
        header: () => <div className="w-full font-medium">Email</div>,
        cell: ({ row }) => <div className="font-medium">{row.original.email}</div>,
    },
    {
        accessorKey: 'phone',
        header: () => <div className="w-full font-medium">Phone</div>,
        cell: ({ row }) => <div className="font-medium">{row.original.phone}</div>,
    },
    {
        accessorKey: 'ipAddress',
        header: () => <div className="w-full font-medium">IP Address</div>,
        cell: ({ row }) => <div className="font-medium">{row.original.ipAddress}</div>,
    },
    {
        accessorKey: 'broker',
        header: () => <div className="w-full font-medium">Broker</div>,
        cell: ({ row }) => <div className="font-medium">{row.original.broker?.name ?? '-'}</div>,
        enableSorting: false,
    },
    {
        accessorKey: 'status',
        header: () => <div className="w-full font-medium">Status</div>,
        cell: ({ row }) => (
            <div className="font-medium capitalize">
                {row.original.status === LeadStatus.SENT ? (
                    <StatusBadge status="success">{row.original.status}</StatusBadge>
                ) : row.original.status === LeadStatus.UNSENT ? (
                    <StatusBadge status="pending">{row.original.status}</StatusBadge>
                ) : (
                    <StatusBadge status="failed">{row.original.status}</StatusBadge>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'createdAt',
        header: () => <div className="w-full font-medium">Created</div>,
        cell: ({ row }) => (
            <div className="font-medium">
                {new Intl.DateTimeFormat(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                }).format(new Date(row.original.createdAt))}
            </div>
        ),
    },
    {
        accessorKey: 'actions',
        header: '',
        enableSorting: false,
        size: 120,
        cell: ({ row }) =>
            row.original.status === LeadStatus.UNSENT && (
                <AssignLeadDialog leadId={row.original.id} leadEmail={row.original.email} leadName={row.original.name} />
            ),
    },
];

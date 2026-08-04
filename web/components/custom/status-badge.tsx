import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Status = 'success' | 'pending' | 'failed';

interface StatusBadgeProps extends React.ComponentProps<typeof Badge> {
    status: Status;
    children?: React.ReactNode;
}

const statusConfig: Record<
    Status,
    {
        label: string;
        badgeClass: string;
        dotClass: string;
    }
> = {
    success: {
        label: 'Successful',
        badgeClass:
            'bg-green-500/10 text-green-600 border-none focus-visible:outline-none focus-visible:ring-green-500/20 dark:focus-visible:ring-green-500/40 [a]:hover:bg-green-500/5',
        dotClass: 'bg-green-600',
    },
    pending: {
        label: 'Pending',
        badgeClass:
            'bg-amber-500/10 text-amber-600 border-none focus-visible:outline-none focus-visible:ring-amber-500/20 dark:focus-visible:ring-amber-500/40 [a]:hover:bg-amber-500/5',
        dotClass: 'bg-amber-600',
    },
    failed: {
        label: 'Failed',
        badgeClass:
            'bg-destructive/10 text-destructive border-none focus-visible:outline-none focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/5',
        dotClass: 'bg-destructive',
    },
};

export function StatusBadge({ status, children, className, ...props }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <Badge className={cn(config.badgeClass, className)} {...props}>
            <span className={cn('size-1.5 rounded-full', config.dotClass)} aria-hidden="true" />
            {children ?? config.label}
        </Badge>
    );
}

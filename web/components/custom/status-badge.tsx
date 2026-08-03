import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertCircleIcon, BanIcon, CheckCircleIcon } from 'lucide-react';

type Status = 'success' | 'pending' | 'failed';

interface StatusBadgeProps extends React.ComponentProps<typeof Badge> {
    status: Status;
    children?: React.ReactNode;
}

const statusConfig: Record<
    Status,
    {
        icon: React.ElementType;
        className: string;
        label: string;
    }
> = {
    success: {
        icon: CheckCircleIcon,
        label: 'Successful',
        className:
            'rounded-sm border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 [a]:hover:bg-green-600/10 [a]:hover:text-green-600/90 dark:[a]:hover:bg-green-400/10 dark:[a]:hover:text-green-400/90',
    },
    pending: {
        icon: AlertCircleIcon,
        label: 'Pending',
        className:
            'rounded-sm border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400 [a]:hover:bg-amber-600/10 [a]:hover:text-amber-600/90 dark:[a]:hover:bg-amber-400/10 dark:[a]:hover:text-amber-400/90',
    },
    failed: {
        icon: BanIcon,
        label: 'Failed',
        className: 'rounded-sm border-destructive text-destructive [a]:hover:bg-destructive/10 [a]:hover:text-destructive/90',
    },
};

export function StatusBadge({ status, children, className, ...props }: StatusBadgeProps) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <Badge variant="outline" className={cn(config.className, className)} {...props}>
            <Icon className="size-3" />
            {children ?? config.label}
        </Badge>
    );
}

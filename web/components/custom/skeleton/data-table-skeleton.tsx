import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DataTableSkeletonProps {
    /** Number of columns to render */
    columnCount?: number;
    /** Number of rows to render */
    rowCount?: number;
    /** Custom column widths array (optional, e.g. ["100px", "200px", "auto"]) */
    columnWidths?: string[];
    /** Whether to render the pagination footer skeleton */
    showPagination?: boolean;
    /** Class name for the outer container */
    className?: string;
}

export function DataTableSkeleton({ columnCount = 5, rowCount = 5, columnWidths, showPagination = true, className }: DataTableSkeletonProps) {
    return (
        <div className={cn('w-full space-y-4', className)}>
            {/* Table Structure */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {Array.from({ length: columnCount }).map((_, colIndex) => {
                                const isFirst = colIndex === 0;
                                const isLast = colIndex === columnCount - 1;
                                const isSecondLast = colIndex === columnCount - 2;

                                return (
                                    <TableHead
                                        key={colIndex}
                                        style={{
                                            width: columnWidths?.[colIndex] || undefined,
                                        }}
                                        className={cn('h-8 px-2 border-r border-border', (isFirst || isLast || isSecondLast) && 'border-r-0')}
                                    >
                                        <Skeleton className="h-4 w-24 max-w-full" />
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: rowCount }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array.from({ length: columnCount }).map((_, colIndex) => (
                                    <TableCell key={colIndex}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Footer Skeleton */}
            {showPagination && (
                <div className="flex items-center justify-between gap-8">
                    {/* Page Size Selector */}
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-24 max-sm:hidden" />
                        <Skeleton className="h-9 w-[17.5] rounded-md" />
                    </div>

                    {/* Row Count Info */}
                    <div className="flex grow justify-end">
                        <Skeleton className="h-4 w-32" />
                    </div>

                    {/* Pagination Navigation Buttons */}
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                    </div>
                </div>
            )}
        </div>
    );
}

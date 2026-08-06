'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardMetricsSkeleton() {
    return (
        <div className="space-y-6">
            {/* Lead stat cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Card key={index}>
                        <CardContent className="pt-6 space-y-3">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-8 w-12" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Bottom cards */}
            <div className="grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index}>
                        <CardContent className="flex items-center justify-between pt-6">
                            <div className="space-y-3">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-5 w-28" />
                            </div>

                            <Skeleton className="h-9 w-9 rounded-md" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

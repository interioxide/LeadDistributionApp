import { Skeleton } from '@/components/ui/skeleton';
import { FieldGroup } from '@/components/ui/field';

export function BrokerFormSkeleton() {
    return (
        <div className="flex min-h-screen flex-1 flex-col">
            <FieldGroup className="w-full p-10">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                    ))}
                </div>

                <div className="mt-6 space-y-2">
                    <Skeleton className="h-4 w-28" />

                    <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <Skeleton key={index} className="h-10 w-14 rounded-md" />
                        ))}
                    </div>
                </div>
            </FieldGroup>

            <FieldGroup className="sticky bottom-0 mt-auto flex w-full flex-col gap-3 border-t bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-36 rounded-md" />
            </FieldGroup>
        </div>
    );
}

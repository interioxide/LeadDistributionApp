'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FieldGroup } from '@/components/ui/field';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function DistributionSkeleton() {
    return (
        <div className="w-full p-10">
            <div className="flex items-center justify-between pb-8">
                <Skeleton className="h-4 w-30 rounded-full" />
                <Skeleton className="h-7 w-48 rounded-md" />
            </div>
            <Card>
                <CardTitle className="pl-5 text-sm font-medium">
                    <Skeleton className="h-4 w-16" />
                </CardTitle>

                <CardContent>
                    <div className="flex items-start gap-3">
                        {/* Broker select */}
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        {/* Percentage */}
                        <div className="w-32 space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        {/* Button */}
                        <div className="flex flex-col justify-center">
                            <Skeleton className="mt-6 h-10 w-24 rounded-md" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="flex min-h-screen flex-1 flex-col py-5">
                <Card>
                    <CardTitle className="pl-5 text-sm font-medium">
                        <Skeleton className="h-5 w-52" />
                    </CardTitle>

                    <CardContent>
                        <FieldGroup>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <Skeleton className="h-4 w-36" />
                                        </TableHead>
                                        <TableHead>
                                            <Skeleton className="h-4 w-36" />
                                        </TableHead>
                                        <TableHead>
                                            <Skeleton className="h-4 w-36" />
                                        </TableHead>
                                        <TableHead className="w-20">
                                            <Skeleton className="h-4 w-36" />
                                        </TableHead>
                                        <TableHead className="w-10" />
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Skeleton className="h-4 w-36" />
                                            </TableCell>

                                            <TableCell>
                                                <Skeleton className="h-6 w-20 rounded-full" />
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Skeleton className="h-9 w-20" />
                                                    <Skeleton className="h-4 w-3" />
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Skeleton className="h-6 w-11 rounded-full" />
                                            </TableCell>

                                            <TableCell>
                                                <Skeleton className="h-9 w-9 rounded-md" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </FieldGroup>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

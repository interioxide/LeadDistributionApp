'use client';

import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus2 } from 'lucide-react';
import { ApiError, assignLead, getBrokers } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface AssignLeadDialogProps {
    leadId: string;
    leadName: string;
    leadEmail: string;
}

export function AssignLeadDialog({ leadId, leadName, leadEmail }: AssignLeadDialogProps) {
    const [open, setOpen] = useState(false);
    const [brokerId, setBrokerId] = useState<string>('');

    const { data: itemData, isSuccess: isItemDataSuccess } = useQuery({
        queryFn: () => getBrokers({ pagination: { pageIndex: 0, pageSize: 500 } }),
        queryKey: ['brokers'],
        refetchOnMount: 'always',
    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: assignLead,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['distributionLeads'],
            });
            toast.success('The lead has been assigned successfully to a broker.');
        },
        onError: (error: ApiError) => {
            toast.error(error.message);
        },
    });

    async function handleConfirm() {
        mutate({
            id: leadId,
            brokerId: brokerId,
        });
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button type="button" size="sm" variant="outline" onClick={(e) => e.stopPropagation()} className="cursor-pointer text-right">
                    <UserPlus2 className="size-4" />
                    Assign
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Assign lead</AlertDialogTitle>
                    <AlertDialogDescription>Manually assign this unsent lead to a broker.</AlertDialogDescription>
                </AlertDialogHeader>

                <div className="rounded-md border bg-muted/40 p-3">
                    <p className="text-sm font-medium">{leadName}</p>
                    <p className="text-xs text-muted-foreground">{leadEmail}</p>
                </div>

                <div className="space-y-2">
                    <Select value={brokerId} onValueChange={setBrokerId}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a broker" />
                        </SelectTrigger>
                        <SelectContent>
                            {isItemDataSuccess &&
                                itemData?.data.map((broker) => (
                                    <SelectItem key={broker.id} value={broker.id}>
                                        <span className="flex w-full items-center justify-between gap-2">
                                            <span>{broker.name}</span>
                                            <span className="text-xs text-muted-foreground">{broker.isActive ? 'Active' : 'Inactive'}</span>
                                        </span>
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">You can assign to any broker, even one currently closed or at capacity.</p>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setBrokerId('')}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={!brokerId || isPending} onSelect={(e) => e.preventDefault()} onClick={handleConfirm}>
                        {isPending ? 'Assigning...' : 'Confirm assignment'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

'use client';

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCurrentUser, logoutUser } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';
import { getNameInitials } from '@/lib/string';

export function NavUser({
    user,
}: {
    user: {
        name: string;
        email: string;
    };
}) {
    const router = useRouter();
    const { isMobile } = useSidebar();
    const logoutUserMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            router.replace('/login');
        },
        onError: () => {
            toast.error('Something went wrong.');
        },
    });
    const { data: userData, isSuccess: isUserDataSuccess } = useQuery({
        queryFn: getCurrentUser,
        queryKey: ['currentUser'],
    });

    const handleLogout = () => {
        logoutUserMutation.mutate();
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {isUserDataSuccess ? (
                            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarFallback className="rounded-lg">{getNameInitials(userData.data.name || '')}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{userData.data.name}</span>
                                    <span className="truncate text-xs">{userData.data.email}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        ) : (
                            <SidebarMenuButton size="lg" disabled className="pointer-events-none">
                                <Skeleton className="h-8 w-8 rounded-lg" />

                                <div className="grid flex-1 gap-1 text-left">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-3 w-40" />
                                </div>

                                <Skeleton className="ml-auto h-4 w-4 rounded" />
                            </SidebarMenuButton>
                        )}
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            {isUserDataSuccess && (
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarFallback className="rounded-lg">{getNameInitials(userData.data.name || '')}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{userData.data.name}</span>
                                        <span className="truncate text-xs">{userData.data.email}</span>
                                    </div>
                                </div>
                            )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} disabled={logoutUserMutation.isPending} className="cursor-pointer">
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

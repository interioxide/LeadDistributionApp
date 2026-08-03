'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
    LucideLayoutDashboard,
    Package,
    Warehouse,
    Users,
    Truck,
    ShoppingCart,
    Settings,
    FileSpreadsheet,
    IdCard,
    GalleryVerticalEnd,
    ChevronRight,
    ReceiptText,
    Barcode,
    FolderTree,
    TrendingUpDown,
    Boxes,
    CalendarClock,
    Hash,
    Store,
    FileText,
    GitBranch,
    Contact,
    Network,
} from 'lucide-react';
import { NavUser } from '@/components/custom/nav-user';
import { usePathname } from 'next/navigation';
import { ComponentType, SVGProps } from 'react';

const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
    },
};

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface SubMenuItem {
    title: string;
    url: string;
    icon: IconType;
    badge?: string | number;
    disabled?: boolean;
    children?: SubMenuItem[];
}

interface MenuGroup {
    label: string;
    subItems: SubMenuItem[];
}

const menuItems: MenuGroup[] = [
    {
        label: 'Overview',
        subItems: [
            {
                title: 'Dashboard',
                url: '/dashboard',
                icon: LucideLayoutDashboard,
            },
            {
                title: 'Brokers',
                url: '/reports',
                icon: Users,
            },
            {
                title: 'Form',
                url: '/reports',
                icon: FileText,
            },
            {
                title: 'Distribution',
                url: '/reports',
                icon: Network,
            },
            {
                title: 'Leads',
                url: '/reports',
                icon: Contact,
            },
        ],
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar className="m-0" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">{`App`}</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    {menuItems.map((item: MenuGroup, itemKey: number) => (
                        <SidebarGroupContent key={itemKey}>
                            <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
                            <SidebarMenu>
                                {item.subItems.map((subItem: SubMenuItem, subItemKey: number) => (
                                    <SidebarMenuItem key={subItemKey}>
                                         <SidebarMenuButton asChild isActive={pathname === subItem.url} tooltip={subItem.title}>
                                            <Link href={subItem.url}>
                                                <subItem.icon className="h-5 w-5" />
                                                <span>{subItem.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    ))}
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                {<NavUser user={data.user} />}
            </SidebarFooter>
        </Sidebar>
    );
}

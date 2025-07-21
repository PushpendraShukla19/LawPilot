'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { SheetTitle } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Database,
  FileText,
  LayoutDashboard,
  Newspaper,
  ShieldCheck,
} from 'lucide-react';
import { Logo } from '@/components/icons/logo';

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/headnote', label: 'Headnote Generation', icon: FileText },
  { href: '/database', label: 'Legal Database', icon: Database },
  { href: '/drafting', label: 'Drafting Assistant', icon: BookOpen },
  { href: '/intelligence', label: 'Web Intelligence', icon: Newspaper },
  { href: '/compliance', label: 'Compliance Engine', icon: ShieldCheck },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="size-8 text-sidebar-primary" />
          <h1 className="font-headline text-lg font-bold text-white group-data-[collapsible=icon]:hidden">
            LawPilot
          </h1>
          <div className="ml-auto md:hidden">
             {/* This trigger is for mobile, but it's part of the sheet content so it doesn't show */}
             <SidebarTrigger />
          </div>
           <div className="ml-auto hidden md:block">
             <SidebarTrigger />
           </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href} className="w-full">
                <SidebarMenuButton
                  isActive={pathname === link.href}
                  tooltip={link.label}
                >
                  <link.icon />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

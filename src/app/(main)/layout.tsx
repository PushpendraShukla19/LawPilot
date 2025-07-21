import { MainSidebar } from '@/components/layout/main-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import Link from 'next/link';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MainSidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6 md:hidden">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Link href="/" className="flex items-center gap-2 font-headline font-bold text-primary">
                    <Logo className="size-6" />
                    <span>LawPilot</span>
                </Link>
            </div>
        </header>
        <SidebarInset>
          <div className="p-4 sm:p-6 lg:p-8 min-h-svh">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Target,
  Shield,
  Library,
  Settings,
  LogOut,
  FilePlus2,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function AppHeader() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex-1">
        {/* Can add breadcrumbs or page title here */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="Ana Pérez" />}
              <AvatarFallback>AP</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Ana Pérez</p>
              <p className="text-xs leading-none text-muted-foreground">
                ana.perez@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
           <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <Link href="/">Cerrar Sesión</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-14 items-center gap-2 px-2">
            <Logo className="h-7 w-7 text-primary" />
            <span className="text-lg font-headline font-semibold">
              Éxito Académico
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarGroup>
            <SidebarGroupLabel>Estudiante</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/dashboard')}
                  tooltip="Panel de Control"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span>Panel de Control</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/goals')}
                  tooltip="Mis Metas"
                >
                  <Link href="/goals">
                    <Target />
                    <span>Mis Metas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
                <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/goals/new')}
                  tooltip="Nueva Meta"
                >
                  <Link href="/goals/new">
                    <FilePlus2 />
                    <span>Nueva Meta</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Administrador</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/admin/dashboard')}
                  tooltip="Panel Admin"
                >
                  <Link href="/admin/dashboard">
                    <Shield />
                    <span>Panel Admin</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/admin/templates')}
                  tooltip="Plantillas"
                >
                  <Link href="/admin/templates">
                    <Library />
                    <span>Plantillas de Metas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/settings')} tooltip="Configuración">
                <Link href="#">
                  <Settings />
                  <span>Configuración</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Cerrar Sesión">
                <Link href="/">
                  <LogOut />
                  <span>Cerrar Sesión</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

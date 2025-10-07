'use client';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import {
  LayoutDashboard,
  Target,
  Shield,
  Library,
  Settings,
  LogOut,
  FilePlus2,
  BookMarked,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { setupMocksIfNeeded } from '@/mocks/enable-preview';
import { TelemetryProvider, createMockTelemetry } from '@/hooks/use-telemetry';

type ClientSession = {
  email: string;
  role: 'admin' | 'user';
  name?: string | null;
};

type AppHeaderProps = {
  displayName: string;
  displayEmail: string;
  onLogout: () => void | Promise<void>;
};

function AppHeader({ displayName, displayEmail, onLogout }: AppHeaderProps) {
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
              {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={displayName} />}
              <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{displayEmail}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              onLogout();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [session, setSession] = useState<ClientSession | null>(null);
  const isPreview = searchParams?.get('preview') === '1';

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      if (isPreview) {
        await setupMocksIfNeeded();
      }

      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('session request failed');
        }

        const data = (await response.json()) as { session?: ClientSession | null };
        if (active) {
          setSession(data.session ?? null);
        }
      } catch (error) {
        console.error('No se pudo cargar la sesión', error);
        if (active) {
          setSession(null);
        }
      }
    };

    void hydrate();

    return () => {
      active = false;
    };
  }, [isPreview]);

  const telemetry = useMemo(() => (isPreview ? createMockTelemetry() : undefined), [isPreview]);
  const isActive = (path: string) => pathname === path;
  const isAdmin = session?.role === 'admin';
  const displayName = session?.name ?? session?.email?.split('@')[0] ?? 'Ana Pérez';
  const displayEmail = session?.email ?? 'ana.perez@example.com';

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    } finally {
      setSession(null);
      router.replace('/login');
    }
  }

  return (
    <TelemetryProvider value={telemetry}>
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
                  isActive={isActive('/goal-bank')}
                  tooltip="Generador de metas"
                >
                  <Link href="/goal-bank">
                    <BookMarked />
                    <span>Generador de metas</span>
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
          {isAdmin ? (
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
          ) : null}
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
              <SidebarMenuButton asChild tooltip="Cerrar sesión">
                <button type="button" onClick={() => void handleLogout()} className="flex w-full items-center gap-2">
                  <LogOut />
                  <span>Cerrar sesión</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader displayName={displayName} displayEmail={displayEmail} onLogout={handleLogout} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
      </SidebarProvider>
    </TelemetryProvider>
  );
}

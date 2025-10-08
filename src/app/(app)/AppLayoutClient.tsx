'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Target,
  Shield,
  Library,
  Settings,
  LogOut,
  FilePlus2,
  BookMarked,
  Users,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { setupMocksIfNeeded } from '@/mocks/enable-preview';
import { TelemetryProvider, createMockTelemetry } from '@/hooks/use-telemetry';
import { useAuth } from '@/lib/auth/context';

function AppHeader({ onLogout }: { onLogout: () => void | Promise<void> }) {
  const { user } = useAuth();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const displayName = user?.displayName ?? user?.email?.split('@')[0] ?? 'Invitado';
  const displayEmail = user?.email ?? 'sin-sesión';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex-1" />
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

export function AppLayoutClient({
  children,
  authProvider,
}: {
  children: React.ReactNode;
  authProvider: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, setUser, refresh } = useAuth();
  const isPreview = searchParams?.get('preview') === '1';
  const telemetry = useMemo(() => (isPreview ? createMockTelemetry() : undefined), [isPreview]);
  const isFirebaseAuth = authProvider === 'firebase';
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    let cancelled = false;
    const bootstrap = async () => {
      if (isPreview) {
        await setupMocksIfNeeded();
        if (!cancelled) {
          await refresh().catch((error) => {
            console.error('Failed to hydrate auth during preview', error);
          });
        }
      }
    };
    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [isPreview, refresh]);

  const isActive = (path: string) => pathname === path;
  const displayName = user?.displayName ?? user?.email?.split('@')[0] ?? 'Iniciando…';

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    } finally {
      if (isFirebaseAuth) {
        try {
          const [{ getFirebaseAuth }, authModule] = await Promise.all([
            import('@/lib/auth/firebase-client'),
            import('firebase/auth'),
          ]);
          await authModule.signOut(getFirebaseAuth());
        } catch (firebaseError) {
          console.error('Error al cerrar sesión de Firebase', firebaseError);
        }
      }
      setUser(null);
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
              <span className="text-lg font-headline font-semibold">Éxito Académico</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel>Estudiante</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/dashboard')} tooltip="Panel de Control">
                    <Link href="/dashboard">
                      <LayoutDashboard />
                      <span>Panel de Control</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/goal-bank')} tooltip="Generador de metas">
                    <Link href="/goal-bank">
                      <Target />
                      <span>Generador de metas</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/goals')} tooltip="Mis metas">
                    <Link href="/goals">
                      <Library />
                      <span>Mis metas</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/goals/new')} tooltip="Crear meta">
                    <Link href="/goals/new">
                      <FilePlus2 />
                      <span>Nueva meta</span>
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
                    <SidebarMenuButton asChild isActive={isActive('/admin/dashboard')} tooltip="Panel admin">
                      <Link href="/admin/dashboard">
                        <Shield />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/admin/templates')} tooltip="Plantillas">
                    <Link href="/admin/templates">
                      <BookMarked />
                      <span>Plantillas</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/admin/students')} tooltip="Perfiles estudiantiles">
                    <Link href="/admin/students">
                      <Users />
                      <span>Estudiantes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            ) : null}
          </SidebarContent>
          <SidebarFooter className="border-t p-2 text-xs text-muted-foreground">
            Sesión iniciada como {displayName}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <AppHeader onLogout={handleLogout} />
          <main className="flex-1 bg-muted/20 p-4 sm:p-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TelemetryProvider>
  );
}

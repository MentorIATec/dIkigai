'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

type RoleOption = 'user' | 'admin';

type LoginClientProps = {
  authProvider: 'dev' | 'firebase' | string;
  next?: string;
};

export function LoginClient({ authProvider, next = '/dashboard' }: LoginClientProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleOption>('user');
  const [submitting, setSubmitting] = useState(false);
  const isDevProvider = authProvider === 'dev';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isDevProvider) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });

      if (!response.ok) {
        throw new Error('No se pudo iniciar sesión');
      }

      router.replace(next);
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isDevProvider) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Conecta tu proveedor de autenticación</h1>
          <p className="text-muted-foreground">
            Esta instalación está configurada para utilizar un proveedor externo (por ejemplo, Firebase Auth). Completa la integración para habilitar el inicio de sesión.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">Regresar a inicio</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-background p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-headline font-semibold">Iniciar sesión (entorno de desarrollo)</h1>
          <p className="text-sm text-muted-foreground">
            Usa este formulario para simular una sesión. Cuando la integración con el proveedor real esté lista, reemplaza este flujo por el inicio de sesión institucional.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Correo electrónico
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ana.perez@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Rol</label>
            <Select value={role} onValueChange={(value) => setRole(value as RoleOption)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuario</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </Button>
        </form>
        <p className="text-center text-xs text-muted-foreground">
          Después de autenticarte, serás redirigido a <span className="font-medium">{next}</span>.
        </p>
      </div>
    </main>
  );
}

export default LoginClient;

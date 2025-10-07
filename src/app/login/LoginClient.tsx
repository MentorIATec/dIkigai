'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sendEmailVerification, signInWithPopup, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getFirebaseAuth, getGoogleProvider } from '@/lib/auth/firebase-client';

type RoleOption = 'student' | 'mentor' | 'admin';

type LoginClientProps = {
  authProvider: 'dev' | 'firebase' | string;
  next?: string;
};

export function LoginClient({ authProvider, next = '/dashboard' }: LoginClientProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleOption>('student');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'error' | 'info'; message: string } | null>(null);
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const isDevProvider = authProvider === 'dev';
  const isFirebaseProvider = authProvider === 'firebase';
  const feedbackMessage = feedback?.message ?? null;
  const feedbackClassName = feedback?.kind === 'info' ? 'text-emerald-600' : 'text-destructive';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isDevProvider) {
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    setShowVerificationPrompt(false);
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
      setFeedback({ kind: 'error', message: 'Ocurrió un error al iniciar sesión.' });
    } finally {
      setSubmitting(false);
    }
  }

  const handleFirebaseLogin = useCallback(async () => {
    if (!isFirebaseProvider) {
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    setShowVerificationPrompt(false);
    try {
      const auth = getFirebaseAuth();
      const provider = getGoogleProvider();
      const credentials = await signInWithPopup(auth, provider);
      const idToken = await credentials.user.getIdToken(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          const data = (await response.json().catch(() => null)) as { error?: string } | null;
          if (data?.error === 'email_not_verified') {
            setFeedback({
              kind: 'error',
              message: 'Tu correo aún no ha sido verificado. Revisa tu bandeja y vuelve a intentarlo.',
            });
            setShowVerificationPrompt(true);
          } else if (data?.error === 'domain_not_allowed') {
            setFeedback({
              kind: 'error',
              message: 'Tu correo no pertenece a un dominio permitido. Usa tu cuenta institucional.',
            });
          } else {
            setFeedback({ kind: 'error', message: 'No pudimos validar tu cuenta. Inténtalo más tarde.' });
          }
        } else {
          setFeedback({ kind: 'error', message: 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.' });
        }
        await signOut(getFirebaseAuth()).catch(() => {});
        return;
      }

      router.replace(next);
    } catch (error) {
      console.error('Firebase login failed', error);
      setFeedback({ kind: 'error', message: 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.' });
    } finally {
      setSubmitting(false);
    }
  }, [isFirebaseProvider, next, router]);

  const handleFirebaseLogout = useCallback(async () => {
    if (!isFirebaseProvider) {
      return;
    }
    setSubmitting(true);
    setFeedback(null);
    try {
      await Promise.allSettled([
        fetch('/api/auth/logout', { method: 'POST' }),
        signOut(getFirebaseAuth()),
      ]);
    } catch (error) {
      console.error('Firebase logout failed', error);
      setFeedback({ kind: 'error', message: 'No se pudo cerrar la sesión actual.' });
    } finally {
      setSubmitting(false);
      setShowVerificationPrompt(false);
    }
  }, [isFirebaseProvider]);

  const handleSendVerification = useCallback(async () => {
    const auth = getFirebaseAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setFeedback({ kind: 'error', message: 'Inicia sesión con tu cuenta para reenviar la verificación.' });
      return;
    }
    setSubmitting(true);
    setFeedback(null);
    try {
      await sendEmailVerification(currentUser);
      setFeedback({ kind: 'info', message: 'Enviamos un correo de verificación. Revisa tu bandeja.' });
    } catch (error) {
      console.error('Failed to send verification email', error);
      setFeedback({ kind: 'error', message: 'No se pudo enviar el correo de verificación. Inténtalo más tarde.' });
    } finally {
      setSubmitting(false);
    }
  }, []);

  if (isFirebaseProvider) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-6">
        <div className="w-full max-w-md space-y-6 rounded-lg bg-background p-8 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-headline font-semibold">Iniciar sesión</h1>
            <p className="text-sm text-muted-foreground">
              Usa tu cuenta institucional para generar una cookie de sesión segura. Después podrás administrar tus metas desde el panel.
            </p>
          </div>
          <div className="space-y-4">
            <Button className="w-full" disabled={submitting} onClick={handleFirebaseLogin}>
              {submitting ? 'Conectando…' : 'Continuar con Google'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={submitting}
              onClick={handleFirebaseLogout}
            >
              Cerrar sesión local
            </Button>
          </div>
          {feedbackMessage ? (
            <p className={`text-center text-sm ${feedbackClassName}`}>{feedbackMessage}</p>
          ) : null}
          {showVerificationPrompt ? (
            <div className="space-y-3 text-center text-sm">
              <p className="text-muted-foreground">
                Si ya verificaste tu correo, vuelve a intentar con el botón de Google. También puedes reenviar la verificación.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={submitting}
                onClick={handleSendVerification}
              >
                Reenviar correo de verificación
              </Button>
            </div>
          ) : null}
          <p className="text-center text-xs text-muted-foreground">
            Después de autenticarte, te redirigiremos a <span className="font-medium">{next}</span>.
          </p>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/">Regresar a inicio</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!isDevProvider) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Proveedor de autenticación no configurado</h1>
          <p className="text-muted-foreground">
            Define AUTH_PROVIDER como <code className="rounded bg-muted px-1">dev</code> o <code className="rounded bg-muted px-1">firebase</code> para habilitar el inicio de sesión.
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
                <SelectItem value="student">Estudiante</SelectItem>
                <SelectItem value="mentor">Mentor/a</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </Button>
        </form>
        {feedbackMessage ? (
          <p className={`text-center text-sm ${feedbackClassName}`}>{feedbackMessage}</p>
        ) : null}
        <p className="text-center text-xs text-muted-foreground">
          Después de autenticarte, serás redirigido a <span className="font-medium">{next}</span>.
        </p>
      </div>
    </main>
  );
}

export default LoginClient;

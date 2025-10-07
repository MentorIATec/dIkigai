import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-landing');

  return (
    <main className="flex flex-col min-h-screen">
      <header className="container z-40 bg-transparent">
        <div className="flex h-20 items-center justify-between py-6">
            <Link href="/" className="flex items-center space-x-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                </svg>
                <span className="font-bold font-headline">Éxito Académico</span>
            </Link>
        </div>
      </header>
      <section className="flex-1 flex items-center justify-center py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            {heroImage && (
              <div className="relative mx-auto aspect-video overflow-hidden rounded-xl sm:w-full lg:order-last lg:aspect-square">
                 <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    data-ai-hint={heroImage.imageHint}
                    fill
                    className="object-cover"
                 />
              </div>
            )}
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-accent">
                  Alcanza tu Máximo Potencial Académico
                </h1>
                <p className="max-w-[600px] text-foreground/80 md:text-xl">
                  Nuestra plataforma te ayuda a establecer y seguir metas SMARTER, diseñadas para estudiantes universitarios como tú. Organiza tus objetivos por semestre y observa tu progreso como nunca antes.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Portal del Estudiante <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/admin/dashboard">
                    Panel de Administrador
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

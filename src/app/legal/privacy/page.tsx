export const metadata = {
  title: 'Política de Privacidad Estudiantil',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-headline font-semibold">Política de Privacidad Estudiantil</h1>
        <p className="text-sm text-muted-foreground">Versión 1.0 · Última actualización: Mayo 2024</p>
      </header>
      <section className="space-y-3 text-sm leading-6 text-muted-foreground">
        <p>
          Esta plataforma recopila información académica y de bienestar para sugerir metas personalizadas. Solo solicitamos los
          datos estrictamente necesarios y nunca compartimos tu matrícula completa con otras personas estudiantes.
        </p>
        <p>
          La matrícula completa se cifra con AES-256-GCM y se almacena en una colección privada. Los reportes generales solo
          muestran los últimos cuatro dígitos. El personal administrador accede a la matrícula completa únicamente para tareas
          operativas y cada acceso queda registrado en un log de auditoría.
        </p>
        <p>
          Puedes solicitar la actualización o eliminación de tus datos escribiendo al equipo de coordinación académica. Para más
          detalles sobre derechos ARCO y avisos de privacidad institucionales consulta la normativa de tu campus.
        </p>
        <p>
          Si tienes dudas sobre esta política, contáctanos en <a className="underline" href="mailto:soporte@digitalikigai.mx">soporte@digitalikigai.mx</a>.
        </p>
      </section>
    </main>
  );
}

// Manifest de la app de la tablet. Hay uno por dispositivo porque start_url
// tiene que incluir el Código Dumont: así, al instalar la página en la
// pantalla de inicio ("Agregar a pantalla de inicio" en Chrome), la app se
// abre directo en SU pantalla y en modo pantalla completa, sin barra del
// navegador y sin necesidad de tocar nada.

export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  const { codigoDumont } = await params;
  const codigo = encodeURIComponent(codigoDumont);

  const manifest = {
    name: 'DuMont Pantalla',
    short_name: 'DuMont',
    start_url: `/tablet/${codigo}`,
    scope: `/tablet/${codigo}`,
    display: 'fullscreen',
    display_override: ['fullscreen', 'standalone'],
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      { src: '/DuMontLogo.jpeg', sizes: '192x192', type: 'image/jpeg' },
      { src: '/DuMontLogo.jpeg', sizes: '512x512', type: 'image/jpeg' },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: { 'Content-Type': 'application/manifest+json' },
  });
}

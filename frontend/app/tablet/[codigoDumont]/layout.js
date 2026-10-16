// Enlaza el manifest propio de cada pantalla (ver manifest.webmanifest/route.js)
// para poder instalarla como app en pantalla completa.
export async function generateMetadata({ params }) {
  const { codigoDumont } = await params;
  const codigo = encodeURIComponent(codigoDumont);

  return {
    manifest: `/tablet/${codigo}/manifest.webmanifest`,
    appleWebApp: { capable: true, statusBarStyle: 'black' },
  };
}

export default function TabletDispositivoLayout({ children }) {
  return children;
}

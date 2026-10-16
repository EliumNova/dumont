export const metadata = {
  title: 'DuMont Tablet',
  description: 'Pantalla publicitaria DuMont',
  // El Código Dumont es un número largo (14 dígitos) y Safari/iOS lo
  // detecta como si fuera un teléfono, envolviéndolo en un link antes de
  // que React termine de hidratar la página — eso rompe la hidratación
  // (error visto al abrir /tablet/... desde un iPhone). Esto lo desactiva.
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
};

// Layout propio para la app de tablet: sin navbar ni sidebar de admin,
// pantalla completa y fondo negro para evitar flashes blancos al cargar.
export default function TabletLayout({ children }) {
  return (
    <div className="w-screen h-screen bg-black text-white overflow-hidden">
      {children}
    </div>
  );
}

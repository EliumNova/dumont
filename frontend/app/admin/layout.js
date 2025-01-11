import Navbar from './components/Navbar';

const BackgroundImage = ({ src, style }) => {
  return (
    <div
      className="absolute inset-0 bg-cover bg-no-repeat bg-center opacity-10"
      style={{
        backgroundImage: `url(${src})`,
        ...style,
      }}
    ></div>
  );
};

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col w-full bg-[#060627] overflow-hidden">
      {/* Fondo dinámico */}
      <BackgroundImage
        src="/logodumont.png"
        style={{ backgroundSize: 'contain' }}
      />

      {/* Header y navbar */}
      <header className="relative z-10">
        <Navbar />
      </header>

      {/* Contenido principal */}
      <main className="z-10 flex-grow h-full">{children}</main>

      {/* Pie de página (opcional) */}
      <footer className="relative z-10 text-center text-white py-4">
        © 2024 Tu Empresa. Todos los derechos reservados.
      </footer>
    </div>
  );
}

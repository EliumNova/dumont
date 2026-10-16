import Navbar from "./components/Navbar";
import AuthGuard from "./components/AuthGuard";

const BackgroundImage = ({ src, style }) => {
  return (
    <div
      className="absolute inset-0 bg-cover bg-no-repeat bg-center opacity-10"
      style={{
        backgroundImage: `url(${src})`,
        ...style,
      }}></div>
  );
};

export default function Layout({ children }) {
  return (
    <AuthGuard>
    {/* bg-[#060f3a] */}
    <div className="flex flex-col w-full h-[100dvh] relative bg-[#060f3a] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: "url(/logodumont.png)",
          backgroundSize: "cover",
        }}></div>
      {/* <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: 'url(/background.png)', backgroundSize: 'cover' }}
      ></div> */}
      {/* z-30: el menú del perfil debe quedar por encima del contenido (z-10) para recibir los clics */}
      <div className="relative z-30 flex-grow flex flex-col">
        <Navbar />
      </div>

      {/* Contenido principal */}
      <main className="z-10 flex-grow h-full">{children}</main>
    </div>
    </AuthGuard>
  );
}

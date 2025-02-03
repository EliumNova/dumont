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
    // bg-[#060f3a]
    <div className="flex flex-col w-full h-screen relative bg-[#060f3a] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: 'url(/logodumont.jpg)',
          backgroundSize: 'contain',
        }}
      ></div>
      {/* <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: 'url(/background.png)', backgroundSize: 'cover' }}
      ></div> */}
      <div className="relative z-10 flex-grow flex flex-col">
        <Navbar />
      </div>

      {/* Contenido principal */}
      <main className="z-10 flex-grow h-full">{children}</main>
    </div>
  );
}

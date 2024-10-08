import Navbar from './components/Navbar';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col w-full h-screen relative bg-[#060627] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center opacity-10"
        style={{ backgroundImage: 'url(/logodumont.png)', backgroundSize: 'contain' }}
      ></div>
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: 'url(/background.png)', backgroundSize: 'cover' }}
      ></div>
      <div className="relative z-10 flex-grow flex flex-col">
        <Navbar />
        <div className="relative z-20 flex-grow">{children}</div>
      </div>
    </div>
  );
}

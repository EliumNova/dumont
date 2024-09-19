import Navbar from './components/Navbar';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col w-full h-auto ">
      <div className="">
        <Navbar />
      </div>
      <div className="bg-[#F2F5F6]">{children}</div>
    </div>
  );
}

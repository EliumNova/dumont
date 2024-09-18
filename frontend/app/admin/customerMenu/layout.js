export const metadata = {
    title: "Menú de Clientes",
    description: "...",
  };
  export default function Layout({ children }) {
    return (
      <div className="flex flex-col w-full h-auto ">
        <div className="bg-[#F2F5F6]">{children}</div>
      </div>
    );
  }
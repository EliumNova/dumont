export const metadata = {
  title: 'Registro de Usuarios',
  description: '...',
};
export default function Layout({ children }) {
  return (
    <div className="flex flex-col w-full h-auto ">
      <div className="bg-[#06062780] m-2 lg:mx-12 rounded-2xl">{children}</div>
    </div>
  );
}

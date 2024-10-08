export const metadata = {
  title: 'Menú de Usuarios',
  description: '...',
};
export default function Layout({ children }) {
  return (
    <div className="flex flex-col w-full h-screen ">
      <div>{children}</div>
         
    </div>
  );
}

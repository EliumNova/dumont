export const metadata = {
  title: 'Menú de Clientes',
  description: '...',
};
export default function Layout({ children }) {
  return (
    <div className="flex flex-col w-full h-screen mt-5">
      <div>{children}</div>
         
    </div>
  );
}

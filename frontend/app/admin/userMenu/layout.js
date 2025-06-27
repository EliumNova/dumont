export const metadata = {
  title: 'Menú de Usuarios',
  description: '...',
};
export default function Layout({ children }) {
  return (
    <div className="flex flex-col w-screen h-screen mt-5 mx-5">
      <div>{children}</div>
         
    </div>
  );
}

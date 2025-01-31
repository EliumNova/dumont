export const metadata = {
  title: 'Comunicación',
  description: '...',
};
export default function Layout({ children }) {
  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <div>{children}</div>
         
    </div>
  );
}

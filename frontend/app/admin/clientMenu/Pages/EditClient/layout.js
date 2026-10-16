export const metadata = {
  title: 'Edición de Cliente',
  description: '...',
};

export default function Layout({ children }) {
  return (
    <div className="h-full overflow-y-auto px-3 py-3 lg:px-10">
      <div className="mac-glass mx-auto max-w-7xl rounded-3xl">{children}</div>
    </div>
  );
}

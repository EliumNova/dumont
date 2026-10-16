export const metadata = {
  title: 'Edición de Cliente',
  description: '...',
};

export default function Layout({ children }) {
  return (
    <div className="h-full overflow-y-auto px-3 py-4 lg:px-12">
      <div className="mac-glass mx-auto max-w-6xl rounded-3xl">{children}</div>
    </div>
  );
}

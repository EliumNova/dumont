import { Inter } from 'next/font/google';
import './globals.css';

import StoreProvider from './StoreProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DuMont',
  description: 'Panel de gestión de pantallas DuMont',
};

// Necesario para que el sitio sea responsive en celulares y tablets.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}

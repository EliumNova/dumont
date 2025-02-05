'use client';
import { useRef, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '../lib/store'; // Asegúrate de que la ruta es correcta
import { useRouter } from 'next/navigation';

export default function StoreProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const storeRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Aquí puedes verificar si el usuario está autenticado.
    // Ejemplo usando localStorage (puedes modificarlo según tu flujo de autenticación)
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      setIsAuthenticated(true);
    } else {
      // Redirigir a login si no está autenticado
      router.push('/login');
    }
  }, [router]);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  if (!isAuthenticated) {
    // Mientras no esté autenticado, podrías mostrar un loading o redirigir
    return <div>Loading...</div>;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}

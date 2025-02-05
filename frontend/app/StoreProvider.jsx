'use client';
import { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { makeStore } from '../lib/store';
import { setUser, setToken, setAuthenticated } from '../lib/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function StoreProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [store, setStore] = useState(null); // Usamos useState para almacenar el store
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      if (user && token) {
        dispatch(setUser(user));
        dispatch(setToken(token));
        dispatch(setAuthenticated(true));
      } else {
        router.push('/login');
      }

      setStore(makeStore()); // Establecer el store después de verificar el usuario
    }

    setIsLoading(false); // Marcar como no cargando después de verificar
  }, [dispatch, router]);

  if (isLoading || !store) {
    return <div>Loading...</div>;  // O puedes mostrar algo de carga mientras se crea el store
  }

  return <Provider store={store}>{children}</Provider>;
}

'use client';
import { useRef, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { makeStore } from '../lib/store'; // Asegúrate de que la ruta es correcta
import { setUser, setToken, setAuthenticated } from '../lib/slices/authSlice'; // Acciones de Redux
import { useRouter } from 'next/navigation';

export default function StoreProvider({ children }) {
  const dispatch = useDispatch();
  const storeRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Intentamos recuperar los datos del usuario desde localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token'); // Asumiendo que también almacenas el token

    console.log('user:', user);
    console.log('token:', token);

    if (user && token) {
      // Si el usuario está autenticado, despachamos las acciones de Redux
      dispatch(setUser(user));
      dispatch(setToken(token));
      dispatch(setAuthenticated(true));
    } else {
      // Si no está autenticado, redirigimos al login
      console.log('Redirigiendo a login');
      router.push('/login');
    }
  }, [dispatch, router]);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { leerTokenLocal } from '@/lib/slices/authAction';

// La raíz del sitio no tiene contenido propio: si hay una sesión vigente va
// directo al panel, y si no, al login.
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const payload = token ? leerTokenLocal(token) : null;
    const vigente = payload?.exp ? payload.exp * 1000 > Date.now() : !!payload;
    router.replace(vigente ? '/admin' : '/login');
  }, [router]);

  return null;
}

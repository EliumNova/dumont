'use client';
import { useRef, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '../lib/store';

export default function StoreProvider({ children }) {
  const storeRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    storeRef.current = makeStore();
    setIsReady(true);
  }, []);

  if (!isReady) return null; // Evita el render hasta que Redux esté listo

  return <Provider store={storeRef.current}>{children}</Provider>;
}

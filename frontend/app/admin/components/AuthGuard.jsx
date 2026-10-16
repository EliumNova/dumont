"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { initializeAuth } from "@/lib/slices/authAction";

// Protege todo /admin en el navegador: restaura la sesión (usuario en Redux) y,
// si no hay un token vigente, manda al login. La seguridad real está en el
// backend (cada endpoint exige JWT); esto evita ver pantallas vacías o con
// errores cuando la sesión venció.
export default function AuthGuard({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const hayCesion = dispatch(initializeAuth());
    if (hayCesion) {
      setListo(true);
    } else {
      router.replace("/login");
    }
  }, [dispatch, router]);

  if (!listo) return null;
  return children;
}

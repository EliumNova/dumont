import axios from "axios";

// Interceptor global: agrega "Authorization: Bearer <token>" a los pedidos
// hacia nuestra API (el login guarda el token en localStorage["authToken"]).
// No pisa un header Authorization que ya venga seteado en el pedido.
let instalado = false;

export function installAxiosAuth() {
  if (instalado || typeof window === "undefined") return;
  instalado = true;

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

  axios.interceptors.request.use((config) => {
    const url = config.url || "";
    const esNuestraApi =
      url.startsWith("/api") || (apiBase && url.startsWith(apiBase));
    if (!esNuestraApi) return config;

    const token = window.localStorage.getItem("authToken");
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

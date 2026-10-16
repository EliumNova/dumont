import axios from "axios";

// Interceptores globales (se instalan una sola vez desde StoreProvider):
//  1. Agrega "Authorization: Bearer <token>" a los pedidos hacia nuestra API
//     (el login guarda el token en localStorage["authToken"]), tanto en axios
//     como en fetch().
//  2. Si la API responde 401 (token vencido/inválido), cierra la sesión local y
//     manda al login. Se exceptúan los endpoints de login, donde un 401 solo
//     significa "credenciales incorrectas".
let instalado = false;

const RUTAS_PUBLICAS = ["/api/usuarios/login", "/api/usuarios/confirmVerify"];

export function cerrarSesionLocal() {
  try {
    window.localStorage.removeItem("authToken");
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("isAuthenticated");
  } catch {
    /* sin storage */
  }
}

export function installAxiosAuth() {
  if (instalado || typeof window === "undefined") return;
  instalado = true;

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

  const esNuestraApi = (url) =>
    typeof url === "string" &&
    (url.startsWith("/api") || (apiBase && url.startsWith(apiBase)));

  const esPublica = (url) => RUTAS_PUBLICAS.some((r) => String(url).includes(r));

  const irAlLogin = () => {
    cerrarSesionLocal();
    if (!window.location.pathname.startsWith("/login")) {
      window.location.replace("/login");
    }
  };

  axios.interceptors.request.use((config) => {
    if (!esNuestraApi(config.url || "")) return config;

    const token = window.localStorage.getItem("authToken");
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    (res) => res,
    (error) => {
      const url = error.config?.url || "";
      if (
        error.response?.status === 401 &&
        esNuestraApi(url) &&
        !esPublica(url) &&
        window.location.pathname.startsWith("/admin")
      ) {
        irAlLogin();
      }
      return Promise.reject(error);
    }
  );

  // fetch() nativo: algunas pantallas del admin lo usan directamente.
  const fetchOriginal = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url;
    if (esNuestraApi(url || "")) {
      const token = window.localStorage.getItem("authToken");
      if (token) {
        const headers = new Headers(init.headers || (input instanceof Request ? input.headers : undefined));
        if (!headers.has("Authorization")) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return fetchOriginal(input, { ...init, headers });
      }
    }
    return fetchOriginal(input, init);
  };
}

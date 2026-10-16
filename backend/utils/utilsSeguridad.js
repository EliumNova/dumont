// Seguridad HTTP sin dependencias extra (equivalente liviano a helmet +
// express-rate-limit). Si más adelante se prefiere helmet/express-rate-limit,
// se reemplazan estas dos funciones sin tocar el resto.

// Cabeceras de seguridad. No se pone CSP acá porque este backend solo sirve
// JSON y archivos multimedia (la CSP corresponde al frontend).
export const securityHeaders = (_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  // Los archivos de /uploads los consume el frontend desde otro dominio.
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.removeHeader("X-Powered-By");
  next();
};

// Limitador de pedidos por ventana de tiempo, en memoria (suficiente para una
// sola instancia de Render). keyFn permite limitar por IP, por IP+email, etc.
export const rateLimit = ({
  windowMs = 60_000,
  max = 60,
  keyFn = (req) => req.ip,
  message = "Demasiados pedidos, intentá de nuevo en unos minutos.",
} = {}) => {
  const golpes = new Map(); // clave -> { n, reset }

  // Limpieza periódica para que el Map no crezca sin límite.
  const limpieza = setInterval(() => {
    const ahora = Date.now();
    for (const [k, v] of golpes) if (v.reset <= ahora) golpes.delete(k);
  }, windowMs);
  limpieza.unref?.();

  return (req, res, next) => {
    const clave = keyFn(req);
    const ahora = Date.now();
    let reg = golpes.get(clave);
    if (!reg || reg.reset <= ahora) {
      reg = { n: 0, reset: ahora + windowMs };
      golpes.set(clave, reg);
    }
    reg.n += 1;
    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader("RateLimit-Remaining", String(Math.max(max - reg.n, 0)));
    if (reg.n > max) {
      res.setHeader("Retry-After", String(Math.ceil((reg.reset - ahora) / 1000)));
      return res.status(429).send({ message });
    }
    return next();
  };
};

// Para limpiar el contador de un login exitoso (no castigar al usuario legítimo).
export const claveLogin = (req) =>
  `${req.ip}|${String(req.body?.Email || "").toLowerCase().slice(0, 80)}`;

// Formateo para MOSTRAR + validación. Lo que se guarda en la base de datos
// siempre es el valor "crudo" (solo dígitos): el formato es solo visual.

export const soloDigitos = (v) => String(v ?? "").replace(/\D/g, "");

// ── Teléfono (Argentina) ──
// "1155555555" -> "11 5555-5555"   |   "5491155555555" -> "+54 9 11 5555-5555"
export const formatTelefono = (v) => {
  const raw = String(v ?? "");
  // Valores viejos con formato propio (ej. "02202-439793"): se muestran tal cual.
  if (/[^\d\s()+-]/.test(raw)) return raw;
  let d = soloDigitos(raw).slice(0, 13);
  let prefijo = "";
  if (d.startsWith("54") && d.length > 2) {
    prefijo = "+54 ";
    d = d.slice(2);
    if (d.startsWith("9")) {
      prefijo += "9 ";
      d = d.slice(1);
    }
  }
  if (d.length <= 2) return prefijo + d;
  if (d.length <= 6) return `${prefijo}${d.slice(0, 2)} ${d.slice(2)}`;
  return `${prefijo}${d.slice(0, 2)} ${d.slice(2, 6)}-${d.slice(6)}`;
};

// ── DNI: "12345678" -> "12.345.678" ──
export const formatDNI = (v) => {
  const d = soloDigitos(v).slice(0, 8);
  return d.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// ── CUIT/CUIL: "20123456789" -> "20-12345678-9" ──
export const formatCUIT = (v) => {
  const d = soloDigitos(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 10) return `${d.slice(0, 2)}-${d.slice(2)}`;
  return `${d.slice(0, 2)}-${d.slice(2, 10)}-${d.slice(10)}`;
};

export const FORMATOS = {
  telefono: { formatear: formatTelefono, maxDigitos: 13, inputMode: "tel" },
  dni: { formatear: formatDNI, maxDigitos: 8, inputMode: "numeric" },
  cuit: { formatear: formatCUIT, maxDigitos: 11, inputMode: "numeric" },
  numero: { formatear: (v) => soloDigitos(v), maxDigitos: 10, inputMode: "numeric" },
};

// ── Validaciones: devuelven un mensaje de error o "" si está bien ──
export const validarRequerido = (v, nombre = "Este campo") =>
  String(v ?? "").trim() ? "" : `${nombre} es obligatorio.`;

export const validarEmail = (v) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(v ?? "").trim())
    ? ""
    : "Ingresá un correo válido (ej. nombre@dominio.com).";

export const validarTelefono = (v) => {
  const d = soloDigitos(v);
  return d.length >= 8 && d.length <= 13 ? "" : "Ingresá un teléfono válido (8 a 13 dígitos).";
};

export const validarDNI = (v) => {
  const d = soloDigitos(v);
  return d.length >= 7 && d.length <= 8 ? "" : "El DNI debe tener 7 u 8 dígitos.";
};

export const validarCUIT = (v) => {
  const d = soloDigitos(v);
  if (d.length !== 11) return "El CUIT debe tener 11 dígitos.";
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = pesos.reduce((a, p, i) => a + p * Number(d[i]), 0);
  let verificador = 11 - (suma % 11);
  if (verificador === 11) verificador = 0;
  if (verificador === 10) verificador = 9;
  return verificador === Number(d[10]) ? "" : "El CUIT no es válido (dígito verificador incorrecto).";
};

// Contraseña: 10+ caracteres, letra, número y símbolo (misma regla de siempre).
export const validarPassword = (v) =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{10,}$/.test(String(v ?? ""))
    ? ""
    : "Mínimo 10 caracteres, con una letra, un número y un símbolo.";

// Nombre de persona/comercio: letras (con acentos), números, espacios y signos comunes.
export const validarNombre = (v, nombre = "El nombre") => {
  const t = String(v ?? "").trim();
  if (t.length < 2) return `${nombre} debe tener al menos 2 caracteres.`;
  return "";
};

// Corre varias reglas sobre un objeto y devuelve { campo: mensaje } (vacío = ok).
export const validarFormulario = (valores, reglas) => {
  const errores = {};
  Object.entries(reglas).forEach(([campo, regla]) => {
    const msg = regla(valores[campo], valores);
    if (msg) errores[campo] = msg;
  });
  return errores;
};

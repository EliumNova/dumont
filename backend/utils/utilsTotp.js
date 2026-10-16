import crypto from "crypto";

// TOTP (RFC 6238) implementado con el módulo crypto de Node: sin dependencias
// nuevas. Compatible con Google Authenticator, Microsoft Authenticator, Authy,
// 1Password, etc. (SHA-1, 6 dígitos, 30 s).

const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const PASO_SEGUNDOS = 30;
const DIGITOS = 6;

export const base32Encode = (buffer) => {
  let bits = 0;
  let valor = 0;
  let salida = "";
  for (const byte of buffer) {
    valor = (valor << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      salida += ALFABETO[(valor >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) salida += ALFABETO[(valor << (5 - bits)) & 31];
  return salida;
};

export const base32Decode = (texto) => {
  const limpio = String(texto).replace(/=+$/, "").replace(/\s+/g, "").toUpperCase();
  let bits = 0;
  let valor = 0;
  const bytes = [];
  for (const c of limpio) {
    const idx = ALFABETO.indexOf(c);
    if (idx === -1) throw new Error("Base32 inválido");
    valor = (valor << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((valor >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
};

export const generarSecreto = () => base32Encode(crypto.randomBytes(20));

const hotp = (secretoBase32, contador) => {
  const clave = base32Decode(secretoBase32);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(contador));
  const hmac = crypto.createHmac("sha1", clave).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const codigo =
    ((hmac[offset] & 0x7f) << 24) |
    (hmac[offset + 1] << 16) |
    (hmac[offset + 2] << 8) |
    hmac[offset + 3];
  return String(codigo % 10 ** DIGITOS).padStart(DIGITOS, "0");
};

// Acepta el código actual y ±1 paso (tolera desfasajes de reloj de ~30 s).
// Devuelve el contador del paso válido (para impedir reusar el mismo código)
// o null si no coincide.
export const verificarTotp = (secretoBase32, codigo, ventana = 1) => {
  const limpio = String(codigo || "").replace(/\s+/g, "");
  if (!/^\d{6}$/.test(limpio)) return null;
  const actual = Math.floor(Date.now() / 1000 / PASO_SEGUNDOS);
  for (let d = -ventana; d <= ventana; d += 1) {
    const esperado = hotp(secretoBase32, actual + d);
    const a = Buffer.from(esperado);
    const b = Buffer.from(limpio);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) return actual + d;
  }
  return null;
};

export const urlOtpauth = (secreto, cuenta, emisor = "DuMont") =>
  `otpauth://totp/${encodeURIComponent(emisor)}:${encodeURIComponent(cuenta)}` +
  `?secret=${secreto}&issuer=${encodeURIComponent(emisor)}&algorithm=SHA1&digits=${DIGITOS}&period=${PASO_SEGUNDOS}`;

// ── Cifrado del secreto en la base (AES-256-GCM, clave derivada de JWT_SECRET)
const claveCifrado = () =>
  crypto.createHash("sha256").update(String(process.env.JWT_SECRET)).digest();

export const cifrar = (texto) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", claveCifrado(), iv);
  const enc = Buffer.concat([cipher.update(texto, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), enc].map((b) => b.toString("base64")).join(".");
};

export const descifrar = (payload) => {
  const [iv, tag, enc] = String(payload).split(".").map((p) => Buffer.from(p, "base64"));
  const decipher = crypto.createDecipheriv("aes-256-gcm", claveCifrado(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
};

// ── Códigos de recuperación (un solo uso) ─────────────────────────────────
const hashCodigo = (c) =>
  crypto.createHash("sha256").update(String(c).toUpperCase().replace(/[^A-Z0-9]/g, "")).digest("hex");

export const generarCodigosRecuperacion = (cantidad = 8) => {
  const claros = Array.from({ length: cantidad }, () => {
    const raw = base32Encode(crypto.randomBytes(5)).slice(0, 8);
    return `${raw.slice(0, 4)}-${raw.slice(4)}`;
  });
  return { claros, hashes: claros.map(hashCodigo) };
};

// Devuelve la lista sin el código usado, o null si no coincide con ninguno.
export const consumirCodigoRecuperacion = (hashesGuardados, codigo) => {
  const h = hashCodigo(codigo);
  const idx = hashesGuardados.indexOf(h);
  if (idx === -1) return null;
  return hashesGuardados.filter((_, i) => i !== idx);
};

// Generador de códigos QR sin dependencias (modo byte, corrección de errores
// nivel M, versiones 1 a 10: hasta ~213 bytes, de sobra para un link otpauth://).
// Se usa para el QR de la verificación en 2 pasos.

// ── Aritmética GF(256) para Reed-Solomon ──
const EXP = new Array(512);
const LOG = new Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 256) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i += 1) EXP[i] = EXP[i - 255];
})();
const mul = (a, b) => (a && b ? EXP[LOG[a] + LOG[b]] : 0);

const rsGenerador = (grado) => {
  let g = [1];
  for (let i = 0; i < grado; i += 1) {
    const ng = new Array(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j += 1) {
      ng[j] ^= g[j];
      ng[j + 1] ^= mul(g[j], EXP[i]);
    }
    g = ng;
  }
  return g;
};

const rsResto = (datos, gen) => {
  const res = new Array(gen.length - 1).fill(0);
  for (const b of datos) {
    const f = b ^ res.shift();
    res.push(0);
    if (f) for (let i = 0; i < res.length; i += 1) res[i] ^= mul(gen[i + 1], f);
  }
  return res;
};

// Nivel M, versiones 1..10: [ecc por bloque, bloques grupo 1, datos grupo 1, bloques grupo 2, datos grupo 2]
const TABLA_M = [
  null,
  [10, 1, 16, 0, 0],
  [16, 1, 28, 0, 0],
  [26, 1, 44, 0, 0],
  [18, 2, 32, 0, 0],
  [24, 2, 43, 0, 0],
  [16, 4, 27, 0, 0],
  [18, 4, 31, 0, 0],
  [22, 2, 38, 2, 39],
  [22, 3, 36, 2, 37],
  [26, 4, 43, 1, 44],
];
const ALINEACION = [
  null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50],
];

const capacidadDatos = (v) => {
  const [, n1, d1, n2, d2] = TABLA_M[v];
  return n1 * d1 + n2 * d2;
};

const codificarDatos = (bytes) => {
  let version = 0;
  for (let v = 1; v <= 10; v += 1) {
    const bitsCuenta = v <= 9 ? 8 : 16;
    if (Math.ceil((4 + bitsCuenta + 8 * bytes.length) / 8) <= capacidadDatos(v)) {
      version = v;
      break;
    }
  }
  if (!version) throw new Error("Texto demasiado largo para el QR");

  const bits = [];
  const poner = (valor, cant) => {
    for (let i = cant - 1; i >= 0; i -= 1) bits.push((valor >>> i) & 1);
  };
  poner(0b0100, 4);
  poner(bytes.length, version <= 9 ? 8 : 16);
  bytes.forEach((b) => poner(b, 8));
  const total = capacidadDatos(version) * 8;
  poner(0, Math.min(4, total - bits.length));
  while (bits.length % 8) bits.push(0);
  const cw = [];
  for (let i = 0; i < bits.length; i += 8) {
    cw.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));
  }
  for (let pad = 0xec; cw.length < capacidadDatos(version); pad ^= 0xec ^ 0x11) cw.push(pad);
  return { version, cw };
};

const intercalar = (version, datos) => {
  const [ecc, n1, d1, n2, d2] = TABLA_M[version];
  const gen = rsGenerador(ecc);
  const bloques = [];
  let pos = 0;
  for (let i = 0; i < n1 + n2; i += 1) {
    const largo = i < n1 ? d1 : d2;
    const d = datos.slice(pos, pos + largo);
    pos += largo;
    bloques.push({ d, e: rsResto(d, gen) });
  }
  const salida = [];
  const maxD = Math.max(d1, d2);
  for (let i = 0; i < maxD; i += 1) bloques.forEach((b) => i < b.d.length && salida.push(b.d[i]));
  for (let i = 0; i < ecc; i += 1) bloques.forEach((b) => salida.push(b.e[i]));
  return salida;
};

const MASCARAS = [
  (x, y) => (x + y) % 2 === 0,
  (x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

const penalidad = (m) => {
  const n = m.length;
  let p = 0;
  const lineas = [];
  for (let i = 0; i < n; i += 1) {
    lineas.push(m[i]);
    lineas.push(m.map((fila) => fila[i]));
  }
  const patron = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
  const inverso = [...patron].reverse();
  for (const l of lineas) {
    let corrida = 1;
    for (let i = 1; i < n; i += 1) {
      if (l[i] === l[i - 1]) {
        corrida += 1;
        if (corrida === 5) p += 3;
        else if (corrida > 5) p += 1;
      } else corrida = 1;
    }
    for (let i = 0; i + 11 <= n; i += 1) {
      const t = l.slice(i, i + 11).map(Number);
      if (t.every((v, k) => v === patron[k]) || t.every((v, k) => v === inverso[k])) p += 40;
    }
  }
  for (let y = 0; y < n - 1; y += 1) {
    for (let x = 0; x < n - 1; x += 1) {
      const c = m[y][x];
      if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) p += 3;
    }
  }
  const oscuros = m.reduce((a, f) => a + f.filter(Boolean).length, 0);
  p += Math.floor(Math.abs((oscuros * 100) / (n * n) - 50) / 5) * 10;
  return p;
};

// Devuelve la matriz del QR (true = módulo oscuro).
export function qrMatriz(texto) {
  const bytes = Array.from(new TextEncoder().encode(texto));
  const { version, cw } = codificarDatos(bytes);
  const datos = intercalar(version, cw);
  const n = 17 + 4 * version;
  const m = Array.from({ length: n }, () => new Array(n).fill(false));
  const fn = Array.from({ length: n }, () => new Array(n).fill(false));
  const set = (x, y, v) => {
    m[y][x] = v;
    fn[y][x] = true;
  };

  // Patrones de ubicación
  [[3, 3], [n - 4, 3], [3, n - 4]].forEach(([cx, cy]) => {
    for (let dy = -4; dy <= 4; dy += 1) {
      for (let dx = -4; dx <= 4; dx += 1) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || y < 0 || x >= n || y >= n) continue;
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        set(x, y, d !== 2 && d !== 4);
      }
    }
  });
  // Sincronización
  for (let i = 8; i < n - 8; i += 1) {
    set(i, 6, i % 2 === 0);
    set(6, i, i % 2 === 0);
  }
  // Alineación
  const pos = ALINEACION[version];
  pos.forEach((cy, i) => {
    pos.forEach((cx, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === pos.length - 1) || (i === pos.length - 1 && j === 0)) return;
      for (let dy = -2; dy <= 2; dy += 1) {
        for (let dx = -2; dx <= 2; dx += 1) {
          set(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    });
  });

  const dibujarFormato = (mascara) => {
    const d = mascara; // nivel M = 00
    let r = d;
    for (let i = 0; i < 10; i += 1) r = (r << 1) ^ ((r >>> 9) * 0x537);
    const bits = ((d << 10) | r) ^ 0x5412;
    const b = (i) => ((bits >>> i) & 1) !== 0;
    for (let i = 0; i <= 5; i += 1) set(8, i, b(i));
    set(8, 7, b(6));
    set(8, 8, b(7));
    set(7, 8, b(8));
    for (let i = 9; i < 15; i += 1) set(14 - i, 8, b(i));
    for (let i = 0; i < 8; i += 1) set(n - 1 - i, 8, b(i));
    for (let i = 8; i < 15; i += 1) set(8, n - 15 + i, b(i));
    set(8, n - 8, true);
  };
  dibujarFormato(0);

  if (version >= 7) {
    let r = version;
    for (let i = 0; i < 12; i += 1) r = (r << 1) ^ ((r >>> 11) * 0x1f25);
    const bits = (version << 12) | r;
    for (let i = 0; i < 18; i += 1) {
      const bit = ((bits >>> i) & 1) !== 0;
      const a = n - 11 + (i % 3);
      const c = Math.floor(i / 3);
      set(a, c, bit);
      set(c, a, bit);
    }
  }

  // Colocar datos en zigzag
  let k = 0;
  for (let derecha = n - 1; derecha >= 1; derecha -= 2) {
    if (derecha === 6) derecha = 5;
    for (let vert = 0; vert < n; vert += 1) {
      for (let j = 0; j < 2; j += 1) {
        const x = derecha - j;
        const arriba = ((derecha + 1) & 2) === 0;
        const y = arriba ? n - 1 - vert : vert;
        if (!fn[y][x] && k < datos.length * 8) {
          m[y][x] = ((datos[k >>> 3] >>> (7 - (k & 7))) & 1) !== 0;
          k += 1;
        }
      }
    }
  }

  const aplicar = (mascara) => {
    for (let y = 0; y < n; y += 1) {
      for (let x = 0; x < n; x += 1) {
        if (!fn[y][x] && MASCARAS[mascara](x, y)) m[y][x] = !m[y][x];
      }
    }
  };
  let mejor = 0;
  let mejorP = Infinity;
  for (let mk = 0; mk < 8; mk += 1) {
    aplicar(mk);
    dibujarFormato(mk);
    const p = penalidad(m);
    if (p < mejorP) {
      mejorP = p;
      mejor = mk;
    }
    aplicar(mk);
  }
  aplicar(mejor);
  dibujarFormato(mejor);
  return m;
}

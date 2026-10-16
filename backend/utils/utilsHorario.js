// Utilidades para interpretar el HorarioVenta de un cliente (o el
// HorarioPublicitario de un dispositivo) y decidir si "ahora" cae dentro de
// ese horario. El formato lo arma el frontend (CustomerEdition.js /
// Horus.jsx): "HH:MM - HH:MM" para un solo turno, o
// "HH:MM - HH:MM / HH:MM - HH:MM" para doble turno (mañana y tarde).

const TIMEZONE = 'America/Argentina/Buenos_Aires';

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map((n) => parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const parseRango = (rango) => {
  const partes = rango.split('-').map((p) => p.trim());
  if (partes.length !== 2) return null;
  const desde = toMinutes(partes[0]);
  const hasta = toMinutes(partes[1]);
  if (desde == null || hasta == null) return null;
  return { desde, hasta };
};

// Devuelve un array de rangos { desde, hasta } (en minutos desde medianoche)
// a partir del string de horario. Si no puede parsear nada, devuelve [].
export const parseHorarioVenta = (horarioVenta) => {
  if (!horarioVenta || typeof horarioVenta !== 'string') return [];

  return horarioVenta
    .split('/')
    .map((rango) => parseRango(rango))
    .filter(Boolean);
};

// Minutos transcurridos desde medianoche, en la zona horaria de Argentina,
// para el instante `date` (por defecto ahora).
const minutosAhora = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const hour = parseInt(parts.find((p) => p.type === 'hour').value, 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute').value, 10);
  return hour * 60 + minute;
};

// True si el instante `date` cae dentro de alguno de los rangos del
// horario. Soporta rangos que cruzan medianoche (ej. "20:00 - 02:00").
export const estaEnHorario = (horarioVenta, date = new Date()) => {
  const rangos = parseHorarioVenta(horarioVenta);
  if (rangos.length === 0) return true; // sin horario cargado: siempre activo

  const ahora = minutosAhora(date);

  return rangos.some(({ desde, hasta }) => {
    if (desde <= hasta) {
      return ahora >= desde && ahora <= hasta;
    }
    // Rango que cruza la medianoche, ej 20:00 - 02:00
    return ahora >= desde || ahora <= hasta;
  });
};

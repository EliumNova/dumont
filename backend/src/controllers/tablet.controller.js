import expressAsyncHandler from 'express-async-handler';
import { Op } from 'sequelize';
import { Dispositivos } from '../models/Dispositivos.js';
import { Clientes } from '../models/Clientes.js';
import { MultimediaAsignacion } from '../models/MultimediaAsignacion.js';
import { Multimedia } from '../models/Multimedia.js';
import { estaEnHorario } from '../../utils/utilsHorario.js';

// Contacto de soporte técnico que se muestra en la tablet ("Atención al
// cliente" del spec original). Se puede mover a variables de entorno sin
// tocar código.
const SOPORTE = {
  telefono: process.env.SOPORTE_TELEFONO || '',
  whatsapp: process.env.SOPORTE_WHATSAPP || '',
  email: process.env.SOPORTE_EMAIL || '',
};

// Minutos sin heartbeat después de los cuales consideramos la tablet
// "offline" (además de lo que reporte el propio navegador de la tablet).
const MINUTOS_OFFLINE = 3;

// Segundos sin latido tras los cuales otro dispositivo puede tomar el link
// (la tablet avisa cada 15 s, así que tolera ~3 avisos perdidos).
const SESION_TIMEOUT_SEG = 50;

const resolverDispositivoYCliente = async (codigoDumont) => {
  const dispositivo = await Dispositivos.findOne({ where: { CodigoDumont: codigoDumont } });
  const cliente = await Clientes.findOne({ where: { CodigoDumont: codigoDumont } });
  return { dispositivo, cliente };
};

const resolverPlaylist = async (cliente) => {
  if (!cliente) return [];

  const asignaciones = await MultimediaAsignacion.findAll({
    where: {
      [Op.or]: [
        { CodigoDumont: cliente.CodigoDumont },
        { CodigoDistribuidor: cliente.CodigoDistribuidor },
        { Segmentacion: cliente.Segmentacion },
      ],
    },
    include: [{ model: Multimedia, as: 'Multimedia' }],
    order: [['orden', 'ASC'], ['createdAt', 'ASC']],
  });

  // Puede haber duplicados si el mismo contenido matchea por más de un
  // criterio (ej. asignado tanto al distribuidor como al segmento); nos
  // quedamos con una sola aparición por idMultimedia.
  const vistos = new Set();
  const playlist = [];

  for (const asignacion of asignaciones) {
    const media = asignacion.Multimedia;
    if (!media || vistos.has(media.idMultimedia)) continue;
    vistos.add(media.idMultimedia);
    playlist.push({
      idMultimedia: media.idMultimedia,
      url: media.url,
      tipo: media.tipo,
      duracionSegundos: media.duracionSegundos,
    });
  }

  return playlist;
};

// Endpoint que la tablet llama periódicamente (cada 30-60s). Reporta su
// estado (y opcionalmente GPS) y recibe de vuelta qué tiene que mostrar.
const sync = expressAsyncHandler(async (req, res) => {
  try {
    const { codigoDumont } = req.params;
    const { latitud, longitud } = req.body || {};

    const { dispositivo, cliente } = await resolverDispositivoYCliente(codigoDumont);

    if (!dispositivo || !cliente) {
      return res.status(404).send({
        message: 'No se encontró ningún dispositivo con ese Código Dumont',
        soporte: SOPORTE,
      });
    }

    // ── Link de un solo dispositivo ──
    // Cada navegador manda un identificador propio (`sesion`). El primero que
    // llega "toma" el link; mientras siga latiendo, cualquier otro identificador
    // es rechazado con 409. Si deja de latir (SESION_TIMEOUT_SEG), otro puede
    // tomarlo. Es un UPDATE condicional, así que dos pedidos simultáneos no
    // pueden quedarse los dos con el link.
    const sesion = typeof req.body?.sesion === 'string' ? req.body.sesion : '';
    if (!/^[A-Za-z0-9_-]{16,64}$/.test(sesion)) {
      return res.status(400).send({ message: 'Falta el identificador de la pantalla' });
    }
    const ahora = new Date();
    const limite = new Date(ahora.getTime() - SESION_TIMEOUT_SEG * 1000);
    const [tomado] = await Dispositivos.update(
      { SesionToken: sesion, SesionUltimoLatido: ahora },
      {
        where: {
          idDispositivos: dispositivo.idDispositivos,
          [Op.or]: [
            { SesionToken: null },
            { SesionToken: sesion },
            { SesionUltimoLatido: null },
            { SesionUltimoLatido: { [Op.lt]: limite } },
          ],
        },
      }
    );
    if (!tomado) {
      return res.status(409).send({
        code: 'EN_USO',
        message: 'Esta pantalla ya está abierta en otro dispositivo',
        soporte: SOPORTE,
      });
    }

    dispositivo.UltimaConexion = ahora;
    if (latitud != null && longitud != null) {
      dispositivo.latitud = String(latitud);
      dispositivo.longitud = String(longitud);
    }
    await dispositivo.save({ fields: ['UltimaConexion', 'latitud', 'longitud'] });

    const horarioAUsar = dispositivo.HorarioPublicitario || cliente.HorarioVenta;
    const enHorario = estaEnHorario(horarioAUsar);
    const playlist = await resolverPlaylist(cliente);

    res.send({
      cliente: {
        nombre: cliente.NombreCompleto,
        segmentacion: cliente.Segmentacion,
        horarioVenta: cliente.HorarioVenta,
        codigoDistribuidor: cliente.CodigoDistribuidor,
        codigoCliente: cliente.CodigoCliente,
      },
      dispositivo: {
        marca: dispositivo.Marca,
        modelo: dispositivo.Modelo,
        codigoDumont: dispositivo.CodigoDumont,
      },
      enHorario,
      playlist,
      soporte: SOPORTE,
      servidorHoraISO: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error en tablet.sync:', error);
    res.status(500).send({ message: 'Error interno del servidor' });
  }
});

// Estado "online/offline" calculado a partir del último heartbeat, para
// mostrarlo en el panel de admin (devicesMenu).
const getEstadoConexion = expressAsyncHandler(async (req, res) => {
  try {
    const { codigoDumont } = req.params;
    const dispositivo = await Dispositivos.findOne({
      where: { CodigoDumont: codigoDumont },
    });

    if (!dispositivo) {
      return res.status(404).send({ message: 'Dispositivo no encontrado' });
    }

    const online =
      !!dispositivo.UltimaConexion &&
      (Date.now() - new Date(dispositivo.UltimaConexion).getTime()) / 60000 <
        MINUTOS_OFFLINE;

    res.send({
      online,
      ultimaConexion: dispositivo.UltimaConexion,
    });
  } catch (error) {
    console.error('Error en tablet.getEstadoConexion:', error);
    res.status(500).send({ message: 'Error interno del servidor' });
  }
});

const tabletController = {
  sync,
  getEstadoConexion,
};

export default tabletController;

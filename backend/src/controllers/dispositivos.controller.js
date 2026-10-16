import expressAsyncHandler from 'express-async-handler';
import { Dispositivos } from '../models/Dispositivos.js';
import { handleError } from '../../utils/utilsErrors.js';
import { Clientes } from '../models/Clientes.js';
import { Op } from 'sequelize';

const getDispositivos = expressAsyncHandler(async (req, res) => {
  try {
    const { page = 0, pageSize = 5 } = req.query;

    const { count, rows } = await Dispositivos.findAndCountAll({
      limit: +pageSize,
      offset: +page * +pageSize,
      distinct: true,
      order: [
        ['Marca', 'ASC'],
        ['NumSerie', 'ASC'],
      ],
      include: [{ model: Clientes, as: 'Cliente' }],
    });

    // Enviar la respuesta con count y rows
    res.json({ count, rows });
  } catch (error) {
    handleError(error, res);
  }
});

export const getAllDispositivosNoPaginate = async (req, res) => {
  try {
    // Antes se filtraba a solo dispositivos con latitud/longitud propias,
    // pero eso deja afuera a los que dependen de la coordenada de respaldo
    // del cliente (ver Clientes.Latitud/Longitud). El mapa ahora decide él
    // mismo qué mostrar, así que acá mandamos todos los que tengan AL MENOS
    // una de las dos fuentes de ubicación.
    const dispositivos = await Dispositivos.findAll({
      include: [
        {
          model: Clientes,
          as: 'Cliente',
        },
      ],
    });

    const conUbicacion = dispositivos.filter(
      (d) =>
        (d.latitud && d.longitud) ||
        (d.Cliente?.Latitud && d.Cliente?.Longitud)
    );

    res.status(200).json(conUbicacion);
  } catch (error) {
    console.error('Error al obtener dispositivos sin paginación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getDispositivoById = expressAsyncHandler(async (req, res) => {
  try {
    const dispositivo = await Dispositivos.findByPk(req.params.id);
    res.send(dispositivo);
  } catch (error) {
    handleError(error, res);
  }
});

const createDispositivo = expressAsyncHandler(async (req, res) => {
  try {
    const { Marca, Modelo, NumSerie, CodigoCliente } = req.body;

    // CodigoCliente acá es el CÓDIGO DE NEGOCIO del cliente (ej. "1002"),
    // no su idClientes (UUID) — confirmado por la constraint real de la
    // base (FK Dispositivos.CodigoCliente -> Clientes.CodigoCliente).
    const cliente = await Clientes.findOne({ where: { CodigoCliente } });

    if (!cliente) {
      return res.status(404).send({ message: 'Cliente no encontrado' });
    }

    // El Código Dumont no lo elige el usuario: es el mismo que ya tiene
    // asignado el cliente (se generó al darlo de alta), así se garantiza
    // que dispositivo y cliente queden unívocamente vinculados.
    const newDispositivo = await Dispositivos.create({
      Marca,
      Modelo,
      NumSerie,
      CodigoCliente,
      CodigoDumont: cliente.CodigoDumont,
      latitud: cliente.Latitud,
      longitud: cliente.Longitud,
    });

    res.send(newDispositivo);
  } catch (error) {
    handleError(error, res);
  }
});

const updateDispositivo = expressAsyncHandler(async (req, res) => {
  try {
    const dispositivo = await Dispositivos.findByPk(req.params.id);
    if (dispositivo) {
      const { Marca, Modelo, NumSerie, CodigoCliente, HorarioPublicitario } =
        req.body;
      if (HorarioPublicitario !== undefined) {
        dispositivo.HorarioPublicitario =
          HorarioPublicitario === null || HorarioPublicitario === ''
            ? null
            : String(HorarioPublicitario).slice(0, 100);
      }
      const clienteCambio =
        CodigoCliente && CodigoCliente !== dispositivo.CodigoCliente;

      dispositivo.Marca = Marca ?? dispositivo.Marca;
      dispositivo.Modelo = Modelo ?? dispositivo.Modelo;
      dispositivo.NumSerie = NumSerie ?? dispositivo.NumSerie;
      dispositivo.CodigoCliente = CodigoCliente ?? dispositivo.CodigoCliente;

      // Si cambió el cliente asociado, el Código Dumont y la ubicación se
      // vuelven a derivar del nuevo cliente (idem lógica del alta): el
      // usuario nunca los edita a mano.
      if (clienteCambio) {
        const cliente = await Clientes.findOne({ where: { CodigoCliente } });
        if (!cliente) {
          return res.status(404).send({ message: 'Cliente no encontrado' });
        }
        dispositivo.CodigoDumont = cliente.CodigoDumont;
        dispositivo.latitud = cliente.Latitud;
        dispositivo.longitud = cliente.Longitud;
      }

      await dispositivo.save();
      res.send(dispositivo);
    } else {
      res.status(404).send({ message: 'Dispositivo no encontrado' });
    }
  } catch (error) {
    handleError(error, res);
  }
});

// Libera el link de la pantalla (quita al dispositivo que lo tenía tomado) para
// que otro navegador pueda abrirlo de inmediato, sin esperar el timeout.
const liberarSesion = expressAsyncHandler(async (req, res) => {
  try {
    const [n] = await Dispositivos.update(
      { SesionToken: null, SesionUltimoLatido: null },
      { where: { idDispositivos: req.params.id } }
    );
    if (!n) return res.status(404).send({ message: 'Dispositivo no encontrado' });
    res.send({ message: 'Enlace liberado' });
  } catch (error) {
    handleError(error, res);
  }
});

const deleteDispositivo = expressAsyncHandler(async (req, res) => {
  try {
    await Dispositivos.destroy({
      where: {
        idDispositivos: req.params.id,
      },
    });
    res.send({ message: 'Dispositivo eliminado' });
  } catch (error) {
    handleError(error, res);
  }
});

const dispositivoController = {
  getDispositivos,
  getDispositivoById,
  createDispositivo,
  updateDispositivo,
  deleteDispositivo,
  liberarSesion,
  getAllDispositivosNoPaginate,
};

export default dispositivoController;

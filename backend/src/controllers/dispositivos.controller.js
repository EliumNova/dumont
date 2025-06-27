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
    const dispositivos = await Dispositivos.findAll({
      where: {
        latitud: { [Op.ne]: null },
        longitud: { [Op.ne]: null },
      },
      include: [
        {
          model: Clientes,
          as: 'Cliente',
        },
      ],
    });

    res.status(200).json(dispositivos);
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
    const { Marca, Modelo, NumSerie, CodigoCliente, CodigoDumont } = req.body;

    const cliente = await Clientes.findOne({
      where: { CodigoCliente },
    });

    if (!cliente) {
      return res.status(404).send({ message: 'Cliente no encontrado' });
    }

    const newDispositivo = await Dispositivos.create({
      Marca,
      Modelo,
      NumSerie,
      CodigoCliente,
      CodigoDumont,
      latitud: cliente.latitud,
      longitud: cliente.longitud,
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
      const { Marca, Modelo, NumSerie, CodigoCliente, CodigoDumont } = req.body;

      dispositivo.Marca = Marca ?? dispositivo.Marca;
      dispositivo.Modelo = Modelo ?? dispositivo.Modelo;
      dispositivo.NumSerie = NumSerie ?? dispositivo.NumSerie;
      dispositivo.CodigoCliente = CodigoCliente ?? dispositivo.CodigoCliente;
      dispositivo.CodigoDumont = CodigoDumont ?? dispositivo.CodigoDumont;

      if (CodigoDumont) {
        const cliente = await Clientes.findOne({ where: { CodigoDumont } });
        if (cliente) {
          dispositivo.latitud = cliente.latitud;
          dispositivo.longitud = cliente.longitud;
        }
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
  getAllDispositivosNoPaginate,
};

export default dispositivoController;

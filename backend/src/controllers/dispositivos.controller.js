import expressAsyncHandler from "express-async-handler";
import { Dispositivos } from "../models/Dispositivos.js";
import { handleError } from "../../utils/utilsErrors.js";
import { Clientes } from "../models/Clientes.js";

const getDispositivos = expressAsyncHandler(async (req, res) => {
  try {
    const { page = 0, pageSize = 5 } = req.query;
    console.log({ page, pageSize });
    let options = {
      limit: +pageSize,
      offset: +page * +pageSize,
    };
    const { count, rows } = await Dispositivos.findAndCountAll(options);
    res.send({ count, rows });
  } catch (error) {
    handleError(error, res);
  }
});

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
    const { Marca, Modelo, NumPulgadas, NumSerie, idClientes } = req.body;
    const cliente = await Clientes.findByPk(idClientes);
    if (!cliente) {
      return res.status(404).send({ message: "Cliente no encontrado" });
    }
    const newDispositivo = new Dispositivos({
      Marca,
      Modelo,
      NumPulgadas,
      NumSerie,
      idClientes: cliente.id,
    });
    const dispositivo = await newDispositivo.save();
    res.send(dispositivo);
  } catch (error) {
    handleError(error, res);
  }
});

const updateDispositivo = expressAsyncHandler(async (req, res) => {
  try {
    const dispositivo = await Dispositivos.findByPk(req.params.id);
    if (dispositivo) {
      const { Marca, Modelo, NumPulgadas, NumSerie, idClientes } = req.body;

      dispositivo.Marca = Marca ?? dispositivo.Marca;
      dispositivo.Modelo = Modelo ?? dispositivo.Modelo;
      dispositivo.NumPulgadas = NumPulgadas ?? dispositivo.NumPulgadas;
      dispositivo.NumSerie = NumSerie ?? dispositivo.NumSerie;
      dispositivo.idClientes = idClientes ?? dispositivo.Client;
      await dispositivo.save();
      res.send(dispositivo);
    } else {
      res.status(404).send({ message: "Dispositivo no encontrado" });
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
    res.send({ message: "Dispositivo eliminado" });
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
};

export default dispositivoController;

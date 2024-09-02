import expressAsyncHandler from "express-async-handler";
import { Clientes } from "../models/Clientes.js";
import { Dispositivos } from "../models/Dispositivos.js";
import { generateToken } from "../../utils/utilsClientes.js";
import { handleError } from "../../utils/utilsErrors.js";

const createCliente = expressAsyncHandler(async (req, res) => {
  try {
    const {
      CodigoCliente,
      CodigoDistribuidor,
      Segmentacion,
      Localidad,
      Calle,
      EntreCalles,
      Telefono,
      Email,
      VentaAlcohol,
      WebPage,
      HorarioVenta,
      HorarioOnOffDispositivos,
      HorarioPublicitario,
      AtencionAlCliente,
    } = req.body;
    const newCliente = new Clientes({
      CodigoCliente,
      CodigoDistribuidor,
      Segmentacion,
      Localidad,
      Calle,
      EntreCalles,
      Telefono,
      Email,
      VentaAlcohol,
      WebPage,
      HorarioVenta,
      HorarioOnOffDispositivos,
      HorarioPublicitario,
      AtencionAlCliente,
    });
    const cliente = await newCliente.save();
    const token = generateToken(newCliente);
    console.log(process.env.JWT_SECRET);
    res.send({ cliente, token });
  } catch (error) {
    handleError(error, res);
  }
});

const getClientes = expressAsyncHandler(async (req, res) => {
  try {
    const { page = 0, pageSize = 5 } = req.query;
    console.log({ page, pageSize });
    let options = {
      limit: +pageSize,
      offset: +page * +pageSize,
    };
    const { count, rows } = await Clientes.findAndCountAll(options);
    res.send({ count, rows });
  } catch (error) {
    handleError(error, res);
  }
});

const getClienteById = expressAsyncHandler(async (req, res) => {
  try {
    const cliente = await Clientes.findByPk(req.params.id);
    if (cliente) {
      const dispositivos = await cliente.getDispositivos();
      console.log(dispositivos);
      res.send({ cliente, dispositivos });
    } else {
      res.status(404).send({ message: "Cliente no encontrado" });
    }
  } catch (error) {
    handleError(error, res);
  }
});

const updateCliente = expressAsyncHandler(async (req, res) => {
  try {
    const {
      CodigoCliente,
      CodigoDistribuidor,
      Segmentacion,
      Localidad,
      Calle,
      EntreCalles,
      Telefono,
      Email,
      VentaAlcohol,
      WebPage,
      HorarioVenta,
      HorarioOnOffDispositivos,
    } = req.body;
    const cliente = await Clientes.findByPk(req.params.id);
    if (cliente) {
      cliente.CodigoCliente = CodigoCliente ?? cliente.CodigoCliente;
      cliente.CodigoDistribuidor =
        CodigoDistribuidor ?? cliente.CodigoDistribuidor;
      cliente.Segmentacion = Segmentacion ?? cliente.Segmentacion;
      cliente.Localidad = Localidad ?? cliente.Localidad;
      cliente.Calle = Calle ?? cliente.Calle;
      cliente.EntreCalles = EntreCalles ?? cliente.EntreCalles;
      cliente.Telefono = Telefono ?? cliente.Telefono;
      cliente.Email = Email ?? cliente.Email;
      cliente.VentaAlcohol = VentaAlcohol ?? cliente.VentaAlcohol;
      cliente.WebPage = WebPage ?? cliente.WebPage;
      cliente.HorarioVenta = HorarioVenta ?? cliente.HorarioVenta;
      cliente.HorarioOnOffDispositivos =
        HorarioOnOffDispositivos ?? cliente.HorarioOnOffDispositivos;
      const updatedCliente = await cliente.save();
      res.send(updatedCliente);
    } else {
      res.status(404).send({ message: "Cliente no encontrado" });
    }
  } catch (error) {
    handleError(error, res);
  }
});

const deleteCliente = expressAsyncHandler(async (req, res) => {
  try {
    await Clientes.destroy({
      where: {
        idClientes: req.params.id,
      },
    });
    res.send({ message: "Cliente eliminado" });
  } catch (error) {
    handleError(error, res);
  }
});

const getDispositivosByCliente = expressAsyncHandler(async (req, res) => {
  try {
    const { page = 0, pageSize = 5 } = req.query;
    console.log({ page, pageSize });
    let options = {
      limit: +pageSize,
      offset: +page * +pageSize,
    };
    const { count, rows } = await Dispositivos.findAndCountAll({
      where: {
        idClientes: req.params.id,
      },
      limit: options.limit,
      offset: options.offset,
    });
    if (rows) {
      res.send({ count, rows });
    } else {
      res.status(404).send({ message: "Cliente no encontrado" });
    }
  } catch (error) {
    handleError(error, res);
  }
});

const getDispositivosByClienteByParams = expressAsyncHandler(
  async (req, res) => {
    try {
      //transformar query params en objeto
      const query = JSON.parse(req.params.options);
      const { page = 0, pageSize = 5 } = req.query;
      console.log({ page, pageSize, ...query });
      let options = {
        limit: +pageSize,
        offset: +page * +pageSize,
      };
      const cliente = await Clientes.findByPk(req.params.id);
      if (cliente) {
        const dispositivo = await cliente.getDispositivos({
          where: {
            ...query,
          },
          limit: options.limit,
          offset: options.offset,
        });
        console.log(dispositivo);
        res.send(dispositivo);
      } else {
        res.status(404).send({ message: "Cliente no encontrado" });
      }
    } catch (error) {
      handleError(error, res);
    }
  }
);

const clientesController = {
  createCliente,
  getClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
  getDispositivosByCliente,
  getDispositivosByClienteByParams,
};

export default clientesController;

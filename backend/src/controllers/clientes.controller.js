import expressAsyncHandler from 'express-async-handler';
import { Clientes } from '../models/Clientes.js';
import { Dispositivos } from '../models/Dispositivos.js';
import { Distribuidores } from '../models/Distribuidores.js';
import { ClientesDistribuidores } from '../models/ClientesDistribuidores.js';

// import { generateToken } from '../../utils/utilsClientes.js';
// import { handleError } from '../../utils/utilsErrors.js';

const createCliente = expressAsyncHandler(async (req, res) => {
  console.log('Solicitud recibida en /api/clientes/create', req.body);
  try {
    const {
      NombreCompleto,
      CodigoCliente,
      Segmentacion,
      CondicionFiscal,
      CodigoDistribuidor,
      CodigoDumont,
      CorreoElectronico,
      VentaAlcohol,
      Telefono,
      localidad,
      calle,
      altura,
      entreCalle1,
      entreCalle2,
      latitud,
      longitud,
      HorarioVenta,
    } = req.body;

    const newCliente = await Clientes.create({
      NombreCompleto,
      CodigoCliente,
      Segmentacion,
      CondicionFiscal,
      CodigoDistribuidor,
      CodigoDumont,
      CorreoElectronico,
      VentaAlcohol,
      Telefono,
      localidad,
      calle,
      altura,
      entreCalle1,
      entreCalle2,
      latitud,
      longitud,
      HorarioVenta,
    });

    await ClientesDistribuidores.create({
      ClienteIdClientes: CodigoCliente,
      DistribuidorIdDistribuidores: CodigoDistribuidor,
      CodigoDumont,
    });

    console.log('Cliente creado:', newCliente);
    res.send({ cliente: newCliente });
  } catch (error) {
    console.error('Error en createCliente:', error);
    res.status(500).send({ error: 'Error al crear el cliente' });
  }
});

const getClientes = expressAsyncHandler(async (req, res) => {
  try {
    const { page = 0, pageSize = 5 } = req.query;
    console.log({ page, pageSize });
    let options = {
      limit: +pageSize,
      offset: +page * +pageSize,
      include: [
        {
          model: Distribuidores, // nombre modelo de distribuidores
          as: 'Distribuidores', //nombre alias en tu modelo de clientes
          attributes: ['NombreComercial'], // atributos a mostrar de los distribuidores
        },
      ],
    };
    const { count, rows } = await Clientes.findAndCountAll(options);
    res.send({ count, rows });
  } catch (error) {
    console.log(error);

    //handleError(error, res);
  }
});

const getClienteById = expressAsyncHandler(async (req, res) => {
  try {
    const cliente = await Clientes.findByPk(req.params.id);

    if (cliente) {
      // Enviar solo los datos del cliente
      res.send(cliente);
    } else {
      res.status(404).send({ message: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error al obtener el cliente', error });
  }
});

const getClienteByCodigoDumont = expressAsyncHandler(async (req, res) => {
  try {
    const cliente = await Clientes.findOne({
      where: { CodigoCliente: req.params.codigoDumont },
    });

    if (cliente) {
      res.send(cliente);
    } else {
      res.status(404).send({ message: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error al obtener el cliente', error });
  }
});

const updateCliente = expressAsyncHandler(async (req, res) => {
  try {
    const {
      CodigoCliente,
      CodigoDistribuidor,
      Segmentacion,
      CondicionFiscal,
      Localidad,
      Calle,
      EntreCalles,
      Telefono,
      Email,
      VentaAlcohol,
      HorarioVenta,
      idDistribuidor,
    } = req.body;

    const cliente = await Clientes.findByPk(req.params.id);
    console.log(cliente);

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
      cliente.HorarioVenta = HorarioVenta ?? cliente.HorarioVenta;

      if (idDistribuidor) {
        const distribuidorRelacion = await Distribuidores.findByPk(
          idDistribuidor
        ); //{
        await distribuidorRelacion.addCliente(cliente);
      }

      const updatedCliente = await cliente.save();
      res.send(updatedCliente);
    } else {
      res.status(404).send({ message: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.log(error);

    //handleError(error, res);
  }
});

const deleteCliente = expressAsyncHandler(async (req, res) => {
  try {
    await Clientes.destroy({
      where: {
        idClientes: req.params.id,
      },
    });
    res.send({ message: 'Cliente eliminado' });
  } catch (error) {
    console.log(error);

    //handleError(error, res);
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
      res.status(404).send({ message: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.log(error);

    //handleError(error, res);
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
        res.status(404).send({ message: 'Cliente no encontrado' });
      }
    } catch (error) {
      console.log(error);
      //handleError(error, res);
    }
  }
);

const getDistribuidores = async (req, res) => {
  try {
    const distribuidores = await Distribuidores.findAll({
      attributes: ['CodigoDistribuidor', 'NombreComercial'], // Selecciona solo los campos necesarios
    });
    res.json(distribuidores); // Envía la lista de distribuidores como respuesta
  } catch (error) {
    console.error('Error al obtener los distribuidores:', error);
    res.status(500).json({ error: 'Error al obtener los distribuidores' });
  }
};

const clientesController = {
  getClientes,
  getClienteById,
  getClienteByCodigoDumont,
  getDispositivosByCliente,
  getDispositivosByClienteByParams,
  createCliente,
  updateCliente,
  deleteCliente,
  getDistribuidores,
};

export default clientesController;

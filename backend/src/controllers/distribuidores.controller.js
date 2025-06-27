import expressAsyncHandler from 'express-async-handler';
import { Distribuidores } from '../models/Distribuidores.js';
import { Clientes } from '../models/Clientes.js';

const createDistribuidor = expressAsyncHandler(async (req, res) => {
  try {
    const {
      CodigoDistribuidor,
      Localidad,
      Calle,
      EntreCalles,
      Telefono,
      Email,
      RazonSocial,
      NombreComercial,
      CUIT,
      SegundoTelefono,
    } = req.body;
    const distribuidor = await Distribuidores.create({
      CodigoDistribuidor,
      Localidad,
      Calle,
      EntreCalles,
      Telefono,
      Email,
      RazonSocial,
      NombreComercial,
      CUIT,
      SegundoTelefono,
    });
    res.send(distribuidor);
  } catch (error) {
    console.error('Error en createDistribuidor:', error);
    res.status(500).send({ message: 'Error en createDistribuidor' });
  }
});

const getDistribuidores = expressAsyncHandler(async (req, res) => {
  try {
    const { page, pageSize } = req.query;

    const options = {
      include: [
        {
          model: Clientes,
          as: 'Clientes',
          attributes: ['NombreCompleto'],
        },
      ],
    };

    if (page !== undefined && pageSize !== undefined) {
      options.limit = parseInt(pageSize);
      options.offset = parseInt(page) * parseInt(pageSize);
    }

    const { count, rows } = await Distribuidores.findAndCountAll(options);
    res.send({ count, rows });
  } catch (error) {
    console.error('Error al obtener distribuidores:', error);
    res.status(500).send({ error: 'Error al obtener distribuidores' });
  }
});

const getDistribuidoresById = expressAsyncHandler(async (req, res) => {
  try {
    const distribuidorId = await Distribuidores.findByPk(req.params.id, {
      include: [
        {
          model: Clientes,
          as: 'cliente',
          attributes: ['NombreCompleto'],
        },
      ],
    });
    if (distribuidorId) {
      res.send({ distribuidorId });
    } else {
      res.status(404).send({ message: 'Distribuidor no encontrado' });
    }
  } catch (error) {
    console.log(error);
    //handleError(error, res);
  }
});

const updateDistribuidor = expressAsyncHandler(async (req, res) => {
  try {
    const {
      CodigoDistribuidor,
      Localidad,
      Calle,
      EntreCalles,
      Telefono,
      Email,
      RazonSocial,
      NombreComercial,
      CUIT,
      SegundoTelefono,
    } = req.body;

    const distribuidor = await Distribuidores.findByPk(req.params.id);
    if (distribuidor) {
      distribuidor.CodigoDistribuidor = CodigoDistribuidor;
      distribuidor.Localidad = Localidad;
      distribuidor.Calle = Calle;
      distribuidor.EntreCalles = EntreCalles;
      distribuidor.Telefono = Telefono;
      distribuidor.Email = Email;
      distribuidor.RazonSocial = RazonSocial;
      distribuidor.NombreComercial = NombreComercial;
      distribuidor.Contacto = SegundoTelefono;
      await distribuidor.save();
      res.send(distribuidor);
    } else {
      res.status(404).send({ message: 'Distribuidor no encontrado' });
    }
  } catch (error) {
    console.log(error);
  }
});

const deleteDistribuidor = expressAsyncHandler(async (req, res) => {
  try {
    await Distribuidores.destroy({
      where: {
        idDistribuidor: req.params.id,
      },
    });
    res.send({ message: 'Distribuidor eliminado' });
  } catch (error) {
    console.log(error);

    //handleError(error, res);
  }
});

const distribuidoresController = {
  createDistribuidor,
  getDistribuidores,
  getDistribuidoresById,
  updateDistribuidor,
  deleteDistribuidor,
};
export default distribuidoresController;

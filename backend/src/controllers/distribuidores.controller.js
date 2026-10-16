import expressAsyncHandler from "express-async-handler";
import { Distribuidores } from "../models/Distribuidores.js";
import { Clientes } from "../models/Clientes.js";

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
    console.error("Error en createDistribuidor:", error);
    res.status(500).send({ message: "Error en createDistribuidor" });
  }
});

const getDistribuidores = expressAsyncHandler(async (req, res) => {
  try {
    const { page, pageSize } = req.query;

    const options = {
      // distinct: evita que el include many-to-many infle el count.
      distinct: true,
      order: [
        ["NombreComercial", "ASC"],
        ["idDistribuidor", "ASC"],
      ],
      include: [
        {
          model: Clientes,
          as: "Clientes",
          attributes: ["NombreCompleto"],
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
    console.error("Error al obtener distribuidores:", error);
    res.status(500).send({ error: "Error al obtener distribuidores" });
  }
});

const getDistribuidoresById = expressAsyncHandler(async (req, res) => {
  try {
    const distribuidorId = await Distribuidores.findByPk(req.params.id, {
      include: [
        {
          model: Clientes,
          as: "cliente",
          attributes: ["NombreCompleto"],
        },
      ],
    });
    if (distribuidorId) {
      res.send({ distribuidorId });
    } else {
      res.status(404).send({ message: "Distribuidor no encontrado" });
    }
  } catch (error) {
    console.log(error);
    //handleError(error, res);
  }
});

const updateDistribuidor = expressAsyncHandler(async (req, res) => {
  const {
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

  const [updated] = await Distribuidores.update(
    {
      Localidad,
      Calle,
      EntreCalles,
      Telefono,
      Email,
      RazonSocial,
      NombreComercial,
      CUIT,
      SegundoTelefono,
    },
    {
      where: { idDistribuidor: req.params.id },
    }
  );

  if (!updated) {
    return res.status(404).json({ message: "Distribuidor no encontrado" });
  }

  res.json({ ok: true });
});

const deleteDistribuidor = expressAsyncHandler(async (req, res) => {
  try {
    await Distribuidores.destroy({
      where: {
        idDistribuidor: req.params.id,
      },
    });
    res.send({ message: "Distribuidor eliminado" });
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

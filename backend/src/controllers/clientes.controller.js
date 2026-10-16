import expressAsyncHandler from "express-async-handler";
import { Clientes } from "../models/Clientes.js";
import { Dispositivos } from "../models/Dispositivos.js";
import { Distribuidores } from "../models/Distribuidores.js";
import { ClientesDistribuidores } from "../models/ClientesDistribuidores.js";

// import { generateToken } from '../../utils/utilsClientes.js';
// import { handleError } from '../../utils/utilsErrors.js';

const createCliente = expressAsyncHandler(async (req, res) => {
  try {
    // OJO: los nombres de estos campos deben coincidir EXACTO (mayúsculas
    // incluidas) con los atributos definidos en el modelo Clientes.js. Antes
    // se recibían en minúscula (localidad, calle, altura, entreCalle1,
    // entreCalle2) y Sequelize los ignoraba en silencio por no matchear con
    // el modelo (Localidad, Calle, Altura, EntreCalle1, EntreCalle2), lo que
    // rompía el alta de cualquier cliente nuevo.
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
      Localidad,
      Calle,
      Altura,
      EntreCalle1,
      EntreCalle2,
      Latitud,
      Longitud,
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
      Localidad,
      Calle,
      Altura,
      EntreCalle1,
      EntreCalle2,
      Latitud,
      Longitud,
      HorarioVenta,
    });

    // Vincula el cliente con su distribuidor en la tabla intermedia. OJO:
    // confirmado con DESCRIBE + datos reales que esta tabla guarda los
    // CÓDIGOS DE NEGOCIO (CodigoCliente / CodigoDistribuidor), no las claves
    // primarias UUID — a pesar de que los nombres de columna sugieran lo
    // contrario (ver comentario en el modelo ClientesDistribuidores.js).
    const distribuidorAsociado = await Distribuidores.findOne({
      where: { CodigoDistribuidor },
    });

    if (distribuidorAsociado) {
      await ClientesDistribuidores.create({
        ClienteIdClientes: newCliente.CodigoCliente,
        DistribuidorIdDistribuidores: CodigoDistribuidor,
        CodigoDumont: newCliente.CodigoDumont,
      });
    } else {
      console.warn(
        `No se encontró el distribuidor con CodigoDistribuidor=${CodigoDistribuidor}; el cliente se creó pero sin vincular en ClientesDistribuidores.`
      );
    }

    res.send({ cliente: newCliente });
  } catch (error) {
    console.error("Error en createCliente:", error);
    res.status(500).send({ error: "Error al crear el cliente" });
  }
});

const getClientes = expressAsyncHandler(async (req, res) => {
  try {
    const { page = 0, pageSize = 5 } = req.query;
    let options = {
      limit: +pageSize,
      offset: +page * +pageSize,
      include: [
        {
          model: Distribuidores, // nombre modelo de distribuidores
          as: "Distribuidores", //nombre alias en tu modelo de clientes
          attributes: ["NombreComercial"], // atributos a mostrar de los distribuidores
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
      res.status(404).send({ message: "Cliente no encontrado" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error al obtener el cliente", error });
  }
});

const getClienteByCodigoDumont = expressAsyncHandler(async (req, res) => {
  try {
    // Bug previo: buscaba por CodigoCliente en vez de CodigoDumont, así que
    // esta ruta (/dumont/:codigoDumont) nunca encontraba nada salvo por
    // coincidencia.
    const cliente = await Clientes.findOne({
      where: { CodigoDumont: req.params.codigoDumont },
    });

    if (cliente) {
      res.send(cliente);
    } else {
      res.status(404).send({ message: "Cliente no encontrado" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error al obtener el cliente", error });
  }
});

const updateCliente = expressAsyncHandler(async (req, res) => {
  try {
    // Mismo criterio que en createCliente: los campos deben llegar con la
    // misma capitalización que el modelo (Localidad, Calle, Altura,
    // EntreCalle1, EntreCalle2), si no, Sequelize no los persiste.
    const {
      NombreCompleto,
      CodigoCliente,
      Segmentacion,
      CondicionFiscal,
      CodigoDistribuidor,
      CorreoElectronico,
      VentaAlcohol,
      Telefono,
      Localidad,
      Calle,
      Altura,
      EntreCalle1,
      EntreCalle2,
      Latitud,
      Longitud,
      HorarioVenta,
    } = req.body;

    const cliente = await Clientes.findByPk(req.params.id);

    if (!cliente) {
      return res.status(404).send({ message: "Cliente no encontrado" });
    }

    cliente.NombreCompleto = NombreCompleto ?? cliente.NombreCompleto;
    cliente.CodigoCliente = CodigoCliente ?? cliente.CodigoCliente;
    cliente.Segmentacion = Segmentacion ?? cliente.Segmentacion;
    cliente.CondicionFiscal = CondicionFiscal ?? cliente.CondicionFiscal;
    cliente.CodigoDistribuidor =
      CodigoDistribuidor ?? cliente.CodigoDistribuidor;
    cliente.CorreoElectronico = CorreoElectronico ?? cliente.CorreoElectronico;

    // 🔥 NORMALIZACIÓN
    cliente.VentaAlcohol = Boolean(VentaAlcohol);

    cliente.Telefono = Telefono ? String(Telefono) : cliente.Telefono;
    cliente.Localidad = Localidad ?? cliente.Localidad;
    cliente.Calle = Calle ?? cliente.Calle;
    cliente.Altura = Altura ? String(Altura) : cliente.Altura;
    cliente.EntreCalle1 = EntreCalle1 ?? cliente.EntreCalle1;
    cliente.EntreCalle2 = EntreCalle2 ?? cliente.EntreCalle2;
    cliente.Latitud = Latitud ?? cliente.Latitud;
    cliente.Longitud = Longitud ?? cliente.Longitud;
    cliente.HorarioVenta = HorarioVenta ?? cliente.HorarioVenta;

    const updatedCliente = await cliente.save();

    res.send(updatedCliente);
  } catch (error) {
    console.error("Error en updateCliente:", error);
    res.status(500).send({ error: "Error al actualizar cliente" });
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
    console.log(error);

    //handleError(error, res);
  }
});

const getDispositivosByCliente = expressAsyncHandler(async (req, res) => {
  try {
    const { page = 0, pageSize = 5 } = req.query;
    let options = {
      limit: +pageSize,
      offset: +page * +pageSize,
    };
    const { count, rows } = await Dispositivos.findAndCountAll({
      where: {
        CodigoCliente: req.params.id,
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
        res.send(dispositivo);
      } else {
        res.status(404).send({ message: "Cliente no encontrado" });
      }
    } catch (error) {
      console.log(error);
      //handleError(error, res);
    }
  },
);

const getDistribuidores = async (req, res) => {
  try {
    const distribuidores = await Distribuidores.findAll({
      attributes: ["CodigoDistribuidor", "NombreComercial"], // Selecciona solo los campos necesarios
    });
    res.json(distribuidores); // Envía la lista de distribuidores como respuesta
  } catch (error) {
    console.error("Error al obtener los distribuidores:", error);
    res.status(500).json({ error: "Error al obtener los distribuidores" });
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

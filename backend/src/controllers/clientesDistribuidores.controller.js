import {
  ClientesDistribuidores,
  Clientes,
  Distribuidores,
} from '../models/index.js';

export const getRelacionesClientesDistribuidores = async (req, res) => {
  try {
    const relaciones = await ClientesDistribuidores.findAll({
      include: [
        {
          model: Clientes,
          as: 'Cliente',
          attributes: ['CodigoCliente', 'NombreCompleto'],
        },
        {
          model: Distribuidores,
          as: 'Distribuidor',
          attributes: ['CodigoDistribuidor', 'SegundoTelefono'],
        },
      ],
    });

    res.json(relaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las relaciones' });
  }
};

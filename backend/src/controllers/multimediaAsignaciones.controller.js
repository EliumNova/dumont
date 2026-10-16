import expressAsyncHandler from 'express-async-handler';
import { MultimediaAsignacion } from '../models/MultimediaAsignacion.js';
import { Multimedia } from '../models/Multimedia.js';
import { handleError } from '../../utils/utilsErrors.js';

// Recibe el contenido a enviar y los destinos elegidos en el panel de
// filtros del frontend, y crea una fila de asignación por cada destino.
// Body esperado:
// {
//   MultimediaId: "uuid",
//   dispositivos: ["CODIGODUMONT1", "CODIGODUMONT2"],     // clientes puntuales
//   distribuidores: ["1360080000", ...],                  // todo un distribuidor
//   segmentos: ["Kiosco", "Almacen"],                     // todo un segmento
// }
const createAsignaciones = expressAsyncHandler(async (req, res) => {
  try {
    const {
      MultimediaId,
      dispositivos = [],
      distribuidores = [],
      segmentos = [],
    } = req.body;

    if (!MultimediaId) {
      return res.status(400).send({ message: 'MultimediaId es obligatorio' });
    }

    const multimedia = await Multimedia.findByPk(MultimediaId);
    if (!multimedia) {
      return res.status(404).send({ message: 'Contenido no encontrado' });
    }

    if (
      dispositivos.length === 0 &&
      distribuidores.length === 0 &&
      segmentos.length === 0
    ) {
      return res
        .status(400)
        .send({ message: 'Elegí al menos un destino (cliente, distribuidor o segmento)' });
    }

    const filas = [
      ...dispositivos.map((CodigoDumont) => ({ MultimediaId, CodigoDumont })),
      ...distribuidores.map((CodigoDistribuidor) => ({
        MultimediaId,
        CodigoDistribuidor,
      })),
      ...segmentos.map((Segmentacion) => ({ MultimediaId, Segmentacion })),
    ];

    const creadas = await MultimediaAsignacion.bulkCreate(filas);

    res.status(201).send(creadas);
  } catch (error) {
    handleError(error, res);
  }
});

const getAsignaciones = expressAsyncHandler(async (req, res) => {
  try {
    const asignaciones = await MultimediaAsignacion.findAll({
      include: [{ model: Multimedia, as: 'Multimedia' }],
      order: [['createdAt', 'DESC']],
    });
    res.send(asignaciones);
  } catch (error) {
    handleError(error, res);
  }
});

const deleteAsignacion = expressAsyncHandler(async (req, res) => {
  try {
    await MultimediaAsignacion.destroy({
      where: { idAsignacion: req.params.id },
    });
    res.send({ message: 'Asignación eliminada' });
  } catch (error) {
    handleError(error, res);
  }
});

const multimediaAsignacionesController = {
  createAsignaciones,
  getAsignaciones,
  deleteAsignacion,
};

export default multimediaAsignacionesController;

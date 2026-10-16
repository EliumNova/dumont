import expressAsyncHandler from 'express-async-handler';
import { Multimedia } from '../models/Multimedia.js';
import { MultimediaAsignacion } from '../models/MultimediaAsignacion.js';
import { handleError } from '../../utils/utilsErrors.js';

// El archivo en sí ya se sube por /api/files/upload (reutilizamos ese
// endpoint existente). Acá solo registramos la referencia: url + tipo, para
// poder listarlo en la biblioteca y asignarlo a tablets.
const createMultimedia = expressAsyncHandler(async (req, res) => {
  try {
    const { url, tipo, nombreArchivo, duracionSegundos } = req.body;

    if (!url || !tipo) {
      return res
        .status(400)
        .send({ message: 'url y tipo son obligatorios' });
    }

    if (!['imagen', 'video'].includes(tipo)) {
      return res
        .status(400)
        .send({ message: 'tipo debe ser "imagen" o "video"' });
    }

    const nuevo = await Multimedia.create({
      url,
      tipo,
      nombreArchivo,
      duracionSegundos: duracionSegundos || 8,
    });

    res.status(201).send(nuevo);
  } catch (error) {
    handleError(error, res);
  }
});

const getMultimedia = expressAsyncHandler(async (req, res) => {
  try {
    const items = await Multimedia.findAll({ order: [['createdAt', 'DESC']] });
    res.send(items);
  } catch (error) {
    handleError(error, res);
  }
});

const deleteMultimedia = expressAsyncHandler(async (req, res) => {
  try {
    // Borramos también las asignaciones de este contenido, si no quedarían
    // apuntando a un idMultimedia que ya no existe.
    await MultimediaAsignacion.destroy({
      where: { MultimediaId: req.params.id },
    });
    await Multimedia.destroy({ where: { idMultimedia: req.params.id } });
    res.send({ message: 'Contenido eliminado' });
  } catch (error) {
    handleError(error, res);
  }
});

const multimediaController = {
  createMultimedia,
  getMultimedia,
  deleteMultimedia,
};

export default multimediaController;

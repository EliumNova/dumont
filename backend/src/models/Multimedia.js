import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';

// Un archivo (imagen o video) subido por el admin para publicitar en las
// tablets. Se sube una sola vez y después se puede asignar a muchos
// dispositivos/distribuidores/segmentos (ver MultimediaAsignacion.js).
export const Multimedia = sequelize.define(
  'Multimedia',
  {
    idMultimedia: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('imagen', 'video'),
      allowNull: false,
    },
    nombreArchivo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // Segundos que se muestra en pantalla si es una imagen (los videos se
    // reproducen enteros y avanzan solos al terminar).
    duracionSegundos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 8,
    },
  },
  {
    // Freezamos el nombre de tabla para que coincida siempre con la tabla
    // real creada por migracion_dumont.sql, sin depender de cómo pluralice
    // Sequelize el nombre del modelo.
    tableName: 'Multimedia',
    timestamps: true, // createdAt sirve para ordenar la biblioteca por más reciente
    updatedAt: false,
  }
);

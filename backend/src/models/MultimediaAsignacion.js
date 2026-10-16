import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';

// Cada fila representa "este contenido se debe mostrar en este destino".
// El destino puede ser UNO de estos tres (los otros dos quedan null):
//   - CodigoDumont: una tablet/cliente puntual
//   - CodigoDistribuidor: todas las tablets de ese distribuidor
//   - Segmentacion: todas las tablets de ese segmento (Kiosco/Almacen/Autoservicio)
// Así una misma imagen/video se puede mandar a un cliente puntual, a todo un
// distribuidor, o a todo un segmento, según lo que elija el admin en el
// panel de "Enviar a tablets".
export const MultimediaAsignacion = sequelize.define(
  'MultimediaAsignacion',
  {
    idAsignacion: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    MultimediaId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    CodigoDumont: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    CodigoDistribuidor: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Segmentacion: {
      type: DataTypes.ENUM('Kiosco', 'Almacen', 'Autoservicio'),
      allowNull: true,
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    // Sequelize pluraliza el nombre del modelo por defecto ("MultimediaAsignacion"
    // -> "MultimediaAsignacions"), pero la tabla real (creada por
    // migracion_dumont.sql) se llama en singular. Sin este freeze, sync()
    // intenta crear una tabla nueva "MultimediaAsignacions" con su propio FK
    // a Multimedia y explota con "Cannot add foreign key constraint" porque
    // termina siendo una tabla distinta a la que ya existe.
    tableName: 'MultimediaAsignacion',
    timestamps: true,
    updatedAt: false,
  }
);

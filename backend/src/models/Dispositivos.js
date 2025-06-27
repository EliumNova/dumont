import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';

export const Dispositivos = sequelize.define(
  'Dispositivos',
  {
    idDispositivos: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    Marca: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Modelo: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    NumSerie: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true, // opcional si querés que no se repitan
    },
    CodigoCliente: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    CodigoDumont: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    latitud: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    longitud: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';

export const ClientesDistribuidores = sequelize.define(
  'ClientesDistribuidores',
  {
    CodigoDumont: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ClienteIdClientes: {
      type: DataTypes.STRING(45), // STRING porque CodigoCliente es string
      allowNull: false,
      primaryKey: true, // si quieres clave compuesta, pon primaryKey en estos dos
    },
    DistribuidorIdDistribuidores: {
      type: DataTypes.INTEGER, // INT porque CodigoDistribuidor es entero
      allowNull: false,
      primaryKey: true, // clave compuesta también aquí
    },
  },
  {
    timestamps: true,
    tableName: 'ClientesDistribuidores', // Asegúrate que coincide con el nombre en DB
  }
);

import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';
import { Dispositivos } from './Dispositivos.js';
import { Distribuidores } from './Distribuidores.js';
import { ClientesDistribuidores } from './ClientesDistribuidores.js';

export const Clientes = sequelize.define(
  'Clientes',
  {
    idClientes: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    NombreCompleto: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    CodigoCliente: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Segmentacion: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    CondicionFiscal: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    CodigoDistribuidor: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    CodigoDumont: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    CorreoElectronico: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    VentaAlcohol: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Telefono: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    localidad: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    calle: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    altura: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    entreCalle1: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    entreCalle2: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    HorarioVenta: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

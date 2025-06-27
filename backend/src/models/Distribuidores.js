import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';
//import { Clientes } from './Clientes.js';

export const Distribuidores = sequelize.define(
  'Distribuidores',
  {
    idDistribuidor: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    CodigoDistribuidor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Localidad: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Calle: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    EntreCalles: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Telefono: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    RazonSocial: {
      // Agregamos Razon Social Completo
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    NombreComercial: {
      // Agregamos Nombre Comercial
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    CUIT: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    SegundoTelefono: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

//Distribuidores.belongsToMany(Clientes, { through: 'ClientesDistribuidores' });

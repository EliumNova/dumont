import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";
import { Dispositivos } from "./Dispositivos.js";

export const Clientes = sequelize.define(
  "Clientes",
  {
    idClientes: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    CodigoCliente: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    CodigoDistribuidor: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Segmentacion: {
      type: DataTypes.ENUM,
      values: ["Kiosco", "Almacen", "Autoservicio"],
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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    VentaAlcohol: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    WebPage: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    HorarioVenta: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    HorarioOnOffDispositivos: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    HorarioPublicitario: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    AtencionAlCliente: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Clientes.hasMany(Dispositivos, {
  foreignKey: "idClientes",
  sourceKey: "idClientes",
  as: "Dispositivos",
});

Dispositivos.belongsTo(Clientes, {
  foreignKey: "idClientes",
  targetKey: "idClientes",
  as: "Clientes",
});

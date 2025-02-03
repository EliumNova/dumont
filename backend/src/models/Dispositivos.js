import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

export const Dispositivos = sequelize.define(
  "Dispositivos",
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
    NumPulgadas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    NumSerie: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";
import bcrypt from "bcryptjs";

export const Usuarios = sequelize.define(
  "Usuarios",
  {
    idUsuarios: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
    Telefono: {
      type: DataTypes.STRING(15),
      unique: true,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    DNI: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("Password", bcrypt.hashSync(value, 10));
      },
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verifyToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expireToken: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

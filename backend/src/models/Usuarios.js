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
    // ── Verificación en 2 pasos (TOTP) ──
    // Secreto cifrado (AES-GCM) — nunca se guarda en claro.
    TwoFactorSecret: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    TwoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // JSON con los hashes de los códigos de recuperación aún sin usar.
    TwoFactorRecovery: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Último paso TOTP aceptado: impide reusar el mismo código dos veces.
    TwoFactorLastStep: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    // Por defecto NUNCA se devuelven hashes, secretos ni tokens: así ningún
    // res.send(usuario) puede filtrarlos. Para login/2FA se usa
    // Usuarios.unscoped().
    defaultScope: {
      attributes: {
        exclude: [
          "Password",
          "verifyToken",
          "expireToken",
          "TwoFactorSecret",
          "TwoFactorRecovery",
          "TwoFactorLastStep",
        ],
      },
    },
  }
);

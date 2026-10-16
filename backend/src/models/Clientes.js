import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

export const Clientes = sequelize.define(
  "Clientes",
  {
    idClientes: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    NombreCompleto: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    CodigoCliente: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Segmentacion: {
      type: DataTypes.ENUM("Kiosco", "Almacen", "Autoservicio"),
      allowNull: false,
    },
    CondicionFiscal: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    CodigoDistribuidor: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    CodigoDumont: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    CorreoElectronico: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    VentaAlcohol: {
      type: DataTypes.BOOLEAN, // 🔥 CAMBIO
      allowNull: false,
    },
    // Texto (solo dígitos): como INTEGER se perdían los ceros iniciales y los
    // números largos (ej. 2234567890) desbordaban el rango de MySQL.
    Telefono: {
      type: DataTypes.STRING(20),
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
    Altura: {
      type: DataTypes.INTEGER, // 🔥 CAMBIO
      allowNull: false,
    },
    EntreCalle1: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    EntreCalle2: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    HorarioVenta: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    // Coordenadas manuales de respaldo (las carga el vendedor al dar de alta
    // el negocio). Sirven para ubicar el pin del negocio en el mapa cuando el
    // dispositivo está apagado o no reporta su propio GPS.
    Latitud: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Longitud: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  },
);

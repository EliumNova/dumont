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
    // Guarda el CÓDIGO DE NEGOCIO del cliente (ej. "1002"), NO el idClientes
    // (UUID) — confirmado por la constraint real de la base:
    // "FOREIGN KEY (CodigoCliente) REFERENCES Clientes (CodigoCliente)".
    // (Un intento previo asumió que guardaba el UUID; ese insert falla
    // porque el FK apunta a Clientes.CodigoCliente, no a Clientes.idClientes.)
    CodigoCliente: {
      type: DataTypes.STRING(45),
      allowNull: true,
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
    // Última vez que la app de la tablet avisó que sigue conectada (ver
    // tablet.controller.js). Se usa para saber si está "online"/"offline".
    UltimaConexion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Ventana horaria en la que la tablet debe mostrar publicidad. Si queda
    // vacío, se usa el HorarioVenta del cliente asociado como respaldo.
    HorarioPublicitario: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    // Link de un solo dispositivo: token de la pantalla que tiene "tomado" el
    // link y su último latido. Mientras el latido sea reciente, otro
    // navegador que abra el mismo link es rechazado (ver tablet.controller).
    SesionToken: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    SesionUltimoLatido: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    // El token de sesión de la pantalla no sale en las respuestas de la API.
    defaultScope: { attributes: { exclude: ['SesionToken'] } },
  }
);

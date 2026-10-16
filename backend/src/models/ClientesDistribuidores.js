import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';

// Confirmado con DESCRIBE + datos reales de la tabla en la base viva (2026-07):
// esta tabla NO vincula por las claves primarias UUID de Clientes/Distribuidores
// (a pesar de que los nombres de columna parezcan sugerir eso). En realidad
// guarda los CÓDIGOS DE NEGOCIO cortos:
//   ClienteIdClientes             varchar(45)  -> en realidad Clientes.CodigoCliente (ej: "1002")
//   DistribuidorIdDistribuidores  int(11)      -> en realidad Distribuidores.CodigoDistribuidor (ej: 1002)
//   CodigoDumont                  varchar(50)  -> el código Dumont ya armado (ej: "10200000001002")
// (dos intentos previos de este modelo asumieron UUID reales, ambos basados
// en un dump viejo desactualizado — esta vez está confirmado con
// DESCRIBE ClientesDistribuidores y un SELECT * de filas reales).
export const ClientesDistribuidores = sequelize.define(
  'ClientesDistribuidores',
  {
    ClienteIdClientes: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
    },
    DistribuidorIdDistribuidores: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    CodigoDumont: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'ClientesDistribuidores',
  }
);

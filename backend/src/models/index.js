import { sequelize } from '../db/db.js';
import { Clientes } from './Clientes.js';
import { Dispositivos } from './Dispositivos.js';
import { Distribuidores } from './Distribuidores.js';
import { ClientesDistribuidores } from './ClientesDistribuidores.js';
import { Usuarios } from './Usuarios.js';
import { Multimedia } from './Multimedia.js';
import { MultimediaAsignacion } from './MultimediaAsignacion.js';

// Relación: Clientes → Dispositivos
// Confirmado por la constraint real de la base ("FOREIGN KEY (CodigoCliente)
// REFERENCES Clientes (CodigoCliente)"): Dispositivos.CodigoCliente guarda
// el código de negocio del cliente (ej. "1002"), NO el idClientes (UUID).
Clientes.hasMany(Dispositivos, {
  foreignKey: 'CodigoCliente',
  sourceKey: 'CodigoCliente',
  as: 'Dispositivos',
});

Dispositivos.belongsTo(Clientes, {
  foreignKey: 'CodigoCliente',
  targetKey: 'CodigoCliente',
  as: 'Cliente',
});

// Relación N:N Clientes - Distribuidores a través de ClientesDistribuidores.
// Confirmado con DESCRIBE + datos reales: esta tabla vincula por los CÓDIGOS
// DE NEGOCIO (CodigoCliente / CodigoDistribuidor), no por las claves
// primarias UUID/char(36) — a pesar de que los nombres de columna
// ("ClienteIdClientes", "DistribuidorIdDistribuidores") sugieran lo
// contrario. Ver comentario en ClientesDistribuidores.js.
ClientesDistribuidores.belongsTo(Clientes, {
  foreignKey: 'ClienteIdClientes',
  targetKey: 'CodigoCliente',
  as: 'Cliente',
});

ClientesDistribuidores.belongsTo(Distribuidores, {
  foreignKey: 'DistribuidorIdDistribuidores',
  targetKey: 'CodigoDistribuidor',
  as: 'Distribuidor',
});

Clientes.belongsToMany(Distribuidores, {
  through: ClientesDistribuidores,
  foreignKey: 'ClienteIdClientes',
  otherKey: 'DistribuidorIdDistribuidores',
  sourceKey: 'CodigoCliente',
  targetKey: 'CodigoDistribuidor',
  as: 'Distribuidores',
});

Distribuidores.belongsToMany(Clientes, {
  through: ClientesDistribuidores,
  foreignKey: 'DistribuidorIdDistribuidores',
  otherKey: 'ClienteIdClientes',
  sourceKey: 'CodigoDistribuidor',
  targetKey: 'CodigoCliente',
  as: 'Clientes',
});

// Relación: Multimedia → MultimediaAsignacion (una imagen/video puede estar
// asignado a muchos destinos distintos)
Multimedia.hasMany(MultimediaAsignacion, {
  foreignKey: 'MultimediaId',
  sourceKey: 'idMultimedia',
  as: 'Asignaciones',
});

MultimediaAsignacion.belongsTo(Multimedia, {
  foreignKey: 'MultimediaId',
  targetKey: 'idMultimedia',
  as: 'Multimedia',
});

export {
  sequelize,
  Clientes,
  Dispositivos,
  Distribuidores,
  ClientesDistribuidores,
  Usuarios,
  Multimedia,
  MultimediaAsignacion,
};

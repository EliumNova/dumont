import { sequelize } from '../db/db.js';
import { Clientes } from './Clientes.js';
import { Dispositivos } from './Dispositivos.js';
import { Distribuidores } from './Distribuidores.js';
import { ClientesDistribuidores } from './ClientesDistribuidores.js';
import { Usuarios } from './Usuarios.js';

// Relación: Clientes → Dispositivos
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

// Relación N:N Clientes - Distribuidores a través de ClientesDistribuidores
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

// También puedes definir belongsToMany si quieres usar includes desde Clientes o Distribuidores
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

export {
  sequelize,
  Clientes,
  Dispositivos,
  Distribuidores,
  ClientesDistribuidores,
  Usuarios,
};

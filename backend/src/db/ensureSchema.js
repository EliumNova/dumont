import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

// sequelize.sync() crea tablas que faltan pero NO agrega columnas nuevas a
// tablas existentes. Para no depender de correr SQL a mano en cada deploy,
// al arrancar se agregan (de forma idempotente) las columnas que falten.
// Mantener en sincronía con backend/migracion_dumont.sql.
const COLUMNAS = {
  Usuarios: {
    TwoFactorSecret: { type: DataTypes.TEXT, allowNull: true },
    TwoFactorEnabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    TwoFactorRecovery: { type: DataTypes.TEXT, allowNull: true },
    TwoFactorLastStep: { type: DataTypes.INTEGER, allowNull: true },
  },
  Dispositivos: {
    SesionToken: { type: DataTypes.STRING(64), allowNull: true },
    SesionUltimoLatido: { type: DataTypes.DATE, allowNull: true },
  },
};

// Si hay usuarios pero ninguno es administrador (las rutas de gestión de
// usuarios ahora exigen rol admin), se promueve al primero para no quedar
// bloqueados fuera del panel.
const asegurarAdmin = async () => {
  try {
    const [[{ total }]] = await sequelize.query("SELECT COUNT(*) AS total FROM Usuarios");
    if (!Number(total)) return;
    const [[{ admins }]] = await sequelize.query(
      "SELECT COUNT(*) AS admins FROM Usuarios WHERE isAdmin = 1"
    );
    if (Number(admins)) return;
    await sequelize.query(
      "UPDATE Usuarios SET isAdmin = 1 WHERE idUsuarios = (SELECT idUsuarios FROM (SELECT idUsuarios FROM Usuarios ORDER BY idUsuarios LIMIT 1) t)"
    );
    console.warn("ensureSchema: no había administradores; se promovió a uno.");
  } catch (e) {
    console.warn("ensureSchema: no se pudo verificar el administrador:", e.message);
  }
};

// Cambios de tipo de columnas existentes (idempotentes).
const migrarTipos = async () => {
  const qi = sequelize.getQueryInterface();
  try {
    const cols = await qi.describeTable("Clientes");
    if (cols.Telefono && /INT/i.test(cols.Telefono.type)) {
      await qi.changeColumn("Clientes", "Telefono", {
        type: DataTypes.STRING(20),
        allowNull: false,
      });
      console.log("ensureSchema: Clientes.Telefono pasó a VARCHAR(20)");
    }
  } catch (e) {
    console.error("ensureSchema: no se pudo migrar Clientes.Telefono:", e.message);
  }
};

export const ensureSchema = async () => {
  const qi = sequelize.getQueryInterface();
  for (const [tabla, columnas] of Object.entries(COLUMNAS)) {
    let existentes;
    try {
      existentes = await qi.describeTable(tabla);
    } catch (e) {
      console.warn(`ensureSchema: no se pudo leer la tabla ${tabla}:`, e.message);
      continue;
    }
    for (const [nombre, definicion] of Object.entries(columnas)) {
      if (existentes[nombre]) continue;
      try {
        await qi.addColumn(tabla, nombre, definicion);
        console.log(`ensureSchema: columna agregada ${tabla}.${nombre}`);
      } catch (e) {
        console.error(`ensureSchema: error agregando ${tabla}.${nombre}:`, e.message);
      }
    }
  }
  await migrarTipos();
  await asegurarAdmin();
};

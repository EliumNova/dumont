import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre de la base de datos
  process.env.DB_USER, // Usuario de la base de datos
  process.env.DB_PASSWORD, // Contraseña del usuario
  {
    host: process.env.DB_HOST, // Asegúrate de que esto sea 'db'
    dialect: 'mysql',
    logging: console.log,
  }
);

// Función para conectarse a la base de datos
const connectToDatabase = async () => {
  try {
    await sequelize.authenticate(); // Intenta autenticarse con la base de datos
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    setTimeout(connectToDatabase, 5000); // Reintenta conectarse después de 5 segundos
  }
};

connectToDatabase(); // Llama a la función para conectarte

export { sequelize }; // Exportación nombrada

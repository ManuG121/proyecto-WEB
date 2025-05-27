require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,      // nombre de la base de datos
  process.env.DB_USER,      // usuario
  process.env.DB_PASSWORD,  // contraseña
  {
    host: process.env.DB_HOST,  // host (ejemplo: metro.proxy.rlwy.net)
    dialect: 'mysql',
    port: process.env.DB_PORT,  // puerto (ejemplo: 18143)
    logging: false,
  }
);

module.exports = sequelize;

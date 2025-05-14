const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(
  'railway',
  'root',
  'RxsITIAJXxnQCTCCqroVNsFKraKngHPj',
  {
    host: 'shortline.proxy.rlwy.net',
    dialect: 'mysql',
    port: 47453
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('Conexión establecida con la base de datos');
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

module.exports = sequelize;

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const sequelize = require('./database/index');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/announcements', announcementRoutes);

app.get('/', (req, res) => {
  res.send('¡Hola desde la API!');
});

sequelize.sync()
  .then(() => {
    console.log("Modelos sincronizados");
    app.listen(port, () => {
      console.log(`Servidor funcionando en el puerto ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error al sincronizar los modelos:", err);
  });

sequelize.authenticate()
  .then(() => console.log('Conexión con la base de datos establecida.'))
  .catch((error) => console.error('Error en conexión con la base de datos:', error));

require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

// body - parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Habilitar public
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuración de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLBD, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then((res) => console.log('Conexión OK'))
.catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
    console.log(`Escuchando por el puerto ${process.env.PORT}`);
});
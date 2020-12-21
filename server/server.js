require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// body - parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Config
app.get('/', (req, res) => {
    res.send('Hola, usuario.');
});

app.get('/usuario', (req, res) => {
    res.json('get user');
});

app.post('/usuario', (req, res) => {

    const body = req.body;

    if (!body.nombre) {
        res.status(400).json({ ok: false, mensaje: 'El nombre es necesario' });
    }

    res.json({ usuario: body });
});

// app.get('/usuario/:id', (req, res) => {
//     const id = req.params.id;
//     res.json({ id, status: true });
// });

app.listen(process.env.PORT, () => {
    console.log(`Escuchando por el puerto ${process.env.PORT}`);
});
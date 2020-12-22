const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();

app.get('/', (req, res) => {
    res.send('Hola, al homepage.');
});

app.post('/usuario', (req, res) => {

    const body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioBD) => {

        if (err) {
            return res.status(400).json({ ok: false, error: err });
        };

        res.json({ ok: true, usuario: usuarioBD });

    });

});

app.get('/usuario', (req, res) => {
    
    const from = +req.query.from || 0;
    const limit = +req.query.limit || 5;

    Usuario.find({ estado: true }).skip(from).limit(limit).exec((err, usuarios) => {

        if (err) {
            return res.status(400).json({ ok: false, error: err });
        }

        res.json({ ok: true, cantidad: usuarios.length, usuarios });
    });

});

app.put('/usuario/:id', (req, res) => {

    const id = req.params.id;
    const body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {

        if (err) {
            return res.status(400).json({ ok: false, error: err });
        }

        res.json({ ok: true, usuario: usuarioBD });

    });

});

app.delete('/usuario/:id', (req, res) => {

    const id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBD) => {

        if (err) {
            return res.status(400).json({ ok: false, error: err });
        }

        res.json({ ok: true, usuario: usuarioBD });

    });

});

module.exports = app;
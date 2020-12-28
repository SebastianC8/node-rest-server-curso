const express = require('express');
const { verificaToken, verificaRolAdmn } = require('../middlewares/autenticacion');
const app = express();

const Categoria = require('../models/categoria');

// Show all
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({}).populate('usuario').sort('descripcion').exec((err, categorias) => {

        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!categorias) {
            return res.status(400).json({ ok: false, err });
        }

        res.json({ ok: true, cantidad: categorias.length, categorias });

    });

});

// Show by id
app.get('/categoria/:id', verificaToken, (req, res) => {

    const id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!categoriaDB) {
            return res.status(400).json({ ok: false, err });
        }

        res.json({ ok: true, categoria: categoriaDB });

    });

});

// Create
app.post('/categoria', verificaToken, (req, res) => {

    const body = req.body;

    const categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            res.status(500).json({ ok: false, err });
        }

        if (!categoriaDB) {
            res.status(400).json({ ok: false, err });
        }

        res.json({ ok: true, categoria: categoriaDB });

    });

});

// Update
app.put('/categoria/:id', verificaToken, (req, res) => {

    const id = req.params.id;
    const body = req.body;
    const desc = { descripcion: body.descripcion };

    Categoria.findByIdAndUpdate(id, desc, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            res.status(500).json({ ok: false, err });
        }

        if (!categoriaDB) {
            res.status(400).json({ ok: false, err });
        }

        res.json({ ok: true, categoria: categoriaDB });

    });

});

// Delete
app.delete('/categoria/:id', [verificaToken, verificaRolAdmn], (req, res) => {

    const id = req.params.id;

    Categoria.findByIdAndRemove(id, {}, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!categoriaDB) {
            return res.status(400).json({ ok: false, err: { message: 'El ID no existe' }});
        }

        res.json({ ok: true, message: 'Categoría eliminada' });

    });

});

module.exports = app;
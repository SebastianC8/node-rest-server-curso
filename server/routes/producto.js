const express = require('express');
const { verificaToken, verificaRolAdmn } = require('../middlewares/autenticacion');
const app = express();
const Producto = require('../models/producto');

// Show all
app.get('/productos', verificaToken, (req, res) => {

    const from = +req.query.from || 0;

    Producto.find({ disponible: true })
            .skip(from)
            .limit(5)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productos) => {

        if (err) {
            res.status(500).json({ ok: false, err });
        }

        if (!productos) {
            res.status(400).json({ ok: false, err });
        }

        res.json({ ok: true, cantidad: productos.length, productos });
    });

});

// Show by id
app.get('/productos/:id', verificaToken, (req, res) => {

    const id = req.params.id;

    Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productoDB) => {

        if (err) {
            res.status(500).json({ ok: false, err });
        }

        if (!productoDB) {
            res.status(400).json({ ok: false, err });
        }

        res.json({ ok: true, producto: productoDB });

    });

});

// Create
app.post('/productos', verificaToken, (req, res) => {

    const body = req.body;

    const producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            res.status(500).json({ ok: false, err });
        }

        if (!productoDB) {
            res.status(400).json({ ok: false, err });
        }

        res.json({ ok: true, producto: productoDB });

    })

});

// Update
app.put('/productos/:id', verificaToken, (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            res.status(500).json({ ok: false, err });
        }

        if (!productoDB) {
            res.status(400).json({ ok: false, err });
        }

        res.json({ ok: true, producto: productoDB });

    });

});

// Change status
app.delete('/productos/:id', [verificaToken, verificaRolAdmn], (req, res) => {

    const id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        
        if (err) {
            res.status(500).json({ ok: false, err });
        }

        if (!productoDB) {
            res.status(400).json({ ok: false, err });
        }

        productoDB.disponible = false;

        productoDB.save((err, deleted) => {

            if (err) {
                res.status(500).json({ ok: false, err });
            }

            if (!deleted) {
                res.status(400).json({ ok: false, err });
            }

            res.json({ ok: true, producto: deleted, mensaje: 'Producto borrado' });

        });

    });

});

// Search
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    const word = req.params.termino;
    const regEx = new RegExp(word, 'i');

    Producto.find({ nombre: regEx })
            .populate('categoria', 'nombre')
            .exec((err, productos) => {

                if (err) {
                    res.status(500).json({ ok: false, err });
                }

                res.json({ ok: true, productos });

            });

});

module.exports = app;
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
// app.use(fileUpload({ useTempFiles: true }));
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    if (!req.files) {
        return res.status(400).json({ ok: false, err: { message: 'No se ha seleccionado ningún archivo' }});
    }

    const file = req.files.archivo;
    const filename = file.name;
    const allowedExt = ['png', 'jpg', 'gif', 'jpeg'];
    const allowedType = ['usuarios', 'productos'];

    if (!allowedType.includes(tipo)) {
        return res.status(400).json({ ok: false, err: { message: `Los tipos permitidos son: ${allowedType.join(', ')}.` }});
    }

    if (!allowedExt.includes(filename.split('.')[1])) {
        return res.status(400).json({ ok: false, err: { message: 'Extensión no permitida.', ext: filename.split('.')[1] }})
    }

    // Rename file
    const rename = `${id}-${ new Date().getMilliseconds() }.${filename.split('.')[1]}`;
    
    file.mv(`uploads/${tipo}/${rename}`, (err) => {

        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (tipo === 'usuarios') {
            imgUser(id, res, rename);
        } else if (tipo === 'productos') {
            imgProduct(id, res, rename);
        }

    });

});

imgUser = (id, res, filename) => {

    Usuario.findById(id, (err, usuarioBD) => {

        if (err) {
            dropFile(filename, 'usuarios');
            return res.status(500).json({ ok: false, err });
        }

        if (!usuarioBD) {
            dropFile(filename, 'usuarios');
            return res.status(400).json({ ok: false, err: { message: 'Usuario no existe.' }});
        }

        dropFile(usuarioBD.img, 'usuarios');

        usuarioBD.img = filename;

        usuarioBD.save((err, usuarioBD) => {

            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            res.json({ ok: true, usuario: usuarioBD, img: filename });

        });

    });

}

imgProduct = (id, res, filename) => {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            dropFile(filename, 'productos');
            return res.status(500).json({ ok: false, err });
        }

        if (!productoDB) {
            dropFile(filename, 'productos');
            return res.status(400).json({ ok: false, err: { message: 'Producto no existe.' }});
        }

        dropFile(productoDB.img, 'productos');

        productoDB.img = filename;

        productoDB.save((err, productoDB) => {

            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            res.json({ ok: true, producto: productoDB, img: filename });

        });

    });

}

dropFile = (filename, tipo) => {
    const urlIMG = `${path.resolve(__dirname, `../../uploads/${tipo}/${filename}`)}`;
    (fs.existsSync(urlIMG)) ? fs.unlinkSync(urlIMG) : null;
}


module.exports = app;
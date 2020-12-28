const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {

    const body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (!usuarioBD) {
            return res.status(400).json({ ok: false, err: { message: '(Usuario) ó contraseña incorrectos.' }});
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({ ok: false, err: { message: 'Usuario ó (contraseña) incorrectos.' }});
        }

        const token = jwt.sign({
            usuario: usuarioBD
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        
        res.json({ ok: true, usuario: usuarioBD, token });

    });

});

// Configuraciones de Google

async function verify(token) {

    const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.CLIENT_ID });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

app.post('/google', async (req, res) => {

    const token = req.body.idtoken;
    const googleUser = await verify(token).catch((err) => res.status(403).json({ ok: false, err }));

    Usuario.findOne({ email: googleUser.email }, (err, usuarioBD) => {

        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        if (usuarioBD) {
            
            if (usuarioBD.google === false) {
                return res.status(400).json({ ok: false, err: { message: 'Debe de usar su autenticación normal.' }});
            } else {
                const token = jwt.sign({ usuario: usuarioBD }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.status(200).json({ ok: true, usuario: usuarioBD, token });
            }
        } else {

            const usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioBD) => {

                if (err) {
                    return res.status(500).json({ ok: false, err });
                }

                const token = jwt.sign({ usuario: usuarioBD }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({ ok: true, usuario: usuarioBD, token });
            });

        }

    });

});

module.exports = app;
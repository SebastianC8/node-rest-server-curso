const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    const tipo = req.params.tipo;
    const img = req.params.img;
    const urlIMG = `${path.resolve(__dirname, `../../uploads/${tipo}/${img}`)}`;
    
    if (fs.existsSync(urlIMG)) {
        res.sendFile(urlIMG);
    } else {
        const noImgPath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImgPath);
    }

});

module.exports = app;
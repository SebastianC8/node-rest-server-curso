// PUERTO
process.env.PORT = process.env.PORT || 3000;

// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// BASE DE DATOS
let url;

if (process.env.NODE_ENV === 'dev') {
    url = 'mongodb://localhost:27017/cafe';
} else {
    url = process.env.MONGO_URI;
}

process.env.URLBD = url;

// VENCIMIENTO TOKEN => 60 seg * 60 mnt * 24 h * 30 d
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// SEED de autenticación
process.env.SEED = process.env.SEED || 'my-own-seed-development';
// Verificar token

const jwt = require('jsonwebtoken');

const verificaToken = (req, res, next) => {

    const token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(400).json({ ok: false, err: { message: 'Token no válido' }});
        }

        req.usuario = decoded.usuario;
        next();
    
    });

}

// Verifica rol admn

const verificaRolAdmn = (req, res, next) => {

    const usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(400).json({ ok: false, err: { message: 'El usuario no es administrador.' }});
    }


}

// Verifica token para imagen

const verificaTokenImg = (req, res, next) => {

    const token = req.query.token;
    
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(400).json({ ok: false, err: { message: 'Token no válido' }});
        }

        req.usuario = decoded.usuario;
        next();
    
    });

}

module.exports = { verificaToken, verificaRolAdmn, verificaTokenImg };
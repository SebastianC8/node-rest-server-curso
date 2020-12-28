const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriaSchema = new Schema({

    descripcion: {
        type: String,
        required: [true, 'Descripción de la categoría es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

});

module.exports = mongoose.model('Categoria', categoriaSchema);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  opinion: {
    type: String,
    required: true
  },
  recomendacion: {
    type: Boolean,
    required: true
  },
  creador: {
    // type: String,
    // required: true
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Usuario'
  }
})

module.exports = mongoose.model('Post', postSchema);


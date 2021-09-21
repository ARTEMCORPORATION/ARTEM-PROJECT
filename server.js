// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const rutasPost = require('./routes/rutas-post');
const rutasUsuarios = require('./routes/rutas-usuarios');

app.use(cors());

app.use(express.json());

app.use('/api/post', rutasPost);
app.use('/api/usuarios', rutasUsuarios);

app.use((req, res, next) => {
  res.status(404);
  res.json({
    mensaje: 'Post o usuario no encontrado'
  });

})

// Gestión de errores
app.use((error, req, res, next) => {
  if (res.headersSent) { // Si ya se ha enviado una respuesta desde el servidor
    return next(error); // seguimos para adelante
  }
  res.status(error.code || 500); // Proporciona código de error y si no hay proporciona el código 500.
  res.json({
    mensaje: error.message || 'Ha ocurrido un error desconocido'
  });
});



mongoose
	.connect(process.env.MONGO_DB_URI)
	.then(() => {
		app.listen(5000, () => console.log('Escuchando en puerto 5000'));
	})
	.catch((error) => console.log(error));
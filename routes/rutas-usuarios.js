// rutas-usuarios.js
const express = require('express');
const {
  check
} = require('express-validator');


const controladorUsuarios = require('../controllers/controlador-usuarios');

const router = express.Router();

router.get('/', controladorUsuarios.recuperarUsuarios);

router.post('/alta',
  [
    check('nombre').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({
      min: 6
    })
  ],
  controladorUsuarios.altaUsuario);

router.post('/login', controladorUsuarios.loginUsuario);

module.exports = router;
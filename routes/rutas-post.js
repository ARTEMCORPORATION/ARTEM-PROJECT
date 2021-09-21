// rutas-post.js
const express = require('express');
const {
  check
} = require('express-validator');

const controladorPost = require('../controllers/controlador-post');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/', controladorPost.recuperaPosts);

router.get('/:did', controladorPost.recuperaPostPorId);

router.get('/usuarios/:uid', controladorPost.recuperaPostPorIdUsuario);

router.use(checkAuth);

router.post(
  '/',
  [
    check('nombre').not().isEmpty(),
    check('opinion').isLength({
      min: 5
    }),
    check('recomendacion').not().isEmpty()
  ],
  controladorPost.crearPost);

router.patch('/:did', controladorPost.modificarPost);

router.delete('/:did', controladorPost.eliminarPost);

module.exports = router;
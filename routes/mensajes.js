/* 
    Path : /api/mensajes
*/

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { obtnerChat } = require('../controllers/mensajes');

const router = Router();

router.get( '/:de', validarJWT , obtnerChat );

module.exports = router;

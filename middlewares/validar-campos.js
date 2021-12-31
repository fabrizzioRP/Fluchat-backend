const { validationResult } = require('express-validator');

const validarCampos = ( req, res, next ) => {
  
    const errores = validationResult(req);
    //console.log( req.body );
    
    if( !errores.isEmpty() ){
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    next();
}

module.exports = {
    validarCampos
}
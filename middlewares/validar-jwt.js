
const jwt = require('jsonwebtoken');

const validarJWT = ( req, res, next ) => {

    try {

        // Leer token
        const token = req.header('Authorization');
        //console.log( token );

        if ( !token ) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la peticion'
            });
        }

        const { uid } = jwt.verify( token , process.env.JWT_KEY );

        req.uid = uid;

        next();
        
    } catch (error) {

        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
        
    }


}

module.exports = { validarJWT }
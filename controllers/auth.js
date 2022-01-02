const bcrypt = require('bcryptjs');
const { response } = require('express');

const Usuario = require('../models/usuario');
const { generateJwt } = require('../helpers/jwt');

const crearUsuarios = async ( req, res = response ) => {

    const { email , password } = req.body;

    try {
        
        const existeEmail = await Usuario.findOne({ email });

        if( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuarioDB = new Usuario( req.body );

        // Encriptar Contraseña
        const salt = bcrypt.genSaltSync();
        usuarioDB.password = bcrypt.hashSync( password , salt  );

        // graba en la base de datos
        await usuarioDB.save();

        // JWT
        const token = await generateJwt( usuarioDB.id );
    
        res.json({ 
            ok: true,
            msg: 'Usuario Creado',
            usuarioDB,
            token
        });
        
    } catch (error) {

        console.log( error );

        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });

    }    

}

const login = async ( req , res = response ) => {

    const { email , password } = req.body;

    try {

        // Validar Email
        const usuarioDB = await Usuario.findOne({ email });

        if( !usuarioDB ){
            return res.status(400).json({
                ok: false,
                msg: 'Email no se encontro'
            });
        }

        // Validar Password
        const validPassword = bcrypt.compareSync( password , usuarioDB.password );

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }

        // genera el JWT
        const token = await generateJwt( usuarioDB.id );

        res.json({ 
            ok: true,
            msg: 'Login',
            usuarioDB,
            token
        });
    
    } catch (error) {
    
        console.log( error );

        res.status(500).json({
            ok: false,
            msg: 'Hable con el Admin'
        });
        
    }
}

const renewToken = async ( req , res = response ) => {

    const uid = req.uid;

    const token = await generateJwt( uid );
    
    const usuarioDB = await Usuario.findById( uid );

    res.json({
        ok: true,
        msg: 'RenewToken',
        usuarioDB,
        token
        // uid: req.uid
    });

}


module.exports = { crearUsuarios , login , renewToken }
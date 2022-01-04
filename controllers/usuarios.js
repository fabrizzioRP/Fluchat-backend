const { response } = require('express');
const Usuario = require('../models/usuario');

const getUsers = async ( req, res = response ) => {

    const desde = Number( req.query.desde ) || 0;

    const usuario = await Usuario.find({ _id: { $ne: req.uid } })
                    .sort('online')
                    .skip(desde)
                    .limit(20); // -online y online == asc y desc 

    res.json({
        ok: true,
        usuario
    });

}

module.exports = { getUsers }
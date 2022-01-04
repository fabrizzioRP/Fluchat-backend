const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConnectado , usuarioDesconnectado } = require('../controllers/socket');

io.on('connection', client => {

    console.log('Cliente conectado');
    const token = client.handshake.headers['authorization'];
    const [ valido , uid ] = comprobarJWT( token );

    // verificar Auth
    if( !valido ) return client.disconnect();

    // cliente Auth
    usuarioConnectado( uid );

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioDesconnectado( uid );
    });
});

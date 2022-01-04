const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConnectado , usuarioDesconnectado , grabarMensaje } = require('../controllers/socket');

io.on('connection', client => {

    console.log('Cliente conectado');
    const token = client.handshake.headers['authorization'];
    const [ valido , uid ] = comprobarJWT( token );

    // verificar Auth
    if( !valido ) return client.disconnect();

    // cliente Auth
    usuarioConnectado( uid );

    // ingresar al usuario a una sala en particular
    // sala global, client.id
    client.join( uid );
    
    client.on( 'mensaje-personal' , async (payload) =>  {
        
        await grabarMensaje( payload );

        io.to( payload.para ).emit('mensaje-personal', payload);
    });


    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioDesconnectado( uid );
    });
});

const Server = require('./server');
//const Usuario = require('./mongoUsuario.model');
const Usuario = require('./mySqlUsuario');
const Heroe = require('./mySqlHeroes');


module.exports = {
    Server,
    Usuario,
    Heroe,
}

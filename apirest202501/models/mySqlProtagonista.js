const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');
const { Peliculas } = require('./mySqlPeliculas'); // Importa el modelo Peliculas
const { Heroes } = require('./mySqlHeroes'); // Importa el modelo Heroes

const Protagonistas = bdmysql.define('protagonistas',
    {
        'id': {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        'id_pelicula': {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Peliculas,  // Ahora Peliculas está definido
                key: 'id'
            }
        },
        'id_heroe': {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Heroes,  // Ahora Heroes está definido
                key: 'id'
            }
        },
        'actor': {
            type: DataTypes.STRING(100),
            allowNull: false
        },
    },
    {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
    }
);

module.exports = {
    Protagonistas,
};

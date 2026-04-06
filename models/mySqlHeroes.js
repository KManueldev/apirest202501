const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');

const Heroes = bdmysql.define('heroes',
    {
        'id': {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        'nombre': {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true // Evitar nombres de héroes duplicados
        },
        'bio': {
            type: DataTypes.TEXT,
            allowNull: false
        },
        'img': {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        'aparicion': {
            type: DataTypes.DATE,
            allowNull: false
        },
        'casa': {
            type: DataTypes.STRING(20)
        },
    },
    {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false
    }
);

const Peliculas = bdmysql.define('peliculas',
    {
        'id': {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        'nombre': {
            type: DataTypes.STRING(250),
            allowNull: false,
            unique: true // Evitar nombres de películas duplicados
        },
        'descripcion': {
            type: DataTypes.TEXT
        },
        'fecha_salida': {
            type: DataTypes.DATE
        },
        'presupuesto': {
            type: DataTypes.DECIMAL(15,2)
        },
        'recaudacion_total': {
            type: DataTypes.DECIMAL(15,2)
        },
        'director': {
            type: DataTypes.STRING(100)
        },
    },
    {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false
    }
);

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
                model: Peliculas,
                key: 'id'
            }
        },
        'id_heroe': {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Heroes,
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
        uniqueKeys: {
            unique_protagonista: {
                fields: ['id_pelicula', 'id_heroe'] // Evita duplicados
            }
        }
    }
);

module.exports = {
    Heroes,
    Peliculas,
    Protagonistas,
}
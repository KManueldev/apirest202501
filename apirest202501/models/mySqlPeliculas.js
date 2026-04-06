const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');
;

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

module.exports = {
    Peliculas
}

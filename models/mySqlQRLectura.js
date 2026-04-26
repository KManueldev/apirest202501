const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');

/**
 * Tabla: qr_lecturas
 *
 * Almacena el resultado de escanear un QR de película compartido.
 * El QR contiene:
 *   { id, original_language, original_title, geo, fechaHora, nickname }
 * 
 * Al momento de la lectura, la app también envía:
 *   - geo_lectura: coordenadas del dispositivo que escaneó
 *   - fecha_hora_lectura: timestamp del escaneo
 */
const QRLectura = bdmysql.define('qr_lecturas',
    {
        'id': {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        // ─── Datos de la película (del JSON dentro del QR) ────────────────────
        'pelicula_id': {
            type: DataTypes.BIGINT,
            allowNull: false,
            comment: 'id de la película según TMDB / sistema principal'
        },
        'original_language': {
            type: DataTypes.STRING(10),
            allowNull: true,
            comment: 'Idioma original de la película'
        },
        'original_title': {
            type: DataTypes.STRING(500),
            allowNull: false,
            comment: 'Título original de la película'
        },

        // ─── Datos del QR (quién lo generó y dónde) ──────────────────────────
        'nickname_generador': {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Nickname del usuario que generó el QR'
        },
        'geo_generacion': {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Coordenadas "lat,lon" del lugar donde se generó el QR'
        },
        'lat_generacion': {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
            comment: 'Latitud extraída de geo_generacion'
        },
        'lon_generacion': {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
            comment: 'Longitud extraída de geo_generacion'
        },
        'fecha_hora_generacion': {
            type: DataTypes.DATE,
            allowNull: false,
            comment: 'Fecha y hora en que se generó el QR (del campo fechaHora del JSON)'
        },

        // ─── Datos de la lectura (quién escaneó y dónde) ─────────────────────
        'geo_lectura': {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Coordenadas "lat,lon" del lugar donde se escaneó el QR'
        },
        'lat_lectura': {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
            comment: 'Latitud extraída de geo_lectura'
        },
        'lon_lectura': {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
            comment: 'Longitud extraída de geo_lectura'
        },
        'fecha_hora_lectura': {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'Fecha y hora en que fue leído / escaneado el QR'
        },
    },
    {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
        comment: 'Registro de cada escaneo de QR de película'
    }
);

module.exports = { QRLectura };
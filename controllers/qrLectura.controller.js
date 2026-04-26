const { response, request } = require('express');
const { QRLectura } = require('../models/mySqlQRLectura');
const { bdmysql } = require('../database/MySqlConnection');
const { Op } = require('sequelize');

/**
 * Parsea un string de coordenadas "lat,lon" y retorna { lat, lon } o nulls.
 */
const parsearGeo = (geoStr) => {
    if (!geoStr || typeof geoStr !== 'string') return { lat: null, lon: null };
    const partes = geoStr.split(',');
    if (partes.length !== 2) return { lat: null, lon: null };
    const lat = parseFloat(partes[0].trim());
    const lon = parseFloat(partes[1].trim());
    if (isNaN(lat) || isNaN(lon)) return { lat: null, lon: null };
    return { lat, lon };
};


// ─── GET /api/qr-lecturas  ────────────────────────────────────────────────────
// Lista todas las lecturas, opcionalmente filtradas por pelicula_id o nickname
const qrLecturasGet = async (req = request, res = response) => {
    try {
        const { pelicula_id, nickname, limit = 50, offset = 0 } = req.query;

        const where = {};
        if (pelicula_id) where.pelicula_id = pelicula_id;
        if (nickname)    where.nickname_generador = { [Op.like]: `%${nickname}%` };

        const lecturas = await QRLectura.findAll({
            where,
            order: [['fecha_hora_lectura', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.json({ ok: true, total: lecturas.length, data: lecturas });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};


// ─── GET /api/qr-lecturas/:id  ────────────────────────────────────────────────
const qrLecturaIdGet = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const lectura = await QRLectura.findByPk(id);
        if (!lectura) {
            return res.status(404).json({ ok: false, msg: `No existe lectura con id: ${id}` });
        }
        res.json({ ok: true, data: lectura });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};


// ─── POST /api/qr-lecturas  ───────────────────────────────────────────────────
/**
 * Recibe el JSON que estaba codificado en el QR + los datos de la lectura.
 *
 * Body esperado:
 * {
 *   // --- Payload del QR (tal cual lo genera la app) ---
 *   "id": 1226863,
 *   "original_language": "en",
 *   "original_title": "The Super Mario Galaxy Movie",
 *   "geo": "3.45,-76.5333",          // geo GENERACIÓN
 *   "fechaHora": "2026-04-13 12:00:00",
 *   "nickname": "arod1967",
 *
 *   // --- Datos capturados en el momento del escaneo ---
 *   "geo_lectura": "4.60,-74.0833",  // coordenadas del lector (opcional)
 *   "fecha_hora_lectura": "2026-04-20 15:30:00"  // si no se envía, usa NOW()
 * }
 */
const qrLecturaPost = async (req = request, res = response) => {
    const usuarioId = req.usuario.id;
    try {
        const {
            // payload del QR
            id: pelicula_id,
            original_language,
            original_title,
            geo,
            fechaHora,
            nickname,

            // datos de la lectura
            geo_lectura,
            fecha_hora_lectura,
        } = req.body;

        // ── Validaciones mínimas ──────────────────────────────────────────────
        if (!pelicula_id || !original_title || !nickname || !fechaHora) {
            return res.status(400).json({
                ok: false,
                msg: 'Faltan campos obligatorios: id, original_title, nickname, fechaHora'
            });
        }

        // ── Parsear coordenadas ───────────────────────────────────────────────
        const { lat: lat_generacion, lon: lon_generacion } = parsearGeo(geo);
        const { lat: lat_lectura,   lon: lon_lectura   } = parsearGeo(geo_lectura);

        // ── Crear registro ────────────────────────────────────────────────────
        const nuevaLectura = await QRLectura.create({
            usuarioId,
            pelicula_id,
            original_language:    original_language || null,
            original_title,
            nickname_generador:   nickname,
            geo_generacion:       geo       || null,
            lat_generacion,
            lon_generacion,
            fecha_hora_generacion: new Date(fechaHora),
            geo_lectura:          geo_lectura || null,
            lat_lectura,
            lon_lectura,
            fecha_hora_lectura:   fecha_hora_lectura ? new Date(fecha_hora_lectura) : new Date(),
        });

        res.status(201).json({
            ok: true,
            msg: 'Lectura de QR guardada correctamente',
            data: nuevaLectura
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};


// ─── PUT /api/qr-lecturas/:id  ────────────────────────────────────────────────
// Permite corregir datos de una lectura existente (p.ej. geo_lectura)
const qrLecturaPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { body } = req;

    try {
        const lectura = await QRLectura.findByPk(id);
        if (!lectura) {
            return res.status(404).json({ ok: false, msg: `No existe lectura con id: ${id}` });
        }

        // Si se actualiza algún campo de geo, recalcular lat/lon
        if (body.geo_generacion !== undefined) {
            const { lat, lon } = parsearGeo(body.geo_generacion);
            body.lat_generacion = lat;
            body.lon_generacion = lon;
        }
        if (body.geo_lectura !== undefined) {
            const { lat, lon } = parsearGeo(body.geo_lectura);
            body.lat_lectura = lat;
            body.lon_lectura = lon;
        }

        await lectura.update(body);
        res.json({ ok: true, msg: 'Lectura actualizada', data: lectura });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};


// ─── DELETE /api/qr-lecturas/:id  ────────────────────────────────────────────
const qrLecturaDelete = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const lectura = await QRLectura.findByPk(id);
        if (!lectura) {
            return res.status(404).json({ ok: false, msg: `No existe lectura con id: ${id}` });
        }
        await lectura.destroy();
        res.json({ ok: true, msg: 'Lectura eliminada', data: lectura });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};


// ─── GET /api/qr-lecturas/pelicula/:peliculaId  ───────────────────────────────
// Todas las lecturas de una película específica
const qrLecturasPorPeliculaGet = async (req = request, res = response) => {
    const { peliculaId } = req.params;
    try {
        const lecturas = await QRLectura.findAll({
            where: { pelicula_id: peliculaId },
            order: [['fecha_hora_lectura', 'DESC']],
        });
        res.json({ ok: true, total: lecturas.length, data: lecturas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};


// ─── GET /api/qr-lecturas/mis ───────────────────────────────────────────────
const misQrLecturasGet = async (req = request, res = response) => {
    try {
        const usuarioId = req.usuario.id;

        const lecturas = await QRLectura.findAll({
            where: { usuarioId },
            order: [['fecha_hora_lectura', 'DESC']],
        });

        res.json({
            ok: true,
            data: lecturas
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error obteniendo tus QR'
        });
    }
};


module.exports = {
    qrLecturasGet,
    qrLecturaIdGet,
    qrLecturaPost,
    qrLecturaPut,
    qrLecturaDelete,
    qrLecturasPorPeliculaGet,
    misQrLecturasGet,
};

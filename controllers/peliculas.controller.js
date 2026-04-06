const { response, request } = require('express');
const { Peliculas } = require('../models/mySqlPeliculas');
const { bdmysql } = require('../database/MySqlConnection');

const peliculasGet = async (req, res = response) => {
    try {
        const peliculas = await Peliculas.findAll();
        res.json({ ok: true, data: peliculas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

const peliculaIdGet = async (req, res = response) => {
    const { id } = req.params;
    try {
        const pelicula = await Peliculas.findByPk(id);
        if (!pelicula) {
            return res.status(404).json({ ok: false, msg: 'No existe una película con el id: ' + id });
        }
        res.json({ ok: true, data: pelicula });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

const peliculasPost = async (req, res = response) => {
    try {
        const { nombre, descripcion, fecha_salida, presupuesto, recaudacion_total, director } = req.body;
        const existePelicula = await Peliculas.findOne({ where: { nombre } });
        if (existePelicula) {
            return res.status(400).json({ ok: false, msg: 'Ya existe una película llamada: ' + nombre });
        }
        const pelicula = await Peliculas.create({ nombre, descripcion, fecha_salida, presupuesto, recaudacion_total, director });
        res.json({ ok: true, mensaje: 'Película creada', data: pelicula });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

const peliculaPut = async (req, res = response) => {
    const { id } = req.params;
    try {
        const pelicula = await Peliculas.findByPk(id);
        if (!pelicula) {
            return res.status(404).json({ ok: false, msg: 'No existe una película con el id: ' + id });
        }
        await pelicula.update(req.body);
        res.json({ ok: true, msg: 'Película actualizada', data: pelicula });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

const peliculaDelete = async (req, res = response) => {
    const { id } = req.params;
    try {
        const pelicula = await Peliculas.findByPk(id);
        if (!pelicula) {
            return res.status(404).json({ ok: false, msg: 'No existe una película con el id: ' + id });
        }
        await pelicula.destroy();
        res.json({ ok: true, msg: 'Película eliminada', data: pelicula });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

module.exports = { peliculasGet, peliculaIdGet, peliculasPost, peliculaPut, peliculaDelete };

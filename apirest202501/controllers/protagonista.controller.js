const { response, request } = require('express');
const { Protagonistas } = require('../models/mySqlProtagonista');
const { bdmysql } = require('../database/MySqlConnection');

const protagonistasGet = async (req, res = response) => {
    try {
        const protagonistas = await Protagonistas.findAll();
        res.json({ ok: true, data: protagonistas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

const protagonistaIdGet = async (req, res = response) => {
    const { id } = req.params;
    try {
        const protagonista = await Protagonistas.findByPk(id);
        if (!protagonista) {
            return res.status(404).json({ ok: false, msg: 'No existe un protagonista con el id: ' + id });
        }
        res.json({ ok: true, data: protagonista });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

const protagonistasPost = async (req, res = response) => {
    try {
        const { id_pelicula, id_heroe, actor } = req.body;
        const existeProtagonista = await Protagonistas.findOne({ where: { id_pelicula, id_heroe } });
        if (existeProtagonista) {
            return res.status(400).json({ ok: false, msg: 'Este héroe ya está registrado en esta película' });
        }
        const protagonista = await Protagonistas.create({ id_pelicula, id_heroe, actor });
        res.json({ ok: true, mensaje: 'Protagonista creado', data: protagonista });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

const protagonistaPut = async (req, res = response) => {
    const { id } = req.params;
    try {
        const protagonista = await Protagonistas.findByPk(id);
        if (!protagonista) {
            return res.status(404).json({ ok: false, msg: 'No existe un protagonista con el id: ' + id });
        }
        await protagonista.update(req.body);
        res.json({ ok: true, msg: 'Protagonista actualizado', data: protagonista });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

const protagonistaDelete = async (req, res = response) => {
    const { id } = req.params;
    try {
        const protagonista = await Protagonistas.findByPk(id);
        if (!protagonista) {
            return res.status(404).json({ ok: false, msg: 'No existe un protagonista con el id: ' + id });
        }
        await protagonista.destroy();
        res.json({ ok: true, msg: 'Protagonista eliminado', data: protagonista });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Hable con el Administrador', err: error });
    }
};

module.exports = { protagonistasGet, protagonistaIdGet, protagonistasPost, protagonistaPut, protagonistaDelete };

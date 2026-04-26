const { Router } = require('express');

const {
    qrLecturasGet,
    qrLecturaIdGet,
    qrLecturaPost,
    qrLecturaPut,
    qrLecturaDelete,
    qrLecturasPorPeliculaGet,
} = require('../controllers/qrLectura.controller');

const router = Router();

// GET  /api/qr-lecturas                        → lista todas (con filtros opcionales)
router.get('/', qrLecturasGet);

// GET  /api/qr-lecturas/pelicula/:peliculaId   → lecturas por película
router.get('/pelicula/:peliculaId', qrLecturasPorPeliculaGet);

// GET  /api/qr-lecturas/:id                    → una lectura por PK
router.get('/:id', qrLecturaIdGet);

// POST /api/qr-lecturas                        → registrar nueva lectura de QR
router.post('/', qrLecturaPost);

// PUT  /api/qr-lecturas/:id                    → actualizar lectura existente
router.put('/:id', qrLecturaPut);

// DELETE /api/qr-lecturas/:id                  → eliminar lectura
router.delete('/:id', qrLecturaDelete);

module.exports = router;
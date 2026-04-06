const { Router } = require('express');

const { peliculasGet, 
        peliculaIdGet,
        peliculasPost,
        peliculaPut,
        peliculaDelete 
} = require('../controllers/peliculas.controller');

const router = Router();

router.get('/', peliculasGet);

router.get('/:id', peliculaIdGet);

// Para insertar una Película en la BD
router.post('/', peliculasPost);

// Para modificar una Película en la BD
router.put('/:id', peliculaPut);

// Para eliminar una Película de la BD
router.delete('/:id', peliculaDelete);

module.exports = router;

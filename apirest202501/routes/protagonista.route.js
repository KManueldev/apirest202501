const { Router } = require('express');

const { protagonistasGet, 
        protagonistaIdGet,
        protagonistasPost,
        protagonistaPut,
        protagonistaDelete 
} = require('../controllers/protagonista.controller');

const router = Router();

router.get('/', protagonistasGet);

router.get('/:id', protagonistaIdGet);

// Para insertar un Protagonista en la BD
router.post('/', protagonistasPost);

// Para modificar un Protagonista en la BD
router.put('/:id', protagonistaPut);

// Para eliminar un Protagonista de la BD
router.delete('/:id', protagonistaDelete);

module.exports = router;

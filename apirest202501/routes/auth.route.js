const { Router } = require('express');
const { login, register, getProfile, updateProfile, deleteProfile } = require('../controllers/auth.controller');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.post('/login',[
    //check('correo','El correo es obligatorio').isEmail(),
    //check('password','La contraseña es obligatoria').not().isEmpty(),
    //validarCampos
], login);

router.post('/register',[ 
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
    //check('correo','El correo es obligatorio').isEmail(),
    //check('password','La contraseña es obligatoria').not().isEmpty(),
    //validarCampos
], register);

router.get('/profile', validarJWT, getProfile);

router.put('/profile', validarJWT, updateProfile);

router.delete('/profile', validarJWT, deleteProfile);


module.exports = router;

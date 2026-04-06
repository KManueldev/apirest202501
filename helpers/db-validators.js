const { Usuario} = require("../models");

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
      throw new Error(`El id no existe ${id}`);
    }
  };


  module.exports = {
     existeUsuarioPorId,
   };

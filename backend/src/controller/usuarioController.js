const usuarioCtrl = {};
const Usuario = require('../models/usuario');
const fs = require('fs');
const path = require('path');


// Listar usuarios
usuarioCtrl.getUsu = async (req, res) => { //Este es para todos los usuarios
  try {
    const usuarios = await Usuario.find();
    const usuariosConFoto = usuarios.map(usuario => ({
      ...usuario._doc,
      foto: usuario.foto
        ? `http://localhost:4000/img/${usuario.foto}`
        : `http://localhost:4000/img/noFoto.png`, // Imagen por defecto si no hay foto
    }));
    res.json(usuariosConFoto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
};


// Crear un usuario
usuarioCtrl.createUsu = async (req, res) => {
  try {
    const { nombre, apellido, correo, telefono, edad } = req.body;

    if (!nombre || !correo || !apellido || !telefono) {
      return res.status(400).json({ message: 'El nombre, apellidos, teléfono y correo son obligatorios' });
    }

    const nombreFoto = req.body.nombreFoto || 'noFoto.png';

    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      correo,
      telefono,
      edad,
      foto: nombreFoto,
      password: req.body.password
    });

    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario creado', usuario: usuarioGuardado });
  } catch (error) {
    console.error('Error al crear usuario:', error); // Log del error
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};



// Buscar un usuario
usuarioCtrl.getUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
};


// Borrar usuario
usuarioCtrl.deleteUsu = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });


    // Eliminar la foto del servidor si existe
    if (usuario.foto && usuario.foto !== 'noFoto.png') {
      const filePath = path.join(__dirname, '../img', usuario.foto);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error al eliminar la foto:', err);
          return res.status(500).json({ message: 'Error al eliminar la foto', error: err.message });
        }
      });
    }


    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};


// Actualizar un usuario
usuarioCtrl.updateUsu = async (req, res) => {
  try {
    const { nombre, apellido, correo, telefono, edad } = req.body;
    const foto = req.file ? req.body.nombreFoto : undefined; // Captura la foto si existe


    // Buscar el usuario actual para obtener la foto antigua
    const usuarioActual = await Usuario.findById(req.params.id);
    if (!usuarioActual) return res.status(404).json({ message: 'Usuario no encontrado' });


    // Eliminar la foto antigua del servidor si existe y si se ha subido una nueva foto
    if (foto && usuarioActual.foto && usuarioActual.foto !== 'noFoto.png') {
      const filePath = path.join(__dirname, '../img', usuarioActual.foto);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error al eliminar la foto antigua:', err);
          return res.status(500).json({ message: 'Error al eliminar la foto antigua', error: err.message });
        }
      });
    }


    // Encuentra y actualiza el usuario
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, apellido, correo, telefono, edad, ...(foto && { foto }) }, // Solo actualiza la foto si se envía
      { new: true }
    );


    res.json({ message: 'Usuario actualizado', usuario });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
};


module.exports = usuarioCtrl;
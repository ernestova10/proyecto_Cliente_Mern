const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioCtrl = require('../controller/usuarioController');
const Usuario = require('../models/usuario'); // Asegúrate de que el modelo esté importado

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../img'));
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname);
    const nombre = req.body.nombre.replace(/\s+/g, '');
    const apellido = req.body.apellido.replace(/\s+/g, '');
    const telefono = req.body.telefono.replace(/\s+/g, '');
    const nombreFoto = `${nombre}${apellido}${telefono}${extension}`;
    req.body.nombreFoto = nombreFoto;
    callback(null, nombreFoto);
  }
});

const upload = multer({ storage });

router.get('/', usuarioCtrl.getUsu);
router.post('/', upload.single('foto'), usuarioCtrl.createUsu);
router.get('/:id', usuarioCtrl.getUsuario);
router.put('/:id', upload.single('foto'), usuarioCtrl.updateUsu);
router.delete('/:id', usuarioCtrl.deleteUsu);

// Nueva ruta para LOGIN
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;
  
  try {
    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, correo: usuario.correo },
      process.env.JWT_SECRET || 'secreto123', 
      { expiresIn: '1h' }
    );

    res.json({ mensaje: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error });
  }
});

module.exports = router;

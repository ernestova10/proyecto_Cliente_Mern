const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  edad: { type: Number, min: 0, max: 120 },
  telefono: { type: Number, required: true },
  correo: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'El correo debe tener un formato válido']
  }, // Agregado el campo de contraseña hasheada
  foto: { type: String },
  password: { type: String, required: true }
}, {
  timestamps: true,
});

// Middleware para hashear la contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = model('Usuario', usuarioSchema);

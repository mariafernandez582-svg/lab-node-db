const mongoose = require("mongoose");

const personaSchema = new mongoose.Schema(
  {
    nombre:   { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    edad:     { type: Number, required: true, min: 0 },
    correo:   { type: String, required: true, trim: true, lowercase: true },
  },
  { collection: "personas" }
);

module.exports = mongoose.model("Persona", personaSchema);

const Persona = require("../models/persona");

async function listarPersonas(req, res) {
  // TODO (paso 7): consulta con Persona.find(), ordena y usa .lean().
  // Renderiza "personas/index" y envía { titulo: "Listado de personas", personas }.
  // Borra el throw cuando el render esté escrito.
  const personas = await Persona.find().sort({ apellido: 1, nombre: 1 }).lean();

res.render("personas/index", {
  titulo: "Listado de personas",
  personas: personas,
});
}

module.exports = { listarPersonas };

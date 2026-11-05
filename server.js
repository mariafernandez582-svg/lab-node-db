/*
 * Laboratorio — Listado de personas
 * Archivo: server.js
 * Este archivo arranca la aplicación.
 * Tu tarea (paso 5): abrir el puerto cuando la base de datos ya esté conectada.
 * Guía: README.md
 */

require("dotenv").config({ quiet: true });

const app = require("./src/index");
const conectarBaseDeDatos = require("./src/configurations/database");

const PORT = process.env.PORT || 3000;

async function iniciar() {
  // Esta llamada ya está escrita. La conexión se completa en database.js (paso 4).
  await conectarBaseDeDatos();

 app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});
}

iniciar().catch((error) => {
  console.error("No se pudo iniciar el servidor.");
  console.error(error.message);
  process.exit(1);
});

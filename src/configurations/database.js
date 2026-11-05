/*
 * Laboratorio — Listado de personas
 * Archivo: src/configurations/database.js
 * Tu tarea (paso 4): conectar Mongoose con la URI del archivo .env.
 * Guía: README.md
 */

const mongoose = require("mongoose");

async function conectarBaseDeDatos() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Falta MONGODB_URI. En .env pega la URL de MongoDB Atlas, la que empieza por mongodb+srv:// (paso 2)."
    );
  }

  await mongoose.connect(uri);
console.log("Conectado a MongoDB. Base de datos:", mongoose.connection.name);
}

module.exports = conectarBaseDeDatos;

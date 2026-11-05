/*
 * Laboratorio — Listado de personas
 * Archivo: src/index.js
 * Aquí se configura Express. El motor EJS y la carpeta public ya están listos.
 * Tu tarea (paso 9): montar las rutas de personas.
 * Guía: README.md
 */

const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "..", "public")));

// TODO (paso 9): descomenta las dos líneas. Deben quedar ANTES de app.get.
// const personaRoutes = require("./routes/personaRoutes");
// app.use("/", personaRoutes);
const personaRoutes = require("./routes/personaRoutes");
app.use("/", personaRoutes);

app.get("/", (req, res) => {
  res.send("Servidor en marcha. Sigue el README desde el paso 6 para mostrar las personas.");
});

module.exports = app;

const express = require("express");
const { listarPersonas } = require("../controllers/personaController");

const router = express.Router();

router.get("/", listarPersonas);

module.exports = router;

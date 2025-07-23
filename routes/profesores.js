const express = require("express");
const router = express.Router();
const conexion = require("../db/conexion");
const verificarSesion = require("../middlewares/authMiddleware");

// Mostrar formulario para registrar nuevo profesor
router.get("/registrar", verificarSesion, (req, res) => {
  res.render("registrar_profesor"); // debe existir esta vista EJS
});

// Guardar profesor
router.post("/registrar", verificarSesion, (req, res) => {
  const {
    num_conomico,
    nombre,
    apellido_materno,
    apellico_paterno,
    telefono,
    correo,
    cubiculo,
    id_estado
  } = req.body;

  const insertQuery = `
    INSERT INTO profesor (
      num_economico, nombre, apellido_materno, apellico_paterno,
      telefono, correo, cubiculo, id_estado
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    num_conomico,
    nombre,
    apellido_materno,
    apellico_paterno,
    telefono,
    correo,
    cubiculo,
    id_estado
  ];

  conexion.query(insertQuery, valores, (err, resultado) => {
    if (err) {
      console.error("Error al registrar profesor:", err);
      return res.status(500).send("Error al registrar profesor");
    }

    res.redirect("/proyectos_integracion/registrar");
  });
});

module.exports = router;



module.exports = router;

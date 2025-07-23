const express = require("express");
const router = express.Router();
const conexion = require("../db/conexion"); 
const verificarSesion = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");

// Configuración de multer para guardar archivos en uploads/proyectos_integracion
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/proyectos_integracion");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

/*Metodo GET para obtener informacion de la base de datos*/
router.get("/", (req, res) => {
  const query = `
    SELECT CONCAT(a.nombre, ' ', a.apellido_materno, ' ', a.apellido_paterno) AS autor, 
           CONCAT(p.nombre, ' ', p.apellido_materno, ' ', p.apellico_paterno) AS asesor, 
           pi.titulo, area.area, pi.anio_realizacion, pi.path_proyecto
    FROM alumno a 
    INNER JOIN proyecto_integracion pi ON a.id_proyecto_integracion = pi.id_proyecto_integracion 
    INNER JOIN area ON area.id_area = pi.id_area 
    INNER JOIN profesor_alumno pa ON pa.id_alumno = a.id_alumno 
    INNER JOIN profesor p ON pa.id_profesor = p.id_profesor 
    INNER JOIN rol ON rol.id_rol = pa.id_rol_profesor 
    WHERE rol = 'asesor';
  `;

  conexion.query(query, (err, resultados) => {
    if (err) {
      console.error("Error en la consulta:", err);
      res.status(500).send("Error en la base de datos");
    } else {
      res.render("proyectos_integracion", { proyectos_integracion: resultados});
    }
  });
});

/*ENVIAR FORMULARIO A LA BASE DE DATOS*/
router.post("/registrar", verificarSesion, upload.single('path_proyecto'), (req, res) => {
  const {
    matricula, nombre, apellido_paterno, apellido_materno, licenciatura,
    titulo, anio_realizacion, descripcion, objetivo_gral, numero_trimestres,
    id_trimestre, id_area, id_modo, id_estado_proyecto,
    id_profesor, id_coasesor
  } = req.body;

  const path_proyecto = req.file ? req.file.path : null;

  if (!id_profesor) return res.status(400).send("Debe seleccionar un asesor");

  conexion.beginTransaction(err => {
    if (err) { console.error(err); return res.status(500).send("Error interno"); }

    const insertProyecto = `INSERT INTO proyecto_integracion
      (titulo, anio_realizacion, descripcion, objetivo_gral, numero_trimestres,
       path_proyecto, id_trimestre, id_area, id_modo, id_estado_proyecto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const valProyecto = [
      titulo, anio_realizacion, descripcion, objetivo_gral,
      numero_trimestres, path_proyecto,
      id_trimestre, id_area, id_modo, id_estado_proyecto
    ];

    conexion.query(insertProyecto, valProyecto, (err, rProj) => {
      if (err) return conexion.rollback(() => res.status(500).send("Error proyecto"));

      const idProyecto = rProj.insertId;

      const insertAlumno = `INSERT INTO alumno
        (matricula, nombre, apellido_paterno, apellido_materno,
         id_licenciatura, id_proyecto_integracion)
        VALUES (?, ?, ?, ?, ?, ?)`;
      const valAlumno = [
        matricula, nombre, apellido_paterno, apellido_materno,
        licenciatura, idProyecto
      ];

      conexion.query(insertAlumno, valAlumno, (err, rAlum) => {
        if (err) return conexion.rollback(() => res.status(500).send("Error alumno"));

        const idAlumno = rAlum.insertId;

        const insertProfAlum = `INSERT INTO profesor_alumno
          (id_profesor, id_alumno, id_rol_profesor) VALUES (?, ?, ?)`;

        conexion.query(insertProfAlum, [id_profesor, idAlumno, 1], err => {
          if (err) return conexion.rollback(() => res.status(500).send("Error asesor"));

          const insertarCoasesor = id_coasesor
            ? cb => conexion.query(insertProfAlum, [id_coasesor, idAlumno, 2], cb)
            : cb => cb(null);

          insertarCoasesor(err => {
            if (err) return conexion.rollback(() => res.status(500).send("Error coasesor"));

            conexion.commit(err => {
              if (err) return conexion.rollback(() => res.status(500).send("Error commit"));
              console.log("Proyecto, alumno y profesor(es) registrados");
              res.redirect("/proyectos_integracion");
            });
          });
        });
      });
    });
  });
});

/* MOSTARR PROFESORES */
router.get("/registrar", verificarSesion, (req, res) => {
  const sqlProfesores = "SELECT id_profesor, nombre, apellico_paterno, apellido_materno FROM profesor";

  conexion.query(sqlProfesores, (err, profesores) => {
    if (err) {
      console.error("Error al cargar profesores:", err);
      return res.status(500).send("Error al cargar profesores");
    }

    res.render("registrar_proyecto_integracion", {
      usuario: req.session.usuario,
      profesores: profesores
    });
  });
});

module.exports = router;

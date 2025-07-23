const express = require("express");
const router = express.Router();
const conexion = require("../db/conexion");
const verificarSesion = require("../middlewares/authMiddleware");

router.get("/", (req, res) => {
  const query = `
    select titulo, clave, fecha_inicio, fecha_fin, pia, objetivo_gral from proyecto_investigacion;
  `;


  conexion.query(query, (err, resultados) => {
    if (err) {
      console.error("Error en la consulta:", err);
      res.status(500).send("Error en la base de datos");
    } else {
      res.render("proyectos_investigacion", { proyectos_investigacion: resultados});
    }
  });
});

router.get("/registrar", verificarSesion, (req, res) => {
  const query = "SELECT id_profesor, nombre, apellico_paterno, apellido_materno FROM profesor WHERE id_estado = 1";
  conexion.query(query, (err, profesores) => {
    if (err) {
      console.error("Error al obtener profesores:", err);
      return res.status(500).send("Error al cargar profesores");
    }
    res.render("registrar_proyecto_investigacion", { profesores });
  });
});

router.post("/registrar", verificarSesion, (req, res) => {
  const {
    titulo,
    clave,
    acuerdo,
    fecha_inicio,
    fecha_fin,
    pia,
    objetivo_gral,
    objetivos_particulares,
    id_profesores,
    id_roles_profesor
  } = req.body;

  if (!id_profesores || !id_roles_profesor || id_profesores.length === 0) {
    return res.status(400).send("Debe agregar al menos un profesor.");
  }

  const objetivos = Array.isArray(objetivos_particulares) ? objetivos_particulares : [objetivos_particulares];
  const profesores = Array.isArray(id_profesores) ? id_profesores : [id_profesores];
  const roles = Array.isArray(id_roles_profesor) ? id_roles_profesor : [id_roles_profesor];

  conexion.beginTransaction(err => {
    if (err) return res.status(500).send("Error de conexión");

    const insertProyecto = `
      INSERT INTO proyecto_investigacion (
        titulo, clave, acuerdo, fecha_inicio,
        fecha_fin, pia, objetivo_gral
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const datosProyecto = [titulo, clave, acuerdo, fecha_inicio, fecha_fin, pia, objetivo_gral];

    conexion.query(insertProyecto, datosProyecto, (err, resultProyecto) => {
      if (err) return conexion.rollback(() => res.status(500).send("Error al insertar proyecto"));

      const idProyecto = resultProyecto.insertId;

      // Insertar objetivos particulares
      const insertObjetivo = `
        INSERT INTO objetivos_particulares (objetivo, id_proyecto_investigacion)
        VALUES ?
      `;

      const valoresObjetivos = objetivos.map(obj => [obj, idProyecto]);

      conexion.query(insertObjetivo, [valoresObjetivos], (err) => {
      if (err) {
        console.error("Error al insertar objetivos:", err); 
        return conexion.rollback(() => res.status(500).send("Error al insertar objetivos"));
      }

        // Insertar profesores
        const insertProfesor = `
          INSERT INTO profesor_proyecto_investigacion (id_profesor, id_proyecto_investigacion, id_rol)
          VALUES ?
        `;

        const valoresProfesores = profesores.map((id_prof, i) => [
          id_prof,
          idProyecto,
          roles[i]
        ]);

       conexion.query(insertProfesor, [valoresProfesores], (err) => {
  if (err) {
    console.error("Error al vincular profesores:", err); 
    return conexion.rollback(() => res.status(500).send("Error al vincular profesores"));
  }
});

          // Confirmar todo
          conexion.commit(err => {
            if (err) return conexion.rollback(() => res.status(500).send("Error al confirmar transacción"));

            res.redirect("/proyectos_investigacion");
          });
        });
      });
    });
  });

module.exports = router;
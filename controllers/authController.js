const conexion = require("../db/conexion");
const bcrypt = require("bcrypt");

exports.login = (req, res) => {
  const { txtuser, txtpass } = req.body;

  if (!txtuser || !txtpass) {
    return res.send("Debes llenar todos los campos");
  }

  conexion.query(
    "SELECT * FROM usuarios WHERE usuario = ?",
    [txtuser],
    async (error, results) => {
      if (error) throw error;

      if (results.length === 0) {
        return res.send("Usuario no encontrado");
      }

      const usuario = results[0];

      const passwordValida = await bcrypt.compare(txtpass, usuario.contrasenia);

      if (!passwordValida) {
        return res.send("Contraseña incorrecta");
      }

      req.session.usuario = usuario;

      res.redirect("/proyectos_integracion/registrar");
    }
  );
};
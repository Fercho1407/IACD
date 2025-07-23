const readline = require("readline");
const bcrypt = require("bcrypt");
const conexion = require("./db/conexion");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function preguntar(pregunta) {
  return new Promise((resolve) => rl.question(pregunta, resolve));
}

async function registrarUsuario() {
  try {
    const username = await preguntar("Nombre de usuario: ");
    const password = await preguntar("Contraseña: ");
    rl.close();

    const hash = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO usuarios (usuario, contrasenia) VALUES (?, ?)";

    conexion.query(sql, [username, hash], (err, resultado) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          console.log("❌ El usuario ya existe.");
        } else {
          console.error("❌ Error al registrar:", err.message);
        }
      } else {
        console.log("✅ Usuario registrado correctamente.");
      }

      conexion.end();
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    conexion.end();
    rl.close();
  }
}

registrarUsuario();
const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); // Carpeta para tus assets públicos (CSS, JS, imágenes)

// ⚠️ Agrega esta línea para permitir acceder a los archivos subidos (como los .pdf, .zip, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuración de sesión
app.use(session({
  secret: "clave_secreta",
  resave: false,
  saveUninitialized: false
}));

// Motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rutas
const proyectosIntegracionRouter = require("./routes/proyectos_integracion");
app.use("/proyectos_integracion", proyectosIntegracionRouter);

const proyectosInvestigacionnRouter = require("./routes/proyectos_investigacion");
app.use("/proyectos_investigacion", proyectosInvestigacionnRouter);

const profesoresRouter = require("./routes/profesores");
app.use("/profesores", profesoresRouter);

const authRouter = require("./routes/auth");
app.use("/", authRouter);

// Ruta login
app.get('/login', (req, res) => {
  res.render('login'); 
});

// Iniciar servidor
app.listen(3000, '0.0.0.0', () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

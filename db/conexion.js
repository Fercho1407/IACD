let mysql = require("mysql2");

let conexion = mysql.createConnection({
    host: "localhost",
    database: "sistema_proyectos",
    user: "root",
    password: "root"
});

conexion.connect(function(err){
    if(err){
        throw err;
    }else{
        console.log("Conexion exitosa")
    }
});

module.exports = conexion;


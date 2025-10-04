CREATE DATABASE if not exists sistema_proyectos;
USE sistema_proyectos;
-- drop DATABASE sistema_proyectos;


-- Seccion profesores
-- Tabla estado
CREATE TABLE estado(
id_estado INT PRIMARY KEY AUTO_INCREMENT,
estado VARCHAR(50));

-- Tabla rol
CREATE TABLE rol(
id_rol INT PRIMARY KEY AUTO_INCREMENT,
rol VARCHAR(50));

-- tabla profesor
CREATE TABLE profesor(
id_profesor INT PRIMARY KEY AUTO_INCREMENT,
num_economico VARCHAR(45),
nombre VARCHAR(100),
apellido_materno VARCHAR(50),
apellico_paterno VARCHAR(50),
telefono VARCHAR(15),
correo VARCHAR(50),
cubiculo VARCHAR(10),
id_estado INT,
-- id_rol INT,

CONSTRAINT fk_profesor_estado
FOREIGN KEY (id_estado) REFERENCES estado(id_estado)
ON DELETE SET NULL
ON UPDATE CASCADE -- ,

/*
CONSTRAINT fk_profesor_rol
FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
ON DELETE SET NULL
ON UPDATE CASCADE*/
);

-- Seccion proyectos de integracion
-- tabla trimestre
CREATE TABLE trimestre(
id_trimestre INT PRIMARY KEY AUTO_INCREMENT,
trimestre VARCHAR(50));

-- Tabla are
CREATE TABLE area(
id_area INT PRIMARY KEY AUTO_INCREMENT,
area VARCHAR(50));

-- Tabla modo
CREATE TABLE modo(
id_modo INT PRIMARY KEY AUTO_INCREMENT,
modo VARCHAR(50));

-- Tabla estado del proyecto
CREATE TABLE estado_proyecto(
id_estado_proyecto INT PRIMARY KEY AUTO_INCREMENT,
estado_proyecto VARCHAR(50));

-- Tabla proyecto de itegracion 
CREATE TABLE proyecto_integracion(
id_proyecto_integracion INT PRIMARY KEY AUTO_INCREMENT,
titulo TEXT,
anio_realizacion YEAR,
descripcion TEXT,
objetivo_gral TEXT,
numero_trimestres INT,
path_proyecto TEXT,
path_codigo_fuente TEXT,
id_trimestre INT,
id_area INT,
id_modo INT,
id_estado_proyecto INT,


CONSTRAINT fk_proyectoI_trimestre
FOREIGN KEY (id_trimestre) REFERENCES trimestre(id_trimestre)
ON DELETE SET NULL
ON UPDATE CASCADE,

CONSTRAINT fk_proyectoI_area
FOREIGN KEY (id_area) REFERENCES area(id_area)
ON DELETE SET NULL
ON UPDATE CASCADE,

CONSTRAINT fk_proyectoI_modo
FOREIGN KEY (id_modo) REFERENCES modo(id_modo)
ON DELETE SET NULL
ON UPDATE CASCADE,

CONSTRAINT fk_proyectoI_estadoProyecto
FOREIGN KEY (id_estado_proyecto) REFERENCES estado_proyecto(id_estado_proyecto)
ON DELETE SET NULL
ON UPDATE CASCADE
);

-- Seccion Alumno
-- Tabla licenciatura
CREATE TABLE licenciatura(
id_licenciatura INT PRIMARY KEY AUTO_INCREMENT,
licenciatura VARCHAR(50));

-- Tabla alumno
CREATE TABLE alumno(
id_alumno INT PRIMARY KEY AUTO_INCREMENT,
matricula VARCHAR(10),
nombre VARCHAR(100), 
apellido_paterno VARCHAR(50),
apellido_materno VARCHAR(50),
id_licenciatura INT,
id_proyecto_integracion	INT,

CONSTRAINT fk_alumno_licenciatura
FOREIGN KEY (id_licenciatura) REFERENCES licenciatura(id_licenciatura)
ON DELETE SET NULL
ON UPDATE CASCADE,

CONSTRAINT fk_alumno_proyectoIntegracion
FOREIGN KEY (id_proyecto_integracion) REFERENCES proyecto_integracion(id_proyecto_integracion)
ON DELETE SET NULL
ON UPDATE CASCADE);

-- Seccion Proyectos de Investigacion 
-- tabla Proyectos de Investigacion 


CREATE TABLE proyecto_investigacion(
id_proyecto_investigacion INT PRIMARY KEY AUTO_INCREMENT,
titulo TEXT,
clave VARCHAR(45),
acuerdo VARCHAR(60),
fecha_inicio DATE,
fecha_fin DATE,
pia VARCHAR(60),
objetivo_gral TEXT);

-- tabla de objetivos particulares
CREATE TABLE objetivos_particulares(
id_objetivo_particular INT PRIMARY KEY AUTO_INCREMENT,
objetivo TEXT,
id_proyecto_integracion INT,
id_proyecto_investigacion INT,

CONSTRAINT fk_objtivosParticulares_proyectoIntegracion
FOREIGN KEY(id_proyecto_integracion) REFERENCES proyecto_integracion(id_proyecto_integracion)
ON DELETE CASCADE
ON UPDATE CASCADE,

CONSTRAINT fk_objtivosParticulares_proyectoInvestigacion
FOREIGN KEY(id_proyecto_investigacion) REFERENCES proyecto_investigacion(id_proyecto_investigacion)
ON DELETE CASCADE
ON UPDATE CASCADE);


-- Seccion de las tablas puente 
-- Relacion entre profesores y poryectos de investigacion
CREATE TABLE profesor_proyecto_investigacion(
id_profesor INT,
id_proyecto_investigacion INT,
id_rol INT,

CONSTRAINT fk_profesor_proyectoInvestigacion
FOREIGN KEY(id_profesor) REFERENCES profesor(id_profesor)
ON DELETE SET NULL
ON UPDATE CASCADE,

CONSTRAINT fk_proyectoInvestigacion_profesor
FOREIGN KEY(id_proyecto_investigacion) REFERENCES proyecto_investigacion(id_proyecto_investigacion)
ON DELETE SET NULL
ON UPDATE CASCADE,

CONSTRAINT fk_proyectoInvestigacion_rol
FOREIGN KEY(id_rol) REFERENCES rol(id_rol)
ON DELETE SET NULL
ON UPDATE CASCADE);

-- Relacion entre profesores alumnos 
CREATE TABLE profesor_alumno(
id_profesor INT,
id_rol_profesor INT,
id_alumno int,

CONSTRAINT fk_profesor_rol
FOREIGN KEY (id_rol_profesor) REFERENCES rol(id_rol)
ON DELETE SET NULL
ON UPDATE CASCADE,

CONSTRAINT fk_profesor_alumno
FOREIGN KEY (id_profesor) REFERENCES profesor(id_profesor)
ON DELETE SET NULL
ON UPDATE CASCADE,

CONSTRAINT fk_alumno_profesor
FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno)
ON DELETE SET NULL
ON UPDATE CASCADE);

create table usuarios ( 
usuario varchar(45) unique,
contrasenia text);

insert into rol (id_rol, rol) values
(1, 'Asesor'),
(3, 'Coasesor'),
(3, 'Autor'),
(4, 'Coautor');

insert into modo values
(1, 'Proyecto Tecnologico'),
(2,	'Proyecto de investigación'),
(3,	'Estancia profesional'),
(4,	'Experiencia profesional');

insert into objetivos_particulares (objetivo, id_proyecto_investigacion) values
('Desarrollar software que use wavelets como funciones de activación en redes neuronales artificiales.', 1),
('Clasificar datos etiquetados en dos o tres clases utilizando redes neuronales con funciones de activación wavelet.', 1),
( 'Evaluar el efecto de las funciones wavelet usadas como funciones de activación en redes neuronales para clasificar datos en dos o tres clases.', 1),
('Implementar un sistema de adquisición de datos biomédicos utilizando biosensores de glucosa, presión arterial, ritmo cardíaco, temperatura corporal, actividad física e ingesta calórica; para establecer una caracterización del metabolismo específico.' , 2),
( 'Analizar, validar y procesar los datos biomédicos registrados mediante técnicas econométricas para formular un modelo matemático del metabolismo del paciente diabético.', 2),
('Desarrollar un método basado en reconocimiento de patrones para estimar el nivel calórico de los alimentos a partir de imágenes o grabaciones de voz en el teléfono.', 2),
('Desarrollar un modelo matemático lineal multi-variado y auto-regresivo del metabolismo del paciente diabético, en términos de las variables: glucosa en sangre, presión arterial sistó1ica, presión arterial diastó1ica, ritmo cardíaco, temperatura, actividad física, ingesta calórica, así como los parámetros específicos de cada paciente.', 2),
('Diseñar y construir un modelo de ontologías para representar perfiles de pacientes mexicanos que padezcan diabetes mellitus tipo 2; para que a través de estas ontologías se puedan representar características personales que inciden en el metabolismo; así como la incorporación de reglas de inferencia para realizar sugerencias y/o recomendaciones sobre el tratamiento personalizado del paciente.', 2),
( 'Diseñar y desplegar un conjunto de servicios Web para la generación y envío de alertas y recomendaciones a las aplicaciones móviles de los pacientes y de los médicos responsables.', 2);
 
  

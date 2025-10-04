create database sistemaproyectos;
use sistemaproyectos;

create table alumno(
idalumno int primary key, 
matricula text,
licenciatura_idlicenciatura text,
nombre text ,
apellido_paterno text,
apellido_materno text);

create table area(
idarea int primary key,
area varchar(45));

create table estado(
idestado int primary key,
descripcion varchar(45));

create table estado_proyecto(
idestado_proyecto int primary key,
estado varchar(45));

create table licenciatura(
idlicenciatura int primary key,
licenciatura text,
titulolicenciatura text);

create table profesor(
idprofesor int primary key,
numeco text,
contraseña text,
nombre text,
apellido_paterno text,
apellido_materno text,
telefono text,
correo text,
cubiculo text,
estado_idestado int
);

create table proyecto(
idproyecto int primary key,
titulo text,
modo text,
año text,
descripcion text,
objetivo_grl text,
numero_trimestres text,
trimestre_idtrimestre int,
area_idarea int,
estado_proyecto_idestado_proyecto int,
documento text
);

create table proyecto_investigacion(
idproyectoinv int primary key,
titulo text,
clave text, 
acuerdo text,
fecha_inicio text,
fecha_fin text,
pia text,
idprofesor int,
objetivos text
);

create table registro(
idregistro int,
profesor_idprofesor int,
alumno_idalumno int,
proyecto_idproyecto int,
rol_idrol int);

create table registro_investigacion(
idregistroinv int,
idprofesor int,
idproyectoinv int
);

create table rol(
iidrol int,
descripcion text);

create table trimestre(
idtrimestre int,
trimestre text
);
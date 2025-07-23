from conectBD import ConexionBD
import pandas as pd
import os

def inserta_bd(data:pd.DataFrame, atributos_tabla: list, nombre_tablaBD:str):
    '''
    Inserccion de un data Frame en una base de datos'''
    tabla = data[atributos_tabla].drop_duplicates()
    numero_params = ", ".join(["%s"] * len(tabla.columns))
    query = f"INSERT INTO  {nombre_tablaBD} VALUES ({numero_params})"

    bd = ConexionBD('localhost', 'root','root', 'sistema_proyectos')
    bd.connect()
    for fila in tabla.itertuples(index=False, name=None):
        bd.execute_query(query, fila)
    bd.close()


#Lectura de los archivos csv para comenzar a insertar en la nueva BD
ruta_carpeta = "bd/"
archivos = os.listdir(ruta_carpeta)
tablas = []
nombres_dfs = []
for a in archivos:
    tablas.append(pd.read_csv(f'{ruta_carpeta}{a}', sep=";", header=0))
    nombres_dfs.append(a[:-4])


def get_dataFrame(nombre_df:str):
    return tablas[nombres_dfs.index(nombre_df)].copy()

def actaulizar_ids(nombre_tabla:str):
    df_tabla = tablas[nombres_dfs.index(nombre_tabla)].copy()
    ids_antiguos = tuple(tablas[nombres_dfs.index(nombre_tabla)][f'id{nombre_tabla}'])
    ids_nuevos = tuple(i for i in range(1, len(ids_antiguos)+1))
    df_tabla[f'id{nombre_tabla}'] = ids_nuevos
    return df_tabla

#Actualizar los ids de alumnos en la tabla registro
df_alumnos = get_dataFrame('alumno')
nuevos_ids_alumnos = []
df_registro = get_dataFrame('registro')

for ida in df_registro['alumno_idalumno']:
    nuevos_ids_alumnos.append( df_alumnos[df_alumnos['idalumno'] == ida].index[0] + 1)

df_registro['alumno_idalumno'] = nuevos_ids_alumnos
df_alumnos = actaulizar_ids('alumno')

#Actualizar los ids de proyectos en la tabla registro
df_proyecto = get_dataFrame('proyecto')
nuevos_ids_proyecto = []
for idp in df_registro['proyecto_idproyecto']:
    nuevos_ids_proyecto.append( df_proyecto[df_proyecto['idproyecto'] == idp].index[0] + 1)
df_registro['proyecto_idproyecto'] = nuevos_ids_proyecto
df_proyecto = actaulizar_ids('proyecto')
df_registro
df_proyecto

query = 'INSERT INTO modo VALUES(%s, %s)'
params = (1, 'Proyecto tecnológico')
bd = ConexionBD('localhost', 'root', 'root', 'sistema_proyectos')
bd.connect()
bd.execute_query(query, params)
bd.close()

#Insertar datos de tabla estado
estados_df = get_dataFrame('estado')
inserta_bd(data=estados_df, atributos_tabla=list(estados_df.columns), nombre_tablaBD='estado')


#Insertar datos de tabla profesor
profesores_df = get_dataFrame('profesor')
profesores_df.drop('contraseña', axis=1)
profesores_df = profesores_df[['idprofesor', 'numeco', 'nombre', 'apellido_materno', 'apellido_paterno',
        'telefono', 'correo', 'cubiculo',
       'estado_idestado']]
inserta_bd(profesores_df, list(profesores_df.columns), 'profesor')


#Insertar datos de tabla licenciatura
df_licenciatura = get_dataFrame('licenciatura')
df_licenciatura = df_licenciatura[['idlicenciatura', 'licenciatura']]
inserta_bd(df_licenciatura, list(df_licenciatura.columns), 'licenciatura')

#Insertar datos de tabla trimestre
df_trimestre = get_dataFrame('trimestre')
inserta_bd(df_trimestre, list(df_trimestre.columns), 'trimestre')

#Insertar datos de tabla area
df_area = get_dataFrame('area')
inserta_bd(df_area, list(df_area.columns), 'area')

#Insertar datos de tabla estado_proyecto
df_estado_proyecto = get_dataFrame('estado_proyecto')
inserta_bd(df_estado_proyecto, list(df_estado_proyecto.columns), 'estado_proyecto')

#Inserccion de la tabla proyectps de integracion
df_proyecto['id_modo'] = 1
df_proyecto['path_codigo_fuente'] = ''
df_proyecto = df_proyecto[['idproyecto', 'titulo', 'año', 'descripcion', 'objetivo_grl', 'numero_trimestres', 'documento', 'path_codigo_fuente', 'trimestre_idtrimestre', 'area_idarea','id_modo', 'estado_proyecto_idestado_proyecto' ]]
inserta_bd(df_proyecto, list(df_proyecto.columns), 'proyecto_integracion')



bd = ConexionBD('localhost', 'root', 'root', 'sistema_proyectos')
bd.connect()
query = "insert into proyecto_integracion values(165, 'prueba', 1969, 'prueba', 'prueba', 2, 'prueba', 'prueba', 1,1,1,3)"
params = ()
bd.execute_query(query, params)
bd.close()

diccionario = {}

for i in range(len(df_registro)):
    diccionario[ df_registro.iloc[i]['alumno_idalumno'] ] = df_registro.iloc[i]['proyecto_idproyecto']

claves_proyectos_integracion_ordenAlumnos = []

for i in range(len(df_alumnos)):
    try:
        claves_proyectos_integracion_ordenAlumnos.append( diccionario[df_alumnos.iloc[i]['idalumno']] )
    except Exception as e:
        print('no se agrego')

claves_proyectos_integracion_ordenAlumnos.append(165)
claves_proyectos_integracion_ordenAlumnos.append(165)

df_alumnos['proyecto_integracion'] = claves_proyectos_integracion_ordenAlumnos
df_alumnos = df_alumnos[['idalumno', 'matricula',  'nombre', 'apellido_paterno', 'apellido_materno', 'licenciatura_idlicenciatura', 'proyecto_integracion']]
inserta_bd(df_alumnos, list(df_alumnos.columns), 'alumno')

#Inserccion de la tabla rol
df_roles = get_dataFrame('rol')
inserta_bd(df_roles, list(df_roles.columns), 'rol')

#Insercccion de la tabla profesor_alumno esta tabla describe el papel que juega cada profesro con cada alumno
df_registro_insertaBD = df_registro[['profesor_idprofesor', 'rol_idrol', 'alumno_idalumno']]
inserta_bd(df_registro, list(df_registro_insertaBD.columns), 'profesor_alumno')

#Llenado de la tabla proyecto_investigacion
df_proyecto_investigacion = get_dataFrame('proyecto_investigacion')
objetivos = df_proyecto_investigacion['objetivos']
objetivos = list(objetivos)

def get_objetivo_general(objetivos: str):
    inicio = len('OBJETIVO GENERAL:')
    return objetivos[inicio :objetivos.index('. OBJETIVOS ESPECÍFICOS')].strip()

objetivos_generales = []
for i in range(len(objetivos)):
    objetivos_generales.append(get_objetivo_general(objetivos[i]))

df_proyecto_investigacion['obejtivo_general'] = objetivos_generales
atributos = ['idproyectoinv', 'titulo', 'clave', 'acuerdo', 'fecha_inicio', 'fecha_fin', 'pia', 'obejtivo_general']
inserta_bd(df_proyecto_investigacion, atributos, 'proyecto_investigacion')

diccionario = {}
objetivos1 = ['Desarrollar software que use wavelets como funciones de activación en redes neuronales artificiales.', 'Clasificar datos etiquetados en dos o tres clases utilizando redes neuronales con funciones de activación wavelet.', 'Evaluar el efecto de las funciones wavelet usadas como funciones de activación en redes neuronales para clasificar datos en dos o tres clases.']
objetivos2 = ['Implementar un sistema de adquisición de datos biomédicos utilizando biosensores de glucosa, presión arterial, ritmo cardíaco, temperatura corporal, actividad física e ingesta calórica; para establecer una caracterización del metabolismo específico.', 'Analizar, validar y procesar los datos biomédicos registrados mediante técnicas econométricas para formular un modelo matemático del metabolismo del paciente diabético.', 'Desarrollar un método basado en reconocimiento de patrones para estimar el nivel calórico de los alimentos a partir de imágenes o grabaciones de voz en el teléfono.', 'Desarrollar un modelo matemático lineal multi-variado y auto-regresivo del metabolismo del paciente diabético, en términos de las variables: glucosa en sangre, presión arterial sistó1ica, presión arterial diastó1ica, ritmo cardíaco, temperatura, actividad física, ingesta calórica, así como los parámetros específicos de cada paciente.', 'Diseñar y construir un modelo de ontologías para representar perfiles de pacientes mexicanos que padezcan diabetes mellitus tipo 2; para que a través de estas ontologías se puedan representar características personales que inciden en el metabolismo; así como la incorporación de reglas de inferencia para realizar sugerencias y/o recomendaciones sobre el tratamiento personalizado del paciente.', 'Diseñar y desplegar un conjunto de servicios Web para la generación y envío de alertas y recomendaciones a las aplicaciones móviles de los pacientes y de los médicos responsables.']

todos_objetivos = objetivos1 + objetivos2
ids = [1] * len(objetivos1) + [2] * len(objetivos2)
df_objetivosParticualaresBD = pd.DataFrame({
    'id': ids,
    'Objetivo': todos_objetivos,
})


#inserta_bd(df_objetivosParticualaresBD, list(df_objetivosParticualaresBD.columns), 'objetivos_particulares')

print(len(todos_objetivos))
print(len(ids))
print(df_objetivosParticualaresBD)

df_profes_inv = get_dataFrame('registro_investigacion')
df_profes_inv['idrol'] = 1
atributos = ['idprofesor', 'idproyectoinv', 'idrol']
df_profes_inv = df_profes_inv[atributos]
inserta_bd(df_profes_inv, atributos, 'profesor_proyecto_investigacion')


#Llenado de la bd antigua
'''ruta_carpeta = "bd\\"
archivos = os.listdir(ruta_carpeta)
tablas = []
for a in archivos:
    tablas.append(pd.read_csv(f'{ruta_carpeta}{a}', sep=";"))

print(archivos[0][:-4])

for tabla, nombre_tabla in zip(tablas, archivos):
    inserta_bd(tabla, list(tabla.columns), nombre_tabla[:-4])'''
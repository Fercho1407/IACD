import pymysql

class ConexionBD:
    def __init__(self, host, user, psswd, db):
        self.host=host
        self.user = user
        self.psswd = psswd
        self.db = db
        self.connection = None
        self.cursor = None
    
    def connect(self):
        try:
            self.connection = pymysql.connect(host=self.host,
                                user=self.user,
                                passwd=self.psswd,
                                db=self.db)
            self.cursor = self.connection.cursor()
            print("Conectado a la base de datos...")
        except pymysql.MySQLError as e:
            print(f"Error al conectar a la base de datos {e}")

    def execute_query(self, query, params):
        if self.connection:
            try:
                self.cursor.execute(query, params)
                self.connection.commit()
                print("consulta ejecutada")
                return self.cursor.fetchall()
            except pymysql.MySQLError as e:
                print(f"error al ejecutar la consulta: {e}")
                return False
        else:
            print("Primero debes conectar a la base de datos")

    def close(self):
        if self.connection:
            self.cursor.close()
            self.connection.close()
            print("Conexion cerrada")
        else:
            print("No hay ninguna base de datos conectada")
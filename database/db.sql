DROP DATABASE IF EXISTS system_pos_db;
CREATE DATABASE system_pos_db;
USE system_pos_db;
-- Crear tabla para los usuarios del sistema
CREATE TABLE USERS (
    id INT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Tablas

CREATE TABLE ESTADOS(
    nombre VARCHAR(50) PRIMARY KEY
);

CREATE TABLE TIPO_DE_TRABAJOS(
    nombre VARCHAR(50) PRIMARY KEY
);

CREATE TABLE CLIENTES(
    cedula VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    correo VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT,
    ciudad VARCHAR(50)
);

CREATE TABLE SALAS(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio_corte_madera INT NOT NULL,
    precio_corte_tela INT NOT NULL,
    precio_costura INT NOT NULL,
    precio_tapicero INT NOT NULL,
    precio_armado INT NOT NULL,
    precio_venta INT NOT NULL,
    ruta_imagen VARCHAR(260)
);

CREATE TABLE PEDIDOS(
    id INT AUTO_INCREMENT PRIMARY KEY,
    detalle TEXT,
    cliente VARCHAR(20) NOT NULL,
    fecha_realizacion DATE NOT NULL,
    fecha_entrega DATE NOT NULL,
    direccion TEXT NOT NULL,
    estado VARCHAR(50) NOT NULL,
    FOREIGN KEY (cliente) REFERENCES CLIENTES(cedula),
    FOREIGN KEY (estado) REFERENCES ESTADOS(nombre)
);

CREATE TABLE DETALLE_PEDIDO(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_sala INT NOT NULL,
    cantidad INT NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES PEDIDOS(id),
    FOREIGN KEY (id_sala) REFERENCES SALAS(id),
    FOREIGN KEY (estado) REFERENCES ESTADOS(nombre)
);

CREATE TABLE TRABAJADORES(
    cedula VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    correo VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT,
    FOREIGN KEY (rol) REFERENCES TIPO_DE_TRABAJOS(nombre)
);

CREATE TABLE FICHA(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_detalle_pedido INT,
    id_trabajador VARCHAR(20) NOT NULL,
    estado VARCHAR(50),
    fecha_asignacion DATE NOT NULL,
    fecha_completada DATE,
    FOREIGN KEY (id_detalle_pedido) REFERENCES DETALLE_PEDIDO(id),
    FOREIGN KEY (id_trabajador) REFERENCES TRABAJADORES(cedula),
    FOREIGN KEY (estado) REFERENCES ESTADOS(nombre)
);

CREATE TABLE TARIFAS(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_tipo_trabajador INT NOT NULL,
    id_sala INT NOT NULL,
    costo INT,
    FOREIGN KEY (id_tipo_trabajador) REFERENCES TIPO_DE_TRABAJOS(id),
    FOREIGN KEY (id_sala) REFERENCES SALAS(id)
);

CREATE TABLE PAGOS(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_trabajador VARCHAR(20) NOT NULL,
    monto INT,
    fecha_pago DATE,
    FOREIGN KEY (id_trabajador) REFERENCES TRABAJADORES(cedula)
);

CREATE TABLE CONCEPTOS(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    valor INT
);

CREATE TABLE  CONCEPTOS_PAGO(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pago INT NOT NULL,
    id_concepto INT NOT NULL,
    FOREIGN KEY (id_pago) REFERENCES PAGOS(id),
    FOREIGN KEY (id_concepto) REFERENCES CONCEPTOS(id)
);
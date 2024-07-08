DROP DATABASE IF EXISTS system_pos_db;
CREATE DATABASE system_pos_db;
USE system_pos_db;
-- Crear tabla para los usuarios del sistema
CREATE TABLE USERS (
	id VARCHAR(20) PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Crear tabla para los tipos de trabajos
CREATE TABLE WORK_TYPES (type VARCHAR(50) PRIMARY KEY);
-- Crear tabla para los productos (salas)
CREATE TABLE PRODUCTS (
	name VARCHAR(100) PRIMARY KEY,
	sales_price INT NOT NULL,
	image_route VARCHAR(255),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Crear tabla para las tarifas de los productos
CREATE TABLE RATES (
	work_type_id VARCHAR(50) NOT NULL,
	product_id VARCHAR(100) NOT NULL,
	cost INT NOT NULL,
	PRIMARY KEY (work_type_id, product_id),
	FOREIGN KEY (work_type_id) REFERENCES WORK_TYPES (type) ON DELETE CASCADE,
	FOREIGN KEY (product_id) REFERENCES PRODUCTS (name) ON DELETE CASCADE
);
DELIMITER //
CREATE TRIGGER insert_rates AFTER INSERT ON PRODUCTS
FOR EACH ROW
BEGIN
	DECLARE work_type_id VARCHAR(50);
    DECLARE flag BOOLEAN DEFAULT false;
	-- Cursor para recorrer todos los tipos de trabajo
	DECLARE work_types_cursor CURSOR FOR SELECT type FROM WORK_TYPES;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET flag = true;
    -- Abrir el cursor
    OPEN work_types_cursor;
    -- Bucle para recorrer todos los tipos de trabajo e insertar tarifas
    fetch_loop: LOOP
        FETCH work_types_cursor INTO work_type_id;
        -- Salir del bucle si no hay más filas
        IF flag THEN
            LEAVE fetch_loop;
        END IF;
        -- Insertar tarifa para el tipo de trabajo y producto
        INSERT INTO RATES (work_type_id, product_id, cost)
        VALUES (work_type_id, NEW.name, 0);
    END LOOP fetch_loop;
    -- Cerrar el cursor
    CLOSE work_types_cursor;
END;
//
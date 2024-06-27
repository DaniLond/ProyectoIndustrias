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

CREATE TABLE STATES(
    state_name VARCHAR(50) PRIMARY KEY
);

CREATE TABLE TYPE_OF_WORK(
    type_name VARCHAR(50) PRIMARY KEY
);

CREATE TABLE CLIENTS(
    id VARCHAR(20) PRIMARY KEY,
    client_name VARCHAR(80) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50)
);

CREATE TABLE PRODUCTS(
    id INT AUTO_INCREMENT PRIMARY KEY,
    products_name VARCHAR(100) NOT NULL,
    wood_cut_price INT NOT NULL,
    fabric_cut_price INT NOT NULL,
    sewing_price INT NOT NULL,
    price_upholsterer INT NOT NULL,
    assembled_price INT NOT NULL,
    sales_price INT NOT NULL,
    image_route VARCHAR(260)
);

CREATE TABLE ORDERS(
    id INT AUTO_INCREMENT PRIMARY KEY,
    detail TEXT,
    client VARCHAR(20) NOT NULL,
    date_realization DATE NOT NULL,
    delivery_date DATE NOT NULL,
    address TEXT NOT NULL,
    id_state VARCHAR(50) NOT NULL,
    FOREIGN KEY (client) REFERENCES CLIENTS(id),
    FOREIGN KEY (id_state) REFERENCES STATES(state_name)
);

CREATE TABLE ORDER_DETAIL(
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    products_id INT NOT NULL,
    quantity INT NOT NULL,
    description TEXT,
    state_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES ORDERS(id),
    FOREIGN KEY (products_id) REFERENCES PRODUCTS(id),
    FOREIGN KEY (state_id) REFERENCES STATES(state_name)
);

CREATE TABLE EMPLOYEES(
    id VARCHAR(20) PRIMARY KEY,
    employee_id VARCHAR(80) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    FOREIGN KEY (role) REFERENCES TYPE_OF_WORK(type_name)
);

CREATE TABLE CARD(
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_detail_id INT,
    employee_id VARCHAR(20) NOT NULL,
    state VARCHAR(50),
    date_assignment DATE NOT NULL,
    date_completed DATE,
    FOREIGN KEY (order_detail_id) REFERENCES ORDER_DETAIL(id),
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEES(id),
    FOREIGN KEY (state) REFERENCES STATES(state_name)
);

CREATE TABLE FARE(
    id INT AUTO_INCREMENT PRIMARY KEY,
    worker_type_id INT NOT NULL,
    products_id INT NOT NULL,
    cost INT,
    FOREIGN KEY (worker_type_id) REFERENCES TYPE_OF_WORK(type_name),
    FOREIGN KEY (products_id) REFERENCES PRODUCTS(id)
);

CREATE TABLE PAYMENTS(
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    amount INT,
    date_paid DATE,
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEES(id)
);

CREATE TABLE CONCEPTS(
    id INT AUTO_INCREMENT PRIMARY KEY,
    concept_name VARCHAR(100) NOT NULL,
    value INT
);

CREATE TABLE  PAYMENT_CONCEPTS(
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id INT NOT NULL,
    concept_id INT NOT NULL,
    FOREIGN KEY (payment_id) REFERENCES PAYMENTS(id),
    FOREIGN KEY (concept_id) REFERENCES CONCEPTS(id)
);


-- USERS
INSERT INTO USERS (id, username, password, email) VALUES
(1006 'admin', 'admin123', 'admin@gmail.com'),
(1007, 'client', 'client123', 'client@gmal.com');

-- STATES
INSERT INTO STATES (state_name) VALUES
('Pendiente'), ('En Progreso'), ('Completado'), ('Cancelado'),('Corte tela'),('Costura'),('Corte madera'),('Armado'),('Tapicería');

-- TYPE_OF_WORK
INSERT INTO TYPE_OF_WORK (type_name) VALUES
('Corte de Madera'), ('Corte de Tela'), ('Costura'), ('Tapicería'), ('Armado');


-- CLIENTS
INSERT INTO CLIENTS (id, client_name, email, phone, address, city) VALUES
('1001', 'Juan Pérez', 'juan@email.com', '3014836689', 'Calle 45 # 25 - 38', 'Palmira'),
('1002', 'María García', 'maria@email.com', '3008506234', 'Calle 50 # 30 - 38', 'Cali'),
('1003', 'Isabel Castillo', 'isabel@email.com', '3008502224', 'Carrera 34 # 30 - 08', 'Cali'),
('1004', 'Esteban Morales', 'esteban@email.com', '3008506234', 'Calle 30 # 01 - 18', 'Bogota'),
('1005', 'Valentina Lopez', 'valen@email.com', '3050206234', 'Calle 50 # 12 - 08', 'Palmira');

-- PRODUCTS
INSERT INTO PRODUCTS (products_name, wood_cut_price, fabric_cut_price, sewing_price, price_upholsterer, assembled_price, sales_price, image_route) VALUES
('Sofá Cama', 102000, 6500, 20000, 52000, 83000, 520000, ''),
('Sala Mavery', 98000, 4500, 35000, 80000, 95000, 1100000, ''),
('Sala Napoles', 75000, 6500, 30000, 75000, 82000, 950000, ''),
('Silla de Comedor', 50000, 2500, 2500, 15000, 45000, 120000, ''),
('Sala Mariposa', 100000, 6000, 25000, 65000, 90000, 1000000, '');

-- ORDERS
INSERT INTO ORDERS (detail, client, date_realization, delivery_date, address, id_state) VALUES
('Se debe entregar antes de las 2', '1001', '2024-08-01', '2024-08-15', 'Calle 45 # 25 - 38', 'Pediente'),
('', '1002', '2024-08-02', '2024-08-20', 'Carrera 25 # 18 - 45', 'Pendiente'),
('', '1001', '2024-08-03', '2024-08-18', 'Calle 45 # 25 - 38', 'Pendiente'),
('Es en un tercer piso', '1004', '2024-08-04', '2024-08-25', 'Calle 50 # 03 - 25', 'Pendiente'),
('', '1005', '2024-09-05', '2024-09-15', 'Calle 50 # 12 - 08', 'Pendiente');


-- ORDER_DETAIL
INSERT INTO ORDER_DETAIL (order_id, products_id, quantity, description, state_id) VALUES
(1, 1, 1, 'Sofá cama color azul', 'Pendiente'),
(2, 2, 2, 'Una Sala Mavery color beige y la otra negra', 'Pendiente'),
(3, 3, 1, 'Sala Napoles de color beige', 'Pendiente'),
(4, 4, 4, 'Sillas de Comedor tapizadas en gris', 'Pendiente'),
(5, 5, 1, 'Sala mariposa toda negra', 'Pendiente'),
(1, 2, 1, 'Una Sala Mavery color beige', 'Pendiente'),
(2, 5, 2, 'Una Sala Mariposa color beige y la otra negra', 'Pendiente');

-- EMPLOYEES
INSERT INTO EMPLOYEES (id, employee_id, role, email, phone, address) VALUES
('2001', 'Carlos Rodríguez', 'Corte de Madera', 'carlos@email.com', '3008053098', 'Carrera 26 # 48 - 50'),
('2002', 'Ana Martínez', 'Costura', 'ana@email.com', '3008053011', 'Carrera 50 # 08 - 50'),
('2003', 'Pedro Sánchez', 'Tapicería', 'pedro@email.com', '3022053098', 'Carrera 35 # 40 - 10'),
('2004', 'Laura Torres', 'Corte de Tela', 'laura@email.com', '3005054018', 'Carrera 50 # 35 - 58'),
('2005', 'Jorge Mendez', 'Armado', 'jorge@email.com', '3018053333', 'Calle 30 # 08 - 50');


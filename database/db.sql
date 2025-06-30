DROP DATABASE IF EXISTS system_pos_db;
CREATE DATABASE system_pos_db;
USE system_pos_db;

-- ========================================
-- TABLAS PRINCIPALES
-- ========================================

-- Tabla para los usuarios del sistema
CREATE TABLE USERS (
    id VARCHAR(20) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para los tipos de trabajos
CREATE TABLE WORK_TYPES (
    type VARCHAR(50) PRIMARY KEY
);

-- Tabla para los productos (salas)
CREATE TABLE PRODUCTS (
    name VARCHAR(100) PRIMARY KEY,
    sales_price INT NOT NULL,
    image_route VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para las tarifas de los productos
CREATE TABLE RATES (
    work_type_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    cost INT NOT NULL,
    PRIMARY KEY (work_type_id, product_id),
    FOREIGN KEY (work_type_id) REFERENCES WORK_TYPES (type) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES PRODUCTS (name) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Tabla para los empleados
CREATE TABLE EMPLOYEES (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    FOREIGN KEY (role) REFERENCES WORK_TYPES(type)
);

-- Tabla para los clientes
CREATE TABLE CLIENTS (
    id VARCHAR(20) PRIMARY KEY,
    client_name VARCHAR(80) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50)
);

-- Tabla para los estados
CREATE TABLE STATES (
    state_name VARCHAR(50) PRIMARY KEY
);

-- Tabla para las órdenes
CREATE TABLE ORDERS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    detail TEXT,
    client VARCHAR(20) NOT NULL,
    date_realization DATE NOT NULL DEFAULT (CURDATE()),
    delivery_date DATE NOT NULL,
    address TEXT NOT NULL,
    id_state VARCHAR(50) NOT NULL,
    FOREIGN KEY (client) REFERENCES CLIENTS(id),
    FOREIGN KEY (id_state) REFERENCES STATES(state_name)
);

-- Tabla para los detalles de órdenes
CREATE TABLE ORDER_DETAIL (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product VARCHAR(100) NOT NULL,
    description TEXT,
    state VARCHAR(50) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES ORDERS(id),
    FOREIGN KEY (product) REFERENCES PRODUCTS(name),
    FOREIGN KEY (state) REFERENCES STATES(state_name)
);

-- Tabla temporal para almacenar los productos del pedido
CREATE TABLE TEMP_ORDER_PRODUCTS (
    temp_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100),
    detail TEXT
);

-- Tabla para las tarjetas de trabajo
CREATE TABLE CARD (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_detail_id INT NOT NULL,
    work_type VARCHAR(50) NOT NULL,
    employee_id VARCHAR(20),
    state VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
    date_assigned DATE,
    date_completed DATE,
    FOREIGN KEY (order_detail_id) REFERENCES ORDER_DETAIL(id),
    FOREIGN KEY (work_type) REFERENCES WORK_TYPES(type),
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEES(id),
    FOREIGN KEY (state) REFERENCES STATES(state_name)
);

-- Tabla para los pagos
CREATE TABLE PAYMENTS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    amount INT,
    date_paid DATE,
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEES(id)
);

-- Tabla para los conceptos de pago
CREATE TABLE CONCEPTS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    concept_name VARCHAR(100) NOT NULL,
    value INT
);

-- Tabla para relacionar pagos con conceptos
CREATE TABLE PAYMENT_CONCEPTS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id INT NOT NULL,
    concept_id INT NOT NULL,
    FOREIGN KEY (payment_id) REFERENCES PAYMENTS(id),
    FOREIGN KEY (concept_id) REFERENCES CONCEPTS(id)
);

-- Tabla para las dependencias de trabajo
CREATE TABLE WORK_DEPENDENCIES (
    work_type VARCHAR(50) NOT NULL,
    depends_on VARCHAR(50) NOT NULL,
    PRIMARY KEY (work_type, depends_on),
    FOREIGN KEY (work_type) REFERENCES WORK_TYPES(type),
    FOREIGN KEY (depends_on) REFERENCES WORK_TYPES(type)
);

-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger para insertar tarifas automáticamente cuando se crea un producto
DELIMITER //
CREATE TRIGGER insert_rates
AFTER INSERT ON PRODUCTS
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

-- Trigger para insertar orden
CREATE TRIGGER insert_order
AFTER INSERT ON ORDERS
FOR EACH ROW
BEGIN
    DECLARE finished INTEGER DEFAULT 0;
    DECLARE temp_product_name VARCHAR(100);
    DECLARE temp_detail TEXT;
    DECLARE temp_cursor CURSOR FOR
        SELECT product_name, detail FROM TEMP_ORDER_PRODUCTS;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;

    OPEN temp_cursor;

    get_product: LOOP
        FETCH temp_cursor INTO temp_product_name, temp_detail;
        IF finished THEN
            LEAVE get_product;
        END IF;
        
        INSERT INTO ORDER_DETAIL (order_id, product, description, state)
        VALUES (NEW.id, temp_product_name, temp_detail, 'Pendiente');
    END LOOP get_product;

    CLOSE temp_cursor;

    DELETE FROM TEMP_ORDER_PRODUCTS;
END;
//

-- Trigger para crear tarjetas de trabajo
CREATE TRIGGER create_cards
AFTER INSERT ON ORDER_DETAIL
FOR EACH ROW
BEGIN
    INSERT INTO CARD (order_detail_id, work_type, state)
    SELECT NEW.id, type, 'Pendiente'
    FROM WORK_TYPES
    WHERE type IN ('Corte de Tela', 'Corte de Madera', 'Costura', 'Tapiceria', 'Ensamblado');
END;
//

-- Trigger para actualizar estado al asignar empleado
CREATE TRIGGER update_order_state_on_assignment
AFTER UPDATE ON CARD
FOR EACH ROW
BEGIN
    IF OLD.employee_id IS NULL AND NEW.employee_id IS NOT NULL THEN
        
        UPDATE ORDER_DETAIL
        SET state = 'En progreso'
        WHERE id = NEW.order_detail_id 
        AND state = 'Pendiente';

        UPDATE ORDERS
        SET id_state = 'En progreso'
        WHERE id = (
            SELECT od.order_id
            FROM ORDER_DETAIL od
            WHERE od.id = NEW.order_detail_id
        ) AND id_state = 'Pendiente';
        
    END IF;
END;
//

-- Trigger para actualizar estados al completar tareas
CREATE TRIGGER update_states_on_task_completion
AFTER UPDATE ON CARD
FOR EACH ROW
BEGIN
    DECLARE order_detail_id_var INT;
    DECLARE order_id_var INT;
    DECLARE pending_cards_for_detail INT DEFAULT 0;
    DECLARE pending_details_for_order INT DEFAULT 0;
    
    IF NEW.state = 'Completado' AND OLD.state != 'Completado' THEN

        SET order_detail_id_var = NEW.order_detail_id;

        SELECT od.order_id INTO order_id_var
        FROM ORDER_DETAIL od
        WHERE od.id = order_detail_id_var;

        SELECT COUNT(*) INTO pending_cards_for_detail
        FROM CARD c
        WHERE c.order_detail_id = order_detail_id_var
        AND c.state != 'Completado';

        IF pending_cards_for_detail = 0 THEN
            UPDATE ORDER_DETAIL
            SET state = 'Completado'
            WHERE id = order_detail_id_var;

            SELECT COUNT(*) INTO pending_details_for_order
            FROM ORDER_DETAIL od
            WHERE od.order_id = order_id_var
            AND od.state != 'Completado';

            IF pending_details_for_order = 0 THEN
                UPDATE ORDERS
                SET id_state = 'Completado'
                WHERE id = order_id_var;
            END IF;
        END IF;
    END IF;
END;
//

DELIMITER ;

-- ========================================
-- PROCEDIMIENTOS ALMACENADOS
-- ========================================

-- Procedimiento para agregar productos temporales
DELIMITER //
CREATE PROCEDURE add_temp_product(IN p_product_name VARCHAR(100), IN p_detail TEXT)
BEGIN
    INSERT INTO TEMP_ORDER_PRODUCTS (product_name, detail)
    VALUES (p_product_name, p_detail);
END;
//

-- Procedimiento para obtener tareas disponibles por tipo de trabajo
CREATE PROCEDURE GetAvailableTasksByWorkTypeOptimized(IN work_type_param VARCHAR(50))
BEGIN
    SELECT 
        c.id,
        c.order_detail_id,
        od.product,
        od.description as order_detail_description,
        o.id as order_id,
        o.delivery_date,
        o.date_realization,
        o.detail as order_detail,
        cl.client_name,
        cl.phone,
        cl.address as client_address
    FROM CARD c
    JOIN ORDER_DETAIL od ON c.order_detail_id = od.id
    JOIN ORDERS o ON od.order_id = o.id
    JOIN CLIENTS cl ON o.client = cl.id
    WHERE 
        c.work_type = work_type_param 
        AND c.state = 'Pendiente' 
        AND c.employee_id IS NULL
        AND (
            NOT EXISTS (
                SELECT 1 FROM WORK_DEPENDENCIES wd 
                WHERE wd.work_type = work_type_param
            )
            OR
            NOT EXISTS (
                SELECT 1 
                FROM WORK_DEPENDENCIES wd
                JOIN CARD c_dep ON c_dep.order_detail_id = c.order_detail_id 
                    AND c_dep.work_type = wd.depends_on
                WHERE wd.work_type = work_type_param 
                    AND c_dep.state != 'Completado'
            )
        )
    ORDER BY o.date_realization DESC, o.id DESC;
END //

DELIMITER ;

-- ========================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ========================================

CREATE INDEX idx_card_work_type_state ON CARD(work_type, state, employee_id);
CREATE INDEX idx_card_detail_state ON CARD(order_detail_id, work_type, state);
CREATE INDEX idx_work_dependencies ON WORK_DEPENDENCIES(work_type, depends_on);

-- ========================================
-- DATOS INICIALES
-- ========================================

-- USUARIOS
INSERT INTO USERS (id, username, password, email)
VALUES (
        '12345',
        'admin',
        '$2a$10$fW.n0oZiX7CCXuYAs2y8HexYepdsfdMoQTQujFnldmzHr7i3VI9L.',
        'admin@gmail.com'
    );

-- ESTADOS
INSERT INTO STATES (state_name) VALUES
('Pendiente'), ('En progreso'), ('Completado'), ('Cancelado');

-- TIPOS DE TRABAJO
INSERT INTO WORK_TYPES (type) VALUES
('Corte de Madera'), ('Corte de Tela'), ('Costura'), ('Tapiceria'), ('Ensamblado');

-- DEPENDENCIAS DE TRABAJO
INSERT INTO WORK_DEPENDENCIES (work_type, depends_on) VALUES
('Costura', 'Corte de Tela'),
('Ensamblado', 'Corte de Madera'),
('Tapiceria', 'Costura'),
('Tapiceria', 'Ensamblado');

-- CLIENTES
INSERT INTO CLIENTS (id, client_name, email, phone, address, city) VALUES
('1001', 'Juan Pérez', 'juan@email.com', '3014836689', 'Calle 45 # 25 - 38', 'Palmira'),
('1002', 'María García', 'maria@email.com', '3008506234', 'Calle 50 # 30 - 38', 'Cali'),
('1003', 'Isabel Castillo', 'isabel@email.com', '3008502224', 'Carrera 34 # 30 - 08', 'Cali'),
('1004', 'Esteban Morales', 'esteban@email.com', '3008506234', 'Calle 30 # 01 - 18', 'Bogotá'),
('1005', 'Valentina López', 'valen@email.com', '3050206234', 'Calle 50 # 12 - 08', 'Palmira');

-- PRODUCTOS
INSERT INTO PRODUCTS (name, sales_price, image_route) VALUES
('Sofá Cama', 520000, ''),
('Sala Mavery', 1100000, ''),
('Sala Nápoles', 950000, ''),
('Silla de Comedor', 120000, ''),
('Sala Mariposa', 1000000, '');

-- Actualizar las tarifas de los productos según los tipos de trabajo
-- Sofá Cama
UPDATE RATES
SET cost = CASE
        WHEN work_type_id = 'Corte de Madera' THEN 102000
        WHEN work_type_id = 'Corte de Tela' THEN 6500
        WHEN work_type_id = 'Costura' THEN 20000
        WHEN work_type_id = 'Tapiceria' THEN 52000
        WHEN work_type_id = 'Ensamblado' THEN 83000
        ELSE cost
    END
WHERE product_id = 'Sofá Cama';
-- Sala Mavery
UPDATE RATES
SET cost = CASE
        WHEN work_type_id = 'Corte de Madera' THEN 98000
        WHEN work_type_id = 'Corte de Tela' THEN 4500
        WHEN work_type_id = 'Costura' THEN 35000
        WHEN work_type_id = 'Tapiceria' THEN 80000
        WHEN work_type_id = 'Ensamblado' THEN 95000
        ELSE cost
    END
WHERE product_id = 'Sala Mavery';
-- Sala Napoles
UPDATE RATES
SET cost = CASE
        WHEN work_type_id = 'Corte de Madera' THEN 75000
        WHEN work_type_id = 'Corte de Tela' THEN 6500
        WHEN work_type_id = 'Costura' THEN 30000
        WHEN work_type_id = 'Tapiceria' THEN 75000
        WHEN work_type_id = 'Ensamblado' THEN 82000
        ELSE cost
    END
WHERE product_id = 'Sala Napoles';
-- Silla de Comedor
UPDATE RATES
SET cost = CASE
        WHEN work_type_id = 'Corte de Madera' THEN 50000
        WHEN work_type_id = 'Corte de Tela' THEN 2500
        WHEN work_type_id = 'Costura' THEN 2500
        WHEN work_type_id = 'Tapiceria' THEN 15000
        WHEN work_type_id = 'Ensamblado' THEN 45000
        ELSE cost
    END
WHERE product_id = 'Silla de Comedor';
-- Sala Mariposa
UPDATE RATES
SET cost = CASE
        WHEN work_type_id = 'Corte de Madera' THEN 100000
        WHEN work_type_id = 'Corte de Tela' THEN 6000
        WHEN work_type_id = 'Costura' THEN 25000
        WHEN work_type_id = 'Tapiceria' THEN 65000
        WHEN work_type_id = 'Ensamblado' THEN 90000
        ELSE cost
    END
WHERE product_id = 'Sala Mariposa';

-- EMPLEADOS
INSERT INTO EMPLOYEES (id, name, role, email, phone, address) VALUES
('2001', 'Carlos Rodríguez', 'Corte de Madera', 'carlos@email.com', '3008053098', 'Carrera 26 # 48 - 50'),
('2002', 'Ana Martínez', 'Costura', 'ana@email.com', '3008053011', 'Carrera 50 # 08 - 50'),
('2003', 'Pedro Sánchez', 'Tapiceria', 'pedro@email.com', '3022053098', 'Carrera 35 # 40 - 10'),
('2004', 'Laura Torres', 'Corte de Tela', 'laura@email.com', '3005054018', 'Carrera 50 # 35 - 58'),
('2005', 'Jorge Méndez', 'Ensamblado', 'jorge@email.com', '3018053333', 'Calle 30 # 08 - 50');

-- CONCEPTOS DE PAGO
INSERT INTO CONCEPTS (concept_name, value) VALUES
('Pago por tarea completada', 0),
('Bono por productividad', 0),
('Descuento por tardanza', 0);
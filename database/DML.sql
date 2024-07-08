-- Inserción de datos en la tabla USERS
INSERT INTO USERS (id, username, password, email)
VALUES (
        '12345',
        'admin',
        '$2a$10$fW.n0oZiX7CCXuYAs2y8HexYepdsfdMoQTQujFnldmzHr7i3VI9L.',
        'admin@gmail.com'
    );
-- Inserción de datos en la tabla WORK_TYPES
INSERT INTO WORK_TYPES (type)
VALUES ('Corte de Madera');
INSERT INTO WORK_TYPES (type)
VALUES('Corte de Tela');
INSERT INTO WORK_TYPES (type)
VALUES('Costura');
INSERT INTO WORK_TYPES (type)
VALUES('Tapiceria');
INSERT INTO WORK_TYPES (type)
VALUES('Ensamblado');
-- Inserción de datos en la tabla PRODUCTS
INSERT INTO PRODUCTS (name, sales_price, image_route)
VALUES ('Sofá Cama', 520000, '');
INSERT INTO PRODUCTS (name, sales_price, image_route)
VALUES ('Sala Mavery', 1100000, '');
INSERT INTO PRODUCTS (name, sales_price, image_route)
VALUES ('Sala Napoles', 950000, '');
INSERT INTO PRODUCTS (name, sales_price, image_route)
VALUES ('Silla de Comedor', 120000, '');
INSERT INTO PRODUCTS (name, sales_price, image_route)
VALUES ('Sala Mariposa', 1000000, '');
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
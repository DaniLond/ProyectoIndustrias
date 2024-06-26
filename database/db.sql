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
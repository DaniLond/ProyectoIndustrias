import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env (Si existe)
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
export const TOKEN_SECRET =
	process.env.TOKEN_SECRET || 'a806P3dD1F4HIdik8FsuCr4wtIfFMko4eVYAp9tCDwWF4v6ijy5GfHrs6ci35aQx';
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '8h';
export const ACCEPTED_ORIGINS = process.env.ACCEPTED_ORIGINS
	? process.env.ACCEPTED_ORIGINS.split(',')
	: ['http://localhost:4000', 'http://localhost:5173'];
export const EMAIL_USER = process.env.EMAIL_USER || 'juandavidcoloniaaldana@gmail.com';
export const EMAIL_PASS = process.env.EMAIL_PASS || 'wgbl jdtp sniu cmrd';
export const RESET_PASSWORD_TOKEN_EXPIRATION = process.env.RESET_PASSWORD_TOKEN_EXPIRATION || '10m';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
export const DEFAULT_CONFIG = {
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'industrias-londoño',
	port: parseInt(process.env.DB_PORT) || 3306,
	password: process.env.DB_PASSWORD || '12345',
	database: process.env.DB_NAME || 'system_pos_db',
};

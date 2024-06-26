import mysql from 'mysql2/promise';
import { DEFAULT_CONFIG } from './config.js';

export const connectDB = async () => {
	try {
		const connection = await mysql.createConnection(DEFAULT_CONFIG);
		console.log('Conexión exitosa a la base de datos MySQL');
		return connection; // Retorna la conexión para poder usarla en otros lugares
	} catch (error) {
		console.error('Error conectándose a la base de datos:', error);
	}
};

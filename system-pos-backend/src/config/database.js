import mysql from 'mysql2/promise';
import { DEFAULT_CONFIG } from '../config.js';

// Configuración del pool de conexiones
const pool = mysql.createPool({
	...DEFAULT_CONFIG,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

export const connectDB = async () => {
	try {
		const connection = await pool.getConnection();
		console.log('Conexión exitosa a la base de datos MySQL');
		return connection; // Retorna la conexión para poder usarla en otros lugares
	} catch (error) {
		console.error('Error conectándose a la base de datos:', error);
		throw error; // Lanza el error para que pueda ser manejado en el lugar donde se llama a connectDB
	}
};

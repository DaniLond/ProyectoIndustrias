export default class Client {
	static async findAll(connection) {
		const [rows] = await connection.query('SELECT * FROM CLIENT;');
		return rows;
	}

	static async findById(connection, id) {
		const [rows] = await connection.query('SELECT * FROM CLIENT WHERE id = ?;', [id]);
		return rows[0];
	}

	static async create(connection, client) {
		const { id, client_name, email, phone, address, city } = client;
		await connection.query(
			'INSERT INTO CLIENTS (id, client_name, email, phone, address, city ) VALUES (?, ?, ?, ?, ?, ?);',
			[id, client_name, email, phone, address, city],
		);
	}

	static async update(connection, client) {
		const { id, client_name, email, phone, address, city } = client;

		await connection.query(
			'UPDATE CLIENTS SET client_name = ?, email = ?, phone = ?, address = ?, city = ? WHERE id = ?;',
			[client_name, email, phone, address, city, id],
		);
	}

	static async delete(connection, id) {
		await connection.query('DELETE FROM CLIENTS WHERE id = ?;', [id]);
	}
}

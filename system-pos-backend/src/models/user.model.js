export default class User {
	static async findById(connection, id) {
		const [rows] = await connection.query('SELECT * FROM USERS WHERE id = ?;', [id]);
		return rows[0];
	}

	static async create(connection, user) {
		const { id, username, password, email } = user;
		await connection.query('INSERT INTO USERS (id, username, password, email) VALUES (?, ?, ?, ?);', [
			id,
			username,
			password,
			email,
		]);
	}

	static async resetPassword(connection, newPassword, id) {
		await connection.query('UPDATE USERS SET password = ? WHERE id = ?;', [newPassword, id]);
	}
}

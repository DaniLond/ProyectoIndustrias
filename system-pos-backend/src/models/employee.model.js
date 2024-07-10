export default class Employee{

    static async findAll(connection) {
		const [rows] = await connection.query('SELECT * FROM EMPLOYEES;');
		return rows;
	}

    static async findById(connection, id) {
		const [rows] = await connection.query('SELECT * FROM EMPLOYEES WHERE id = ?;', [id]);
		return rows[0];
	}

	static async getAllRoles(connection) {
        const [rows] = await connection.query('SELECT type_name FROM WORK_TYPES;');
        return rows.map(row => row.type_name);
    }

    static async create(connection, employee) {
		const { id, name, role, email, phone, address } = employee;
		await connection.query(
			'INSERT INTO EMPLOYEES (id, name, role, email, phone, address ) VALUES (?, ?, ?, ?, ?, ?);',
			[id, name, role, email, phone, address],
		);
	}

    static async update(connection, employee) {
		const { id, name, role, email, phone, address } = employee;

		await connection.query(
			'UPDATE EMPLOYEES SET name = ?, role = ?, email = ?, phone = ?, address = ? WHERE id = ?;',
			[name, role, email, phone, address, id],
		);
	}

    static async delete(connection, id) {
		await connection.query('DELETE FROM EMPLOYEES WHERE id = ?;', [id]);
	}
}
export default class Product {
	static async findAll(connection) {
		const [rows] = await connection.query('SELECT * FROM PRODUCTS;');
		return rows;
	}

	static async findById(connection, name) {
		const [rows] = await connection.query('SELECT * FROM PRODUCTS WHERE name = ?;', [name]);
		return rows[0];
	}

	static async create(connection, product) {
		const {
			name,
			wood_cut_price,
			fabric_cut_price,
			sewing_price,
			upholsterer_price,
			assembled_price,
			sales_price,
			image_route,
		} = product;
		// Insertar el producto en la tabla PRODUCTS
		await connection.query('INSERT INTO PRODUCTS (name, sales_price, image_route) VALUES (?, ?, ?);', [
			name,
			sales_price,
			image_route,
		]);
		// Actualizar las tarifas en la tabla RATES
		await connection.query(
			'UPDATE RATES' +
				'\nSET cost = CASE' +
				'\nWHEN work_type_id = "Corte de Madera" THEN ?' +
				'\nWHEN work_type_id = "Corte de Tela" THEN ?' +
				'\nWHEN work_type_id = "Costura" THEN ?' +
				'\nWHEN work_type_id = "Tapicería" THEN ?' +
				'\nWHEN work_type_id = "Ensamblado" THEN ?' +
				'\nELSE cost' +
				'\nEND' +
				'\nWHERE product_id = ?;',
			[wood_cut_price, fabric_cut_price, sewing_price, upholsterer_price, assembled_price, name],
		);
	}

	static async update(connection, product) {
		const {
			name,
			wood_cut_price,
			fabric_cut_price,
			sewing_price,
			upholsterer_price,
			assembled_price,
			sales_price,
			image_route,
		} = product;
		// Actualizar el producto en la tabla PRODUCTS
		await connection.query('UPDATE PRODUCTS SET name = ?, sales_price = ?, image_route = ? WHERE name = ?;', [
			name,
			sales_price,
			image_route,
			name,
		]);
		// Actualizar las tarifas en la tabla RATES
		await connection.query(
			'UPDATE RATES' +
				'\nSET cost = CASE' +
				'\nWHEN work_type_id = "Corte de Madera" THEN ?' +
				'\nWHEN work_type_id = "Corte de Tela" THEN ?' +
				'\nWHEN work_type_id = "Costura" THEN ?' +
				'\nWHEN work_type_id = "Tapicería" THEN ?' +
				'\nWHEN work_type_id = "Ensamblado" THEN ?' +
				'\nELSE cost' +
				'\nEND' +
				'\nWHERE product_id = ?;',
			[wood_cut_price, fabric_cut_price, sewing_price, upholsterer_price, assembled_price, name],
		);
	}

	static async delete(connection, name) {
		await connection.query('DELETE FROM PRODUCTS WHERE name = ?;', [name]);
	}
}

export default class Product {
	static async findAll(connection) {
		const [rows] = await connection.query('SELECT * FROM PRODUCTS;');
		return rows;
	}

	static async findById(connection, id) {
		const [rows] = await connection.query('SELECT * FROM PRODUCTS WHERE id = ?;', [id]);
		return rows[0];
	}

	static async create(connection, product) {
		const {
			id,
			products_name,
			wood_cut_price,
			fabric_cut_price,
			sewing_price,
			price_upholsterer,
			assembled_price,
			sales_price,
			image_route,
		} = product;
		await connection.query(
			'INSERT INTO PRODUCTS (id, products_name, wood_cut_price, fabric_cut_price, sewing_price, price_upholsterer, assembled_price, sales_price, image_route) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
			[
				id,
				products_name,
				wood_cut_price,
				fabric_cut_price,
				sewing_price,
				price_upholsterer,
				assembled_price,
				sales_price,
				image_route,
			],
		);
	}

	static async update(connection, id, product) {
		const {
			products_name,
			wood_cut_price,
			fabric_cut_price,
			sewing_price,
			price_upholsterer,
			assembled_price,
			sales_price,
			image_route,
		} = product;

		await connection.query(
			'UPDATE PRODUCTS SET products_name = ?, wood_cut_price = ?, fabric_cut_price = ?, sewing_price = ?, price_upholsterer = ?, assembled_price = ?, sales_price = ?, image_route = ? WHERE id = ?;',
			[
				products_name,
				wood_cut_price,
				fabric_cut_price,
				sewing_price,
				price_upholsterer,
				assembled_price,
				sales_price,
				image_route,
				id,
			],
		);
	}

	static async delete(connection, id) {
		await connection.query('DELETE FROM PRODUCTS WHERE id = ?;', [id]);
	}
}

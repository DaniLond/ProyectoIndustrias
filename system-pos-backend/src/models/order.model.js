export default class Order {
    static async findAll(connection) {
        const [rows] = await connection.query(
            `SELECT 
                o.id, 
                o.detail, 
                o.client, 
                o.date_realization, 
                o.delivery_date, 
                o.address, 
                o.id_state, 
                c.client_name, 
                s.state_name 
            FROM ORDERS o
            JOIN CLIENTS c ON o.client = c.id
            JOIN STATES s ON o.id_state = s.state_name`
        );
        return rows;
    }

    static async findById(connection, id) {
        const [rows] = await connection.query(
            `SELECT 
                o.id, 
                o.detail, 
                o.client, 
                o.date_realization, 
                o.delivery_date, 
                o.address, 
                o.id_state, 
                c.client_name, 
                s.state_name 
            FROM ORDERS o
            JOIN CLIENTS c ON o.client = c.id
            JOIN STATES s ON o.id_state = s.state_name
            WHERE o.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async findProductsByOrderId(connection, id) {
        const [rows] = await connection.query(
            `SELECT 
                od.id, 
                od.order_id, 
                od.product, 
                od.description, 
                od.state 
            FROM ORDER_DETAIL od
            JOIN PRODUCTS p ON od.product = p.name
            WHERE od.order_id = ?`,
            [id]
        );
        return rows;
    }

    static async create(connection, order) {
        const { detail, client, delivery_date, address, products } = order;
        const id_state = 'Pendiente';

        // Agregar productos a la tabla de detalle de órdenes
        for (const product of products) {
            const { product_name, detail } = product;
            await connection.query('CALL add_temp_product(?, ?);', [product_name, detail]);
        }

        await connection.query(
            `INSERT INTO ORDERS (detail, client, delivery_date, address, id_state) 
            VALUES (?, ?, ?, ?, ?)`,
            [detail, client, delivery_date, address, id_state]
        );

    }

    static async update(connection, order) {
        const { id, detail, delivery_date, address, id_state, productsToUpdate } = order;
        await connection.query(
            `UPDATE ORDERS 
            SET detail = ?, delivery_date = ?, address = ?, id_state = ? 
            WHERE id = ?`,
            [detail, delivery_date, address, id_state, id]
        );

        // Actualizar productos en la tabla de detalle de órdenes
        for (const product of productsToUpdate) {
            const { order_detail_id, description } = product;
            await connection.query('UPDATE ORDER_DETAIL SET description = ? WHERE id = ?;', [description, order_detail_id]);
        }
    }

    static async addProductToOrder(connection, order_detail, quantity) {
        const { order_id, product, description } = order_detail;
        for (let i = 0; i < quantity; i++) {
            await connection.query(
                `INSERT INTO ORDER_DETAIL (order_id, product, description, state) 
                VALUES (?, ?, ?, ?)`,
                [order_id, product, description, 'Pendiente']
            );
        }
    }

    static async deleteProductFromOrder(connection, orderDetailId) {
        await connection.query(`DELETE FROM ORDER_DETAIL WHERE id = ?`, [orderDetailId]);
    }
}


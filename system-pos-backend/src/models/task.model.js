export default class Task {
	static async getPendingTasksByWorkType(connection, workType) {
		const [rows] = await connection.query('CALL GetAvailableTasksByWorkTypeOptimized(?)', [workType]);
		return rows[0] || [];
	}

	static async assignTaskToEmployee(connection, cardId, employeeId) {
		await connection.query(
			'UPDATE CARD SET employee_id = ?, state = "En progreso", date_assignment = CURDATE() WHERE id = ?;',
			[employeeId, cardId],
		);
	}

	static async getEmployeeRole(connection, employeeId) {
		const [rows] = await connection.query('SELECT role FROM EMPLOYEES WHERE id = ?;', [employeeId]);
		return rows[0]?.role;
	}

	static async getEmployeeTasksWithDateFilter(connection, employeeId, startDate, endDate, dateFilterType) {
		let query =
			'SELECT c.id, c.date_assignment, c.state, c.date_completed, ' +
			'od.product, od.description, od.order_id, cl.client_name, ' +
			'e.name AS employee_name, e.role AS employee_role ' +
			'FROM CARD c ' +
			'JOIN ORDER_DETAIL od ON c.order_detail_id = od.id ' +
			'JOIN ORDERS o ON od.order_id = o.id ' +
			'JOIN CLIENTS cl ON o.client = cl.id ' +
			'JOIN EMPLOYEES e ON c.employee_id = e.id ' +
			'WHERE c.employee_id = ? ';

		let params = [employeeId];

		if (startDate && endDate) {
			if (dateFilterType === 'assignment') {
				query += 'AND c.date_assignment BETWEEN ? AND ? ';
			} else if (dateFilterType === 'completion') {
				query += 'AND c.date_completed BETWEEN ? AND ? ';
			}
			params.push(startDate, endDate);
		}

		query += 'ORDER BY c.date_assignment DESC';

		const [rows] = await connection.query(query, params);
		return rows;
	}

	static async getEmployeeTasks(connection, employeeId) {
		const [rows] = await connection.query(
			'SELECT c.id, c.date_assignment, c.state, c.date_completed, ' +
				'od.product, od.description, od.order_id, cl.client_name, ' +
				'e.name AS employee_name, e.role AS employee_role ' +
				'FROM CARD c ' +
				'JOIN ORDER_DETAIL od ON c.order_detail_id = od.id ' +
				'JOIN ORDERS o ON od.order_id = o.id ' +
				'JOIN CLIENTS cl ON o.client = cl.id ' +
				'JOIN EMPLOYEES e ON c.employee_id = e.id ' +
				'WHERE c.employee_id = ? ' +
				'ORDER BY c.date_assignment DESC',
			[employeeId],
		);
		return rows;
	}

	static async updateTaskStatus(connection, cardId, newStatus) {
		const validStates = ['Pendiente', 'En progreso', 'Completado'];
		if (!validStates.includes(newStatus)) {
			throw new Error('Estado no válido');
		}

		let query = 'UPDATE CARD SET state = ? WHERE id = ?';
		let params = [newStatus, cardId];

		if (newStatus === 'Completado') {
			query = 'UPDATE CARD SET state = ?, date_completed = CURDATE() WHERE id = ?';
		}

		await connection.query(query, params);
	}

	static async getOrderDetailStatus(connection, orderDetailId) {
		const [rows] = await connection.query('SELECT state FROM ORDER_DETAIL WHERE id = ?', [orderDetailId]);
		return rows[0]?.state;
	}

	static async getTasksByOrderDetail(connection, orderDetailId) {
		const [rows] = await connection.query(
			'SELECT c.id, c.work_type, c.state, c.employee_id, e.name as employee_name ' +
				'FROM CARD c ' +
				'LEFT JOIN EMPLOYEES e ON c.employee_id = e.id ' +
				'WHERE c.order_detail_id = ? ' +
				'ORDER BY c.work_type',
			[orderDetailId],
		);
		return rows;
	}

	static async getOrderProgress(connection, orderId) {
		const [rows] = await connection.query(
			'SELECT ' +
				'  COUNT(DISTINCT od.id) as total_products, ' +
				'  COUNT(DISTINCT CASE WHEN od.state IN ("Completado", "Despachado") THEN od.id END) as completed_products, ' +
				'  COUNT(c.id) as total_tasks, ' +
				'  COUNT(CASE WHEN c.state IN ("Completado", "Despachado") THEN c.id END) as completed_tasks, ' +
				'  COUNT(CASE WHEN c.state = "En progreso" THEN c.id END) as in_progress_tasks, ' +
				'  COUNT(CASE WHEN c.state = "Pendiente" THEN c.id END) as pending_tasks ' +
				'FROM ORDER_DETAIL od ' +
				'LEFT JOIN CARD c ON od.id = c.order_detail_id ' +
				'WHERE od.order_id = ?',
			[orderId],
		);
		return rows[0];
	}

	static async updateOrderDetailStatus(connection, cardId) {
		const [cardInfo] = await connection.query('SELECT order_detail_id FROM CARD WHERE id = ?', [cardId]);
		const orderDetailId = cardInfo[0].order_detail_id;

		if (!orderDetailId) {
			return;
		}

		await connection.query('UPDATE ORDER_DETAIL SET state = "Completado" WHERE id = ?', [orderDetailId]);
	}
}

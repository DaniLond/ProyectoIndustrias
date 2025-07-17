export default class Payment {
	static async getCompletedTasksByEmployeeAndDateRange(connection, employeeId, startDate, endDate) {
		const [rows] = await connection.query('CALL GetCompletedTasksByEmployeeAndDateRange(?, ?, ?)', [
			employeeId,
			startDate,
			endDate,
		]);
		return rows[0];
	}

	static async calculateEmployeePayment(connection, employeeId, startDate, endDate) {
		const [rows] = await connection.query('CALL CalculateEmployeePayment(?, ?, ?)', [employeeId, startDate, endDate]);
		return rows[0][0]; // Primer resultado del primer conjunto
	}

	static async createPaymentWithConcepts(
		connection,
		employeeId,
		baseAmount,
		paymentDate,
		concepts = [],
		paidCards = [],
	) {
		const conceptsJson = JSON.stringify(concepts);
		const paidCardsJson = JSON.stringify(paidCards);

		const [rows] = await connection.query('CALL CreatePaymentWithConcepts(?, ?, ?, ?, ?)', [
			employeeId,
			baseAmount,
			paymentDate,
			conceptsJson,
			paidCardsJson,
		]);

		return rows[0][0];
	}

	static async getEmployeePaymentHistory(connection, employeeId, limit = 50, offset = 0) {
		const [rows] = await connection.query('CALL GetEmployeePaymentHistory(?, ?, ?)', [employeeId, limit, offset]);
		return rows[0];
	}

	static async getPaymentDetails(connection, paymentId) {
		const [rows] = await connection.query('CALL GetPaymentDetails(?)', [paymentId]);
		return rows[0];
	}

	static async getAvailableConcepts(connection) {
		const [rows] = await connection.query('CALL GetAvailableConcepts()');
		return rows[0];
	}

	static async createConcept(connection, conceptName, value) {
		await connection.query('INSERT INTO CONCEPTS (concept_name, value) VALUES (?, ?)', [conceptName, value]);
		const [result] = await connection.query('SELECT LAST_INSERT_ID() as concept_id');
		return result[0].concept_id;
	}

	static async getAllPayments(connection, limit = 100, offset = 0) {
		const [rows] = await connection.query(
			`
            SELECT 
                p.id as payment_id,
                p.amount as total_amount,
                p.date_paid,
                e.id as employee_id,
                e.name as employee_name,
                e.role as employee_role
            FROM PAYMENTS p
            JOIN EMPLOYEES e ON p.employee_id = e.id
            ORDER BY p.date_paid DESC
            LIMIT ? OFFSET ?
        `,
			[limit, offset],
		);
		return rows;
	}

	static async getPaymentStatistics(connection, startDate, endDate) {
		const [rows] = await connection.query(
			`
            SELECT 
                COUNT(DISTINCT p.id) as total_payments,
                COUNT(DISTINCT p.employee_id) as employees_paid,
                COALESCE(SUM(p.amount), 0) as total_amount_paid,
                COALESCE(AVG(p.amount), 0) as average_payment
            FROM PAYMENTS p
            WHERE p.date_paid BETWEEN ? AND ?
        `,
			[startDate, endDate],
		);
		return rows[0];
	}

	static async getPaidProductsByPayment(connection, paymentId) {
		const [rows] = await connection.query('CALL GetPaidProductsByPayment(?)', [paymentId]);
		return rows[0];
	}

	static async createManualPayment(
		connection,
		employeeId,
		manualAmount,
		paymentDate,
		startDate,
		endDate,
		concepts = [],
	) {
		const conceptsJson = JSON.stringify(concepts);

		const [rows] = await connection.query('CALL CreateManualPayment(?, ?, ?, ?, ?, ?)', [
			employeeId,
			manualAmount,
			paymentDate,
			startDate,
			endDate,
			conceptsJson,
		]);

		return rows[0][0];
	}

	static async getPaymentsByDateRange(connection, startDate, endDate) {
		const [rows] = await connection.query(
			`
        SELECT 
            p.id as payment_id,
            p.amount as total_amount,
            p.date_paid,
            e.id as employee_id,
            e.name as employee_name,
            e.role as employee_role
        FROM PAYMENTS p
        JOIN EMPLOYEES e ON p.employee_id = e.id
        WHERE p.date_paid BETWEEN ? AND ?
        ORDER BY p.date_paid DESC, e.name ASC
        `,
			[startDate, endDate],
		);
		return rows;
	}
}

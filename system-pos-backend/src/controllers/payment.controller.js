import { connectDB } from '../config/database.js';
import Payment from '../models/payment.model.js';

export const getCompletedTasksForPayment = async (req, res, next) => {
	const { employeeId } = req.params;
	const { startDate, endDate } = req.query;
	let connection;

	try {
		if (!startDate || !endDate) {
			return res.status(400).json({
				error: 'Las fechas de inicio y fin son requeridas',
			});
		}

		connection = await connectDB();

		const tasks = await Payment.getCompletedTasksByEmployeeAndDateRange(connection, employeeId, startDate, endDate);

		const calculation = await Payment.calculateEmployeePayment(connection, employeeId, startDate, endDate);

		res.status(200).json({
			employee: {
				id: calculation.employee_id,
				name: calculation.employee_name,
				role: calculation.employee_role,
			},
			period: {
				start: calculation.period_start,
				end: calculation.period_end,
			},
			summary: {
				totalTasks: calculation.total_tasks,
				baseAmount: calculation.total_amount,
			},
			tasks: tasks,
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const createPayment = async (req, res, next) => {
	const { employeeId, baseAmount, paymentDate, additionalConcepts = [], paidCards = [] } = req.body;
	let connection;

	try {
		if (!employeeId || !baseAmount || !paymentDate) {
			return res.status(400).json({
				error: 'Empleado, monto base y fecha de pago son requeridos',
			});
		}

		connection = await connectDB();

		const payment = await Payment.createPaymentWithConcepts(
			connection,
			employeeId,
			baseAmount,
			paymentDate,
			additionalConcepts,
			paidCards,
		);

		res.status(201).json({
			message: 'Pago creado exitosamente',
			payment: {
				id: payment.created_payment_id,
				totalAmount: payment.total_amount,
				employeeId,
				paymentDate,
			},
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const getEmployeePaymentHistory = async (req, res, next) => {
	const { employeeId } = req.params;
	const { limit = 50, offset = 0 } = req.query;
	let connection;

	try {
		connection = await connectDB();

		const payments = await Payment.getEmployeePaymentHistory(connection, employeeId, parseInt(limit), parseInt(offset));

		res.status(200).json(payments);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const getPaymentDetails = async (req, res, next) => {
	const { paymentId } = req.params;
	let connection;

	try {
		connection = await connectDB();

		const details = await Payment.getPaymentDetails(connection, paymentId);

		if (!details || details.length === 0) {
			return res.status(404).json({ error: 'Pago no encontrado' });
		}

		const paymentInfo = {
			id: details[0].payment_id,
			totalAmount: details[0].total_amount,
			datePaid: details[0].date_paid,
			employee: {
				id: details[0].employee_id,
				name: details[0].employee_name,
				role: details[0].employee_role,
			},
			concepts: details
				.map((detail) => ({
					id: detail.concept_id,
					name: detail.concept_name,
					value: detail.concept_value,
				}))
				.filter((concept) => concept.id !== null),
		};

		res.status(200).json(paymentInfo);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const getAvailableConcepts = async (req, res, next) => {
	let connection;

	try {
		connection = await connectDB();

		const concepts = await Payment.getAvailableConcepts(connection);

		res.status(200).json(concepts);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const createConcept = async (req, res, next) => {
	const { conceptName, value } = req.body;
	let connection;

	try {
		if (!conceptName || value === undefined) {
			return res.status(400).json({
				error: 'El nombre del concepto y el valor son requeridos',
			});
		}

		connection = await connectDB();

		const conceptId = await Payment.createConcept(connection, conceptName, value);

		res.status(201).json({
			message: 'Concepto creado exitosamente',
			concept: {
				id: conceptId,
				name: conceptName,
				value: value,
			},
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const getAllPayments = async (req, res, next) => {
	const { limit = 100, offset = 0 } = req.query;
	let connection;

	try {
		connection = await connectDB();

		const payments = await Payment.getAllPayments(connection, parseInt(limit), parseInt(offset));

		res.status(200).json(payments);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const getPaymentStatistics = async (req, res, next) => {
	const { startDate, endDate } = req.query;
	let connection;

	try {
		if (!startDate || !endDate) {
			return res.status(400).json({
				error: 'Las fechas de inicio y fin son requeridas',
			});
		}

		connection = await connectDB();

		const statistics = await Payment.getPaymentStatistics(connection, startDate, endDate);

		res.status(200).json(statistics);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const getPaidProductsByPayment = async (req, res, next) => {
	const { paymentId } = req.params;
	let connection;

	try {
		connection = await connectDB();
		const products = await Payment.getPaidProductsByPayment(connection, paymentId);

		res.status(200).json(products);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const createManualPayment = async (req, res, next) => {
	const { employeeId, manualAmount, paymentDate, startDate, endDate, additionalConcepts = [] } = req.body;
	let connection;

	try {
		if (!employeeId || !manualAmount || !paymentDate || !startDate || !endDate) {
			return res.status(400).json({
				error: 'Empleado, monto manual, fecha de pago, fecha de inicio y fecha de fin son requeridos',
			});
		}

		connection = await connectDB();

		const payment = await Payment.createManualPayment(
			connection,
			employeeId,
			manualAmount,
			paymentDate,
			startDate,
			endDate,
			additionalConcepts,
		);

		res.status(201).json({
			message: 'Pago manual creado exitosamente',
			payment: {
				id: payment.created_payment_id,
				totalAmount: payment.total_amount,
				employeeId,
				paymentDate,
				startDate,
				endDate,
			},
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

export const getPaymentsByDateRange = async (req, res, next) => {
	const { startDate, endDate } = req.query;
	let connection;

	try {
		if (!startDate || !endDate) {
			return res.status(400).json({
				error: 'Las fechas de inicio y fin son requeridas',
			});
		}

		connection = await connectDB();
		const payments = await Payment.getPaymentsByDateRange(connection, startDate, endDate);

		res.status(200).json(payments);
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};
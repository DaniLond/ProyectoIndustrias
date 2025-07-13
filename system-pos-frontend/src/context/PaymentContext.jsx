import { createContext, useContext, useEffect, useState } from 'react';
import {
	getCompletedTasksForPaymentRequest,
	createPaymentRequest,
	getEmployeePaymentHistoryRequest,
	getPaymentDetailsRequest,
	getAllPaymentsRequest,
	getPaymentStatisticsRequest,
	getAvailableConceptsRequest,
	createConceptRequest,
	getPaidProductsByPaymentRequest,
  createManualPaymentRequest,
} from '../api/payment.js';

export const PaymentContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const usePayment = () => {
	const context = useContext(PaymentContext);
	if (!context) throw new Error('usePayment debe ser usado dentro de un PaymentProvider');
	return context;
};

// eslint-disable-next-line react/prop-types
export const PaymentProvider = ({ children }) => {
	const [paymentData, setPaymentData] = useState(null);
	const [paymentHistory, setPaymentHistory] = useState([]);
	const [allPayments, setAllPayments] = useState([]);
	const [availableConcepts, setAvailableConcepts] = useState([]);
	const [paymentStatistics, setPaymentStatistics] = useState(null);
	const [errors, setErrors] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (errors.length > 0) {
			const timer = setTimeout(() => {
				setErrors([]);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [errors]);

	const getCompletedTasksForPayment = async (employeeId, startDate, endDate) => {
		setIsLoading(true);
		setErrors([]);
		try {
			const res = await getCompletedTasksForPaymentRequest(employeeId, startDate, endDate);
			setPaymentData(res.data);
			return res.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error] || [
					'Error al obtener tareas completadas',
				];
			setErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const createPayment = async (paymentData) => {
		setIsLoading(true);
		setErrors([]);
		try {
			const res = await createPaymentRequest(paymentData);
			if (paymentData.employeeId) {
				await getEmployeePaymentHistory(paymentData.employeeId);
			}
			return res.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error] || ['Error al crear el pago'];
			setErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const getEmployeePaymentHistory = async (employeeId, limit = 50, offset = 0) => {
		setIsLoading(true);
		setErrors([]);
		try {
			const res = await getEmployeePaymentHistoryRequest(employeeId, limit, offset);
			setPaymentHistory(res.data);
			return res.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error] || [
					'Error al obtener historial de pagos',
				];
			setErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const getPaymentDetails = async (paymentId) => {
		setIsLoading(true);
		setErrors([]);
		try {
			const res = await getPaymentDetailsRequest(paymentId);
			return res.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error] || [
					'Error al obtener detalles del pago',
				];
			setErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const getAllPayments = async (limit = 100, offset = 0) => {
		setIsLoading(true);
		setErrors([]);
		try {
			const res = await getAllPaymentsRequest(limit, offset);
			setAllPayments(res.data);
			return res.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error] || [
					'Error al obtener todos los pagos',
				];
			setErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const getPaymentStatistics = async (startDate, endDate) => {
		setIsLoading(true);
		setErrors([]);
		try {
			const res = await getPaymentStatisticsRequest(startDate, endDate);
			setPaymentStatistics(res.data);
			return res.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error] || [
					'Error al obtener estadísticas de pagos',
				];
			setErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const getAvailableConcepts = async () => {
		setIsLoading(true);
		setErrors([]);
		try {
			const res = await getAvailableConceptsRequest();
			setAvailableConcepts(res.data);
			return res.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error] || [
					'Error al obtener conceptos disponibles',
				];
			setErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const createConcept = async (conceptData) => {
		setIsLoading(true);
		setErrors([]);
		try {
			const res = await createConceptRequest(conceptData);
			await getAvailableConcepts();
			return res.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error] || [
					'Error al crear concepto',
				];
			setErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const getPaidProductsByPayment = async (paymentId) => {
		setIsLoading(true);
		setErrors([]);
		try {
			const res = await getPaidProductsByPaymentRequest(paymentId);
			return res.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error] || [
					'Error al obtener productos pagados',
				];
			setErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const createManualPayment = async (paymentData) => {
		setIsLoading(true);
		setErrors([]);
		try {
			const res = await createManualPaymentRequest(paymentData);

			if (paymentData.employeeId) {
				await getEmployeePaymentHistory(paymentData.employeeId);
			}

			return res.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error] || [
					'Error al crear el pago manual',
				];
			setErrors(Array.isArray(errorMessage) ? errorMessage : [errorMessage]);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const clearPaymentData = () => {
		setPaymentData(null);
	};

	const clearErrors = () => {
		setErrors([]);
	};

	return (
		<PaymentContext.Provider
			value={{
				paymentData,
				paymentHistory,
				allPayments,
				availableConcepts,
				paymentStatistics,
				errors,
				isLoading,
				getCompletedTasksForPayment,
				createPayment,
				getEmployeePaymentHistory,
				getPaymentDetails,
				getAllPayments,
				getPaymentStatistics,
				getAvailableConcepts,
				createConcept,
				getPaidProductsByPayment,
        createManualPayment,
				clearPaymentData,
				clearErrors,
			}}
		>
			{children}
		</PaymentContext.Provider>
	);
};

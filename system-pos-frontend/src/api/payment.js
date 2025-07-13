import axios from './axios.js';

export const getCompletedTasksForPaymentRequest = (employeeId, startDate, endDate) =>
	axios.get(`/payments/employee/${employeeId}/tasks`, {
		params: { startDate, endDate },
	});

export const createPaymentRequest = (paymentData) => axios.post('/payments', paymentData);

export const getEmployeePaymentHistoryRequest = (employeeId, limit = 50, offset = 0) =>
	axios.get(`/payments/employee/${employeeId}/history`, {
		params: { limit, offset },
	});

export const getPaymentDetailsRequest = (paymentId) => axios.get(`/payments/${paymentId}`);

export const getAllPaymentsRequest = (limit = 100, offset = 0) =>
	axios.get('/payments', {
		params: { limit, offset },
	});

export const getPaymentStatisticsRequest = (startDate, endDate) =>
	axios.get('/payments/statistics', {
		params: { startDate, endDate },
	});

export const getAvailableConceptsRequest = () => axios.get('/payment-concepts');

export const createConceptRequest = (conceptData) => axios.post('/payment-concepts', conceptData);

export const getPaidProductsByPaymentRequest = (paymentId) => axios.get(`/payments/${paymentId}/products`);

export const createManualPaymentRequest = (paymentData) => axios.post('/payments/manual', paymentData);
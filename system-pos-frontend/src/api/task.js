import axios from './axios.js';

export const getPendingTasksRequest = (employeeId) => axios.get(`/tasks/pending/${employeeId}`);

export const assignTaskRequest = (employeeId, cardId) => axios.post('/tasks/assign', { employeeId, cardId });

export const getEmployeeTasksRequest = (employeeId, options = {}) => {
	const { startDate, endDate, dateFilterType = 'assignment', useWeekFilter = true } = options;

	const params = new URLSearchParams();
	if (startDate) params.append('startDate', startDate);
	if (endDate) params.append('endDate', endDate);
	params.append('dateFilterType', dateFilterType);
	params.append('useWeekFilter', useWeekFilter.toString());

	return axios.get(`/tasks/employee/${employeeId}?${params.toString()}`);
};

export const updateTaskStatusRequest = (cardId, newStatus, workType) =>
	axios.put('/tasks/update-status', { cardId, newStatus, workType });

export const getOrderProgressRequest = (orderId) => axios.get(`/orders/${orderId}/progress`);

export const getOrderDetailTasksRequest = (orderDetailId) => axios.get(`/order-detail/${orderDetailId}/tasks`);

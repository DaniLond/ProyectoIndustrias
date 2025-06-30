import axios from './axios.js';

export const getPendingTasksRequest = (employeeId) => axios.get(`/tasks/pending/${employeeId}`);
export const assignTaskRequest = (employeeId, cardId) => axios.post('/tasks/assign', { employeeId, cardId });
export const getEmployeeTasksRequest = (employeeId) => axios.get(`/tasks/employee/${employeeId}`);
export const updateTaskStatusRequest = (cardId, newStatus, workType) => axios.put('/tasks/update-status', { cardId, newStatus, workType });
export const getOrderProgressRequest = (orderId) => 
    axios.get(`/orders/${orderId}/progress`);
export const getOrderDetailTasksRequest = (orderDetailId) => 
    axios.get(`/order-detail/${orderDetailId}/tasks`);
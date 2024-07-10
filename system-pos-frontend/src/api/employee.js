import axios from './axios.js';

export const registerEmployeeRequest = (employee) => axios.post('/employees', employee);

export const getEmployeesRequest = () => axios.get('/employees');

export const updateEmployeeRequest = (id, employee) => axios.put(`/employees/${id}`, employee);

export const deleteEmployeeRequest = (id) => axios.delete(`/employees/${id}`);
import axios from './axios.js';

export const registerClientRequest = (client) => axios.post('/clientes', client);

export const getClientsRequest = () => axios.get('/clientes');

export const updateClientRequest = (id, client) => axios.put(`/clientes/${id}`, client);

export const deleteClientRequest = (id) => axios.delete(`/clientes/${id}`);

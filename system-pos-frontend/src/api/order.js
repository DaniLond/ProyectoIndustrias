import axios from './axios';

export const getOrdersRequest = async () => axios.get('/orders');

export const getOrderRequest = async (id) => axios.get(`/orders/${id}`);

export const createOrderRequest = async (order) => axios.post('/create-order', order);

export const updateOrderRequest = async (id, order) => axios.put(`/edit-order/${id}`, order);

export const deleteProductFromOrderRequest = async (id) => axios.delete(`/delete-product/${id}`);

export const getProductsByOrderIdRequest = async (id) => axios.get(`/orders/${id}/products`);
import axios from './axios';

export const getProductsRequest = async () => axios.get('/products');

export const getProductRequest = async (name) => axios.get(`/products/${name}`);

export const createProductRequest = async (product) => axios.post('/create-product', product);

export const updateProductRequest = async (product) => axios.put(`/edit-product/${product.name}`, product);

export const deleteProductRequest = async (name) => axios.delete(`/delete-product/${name}`);

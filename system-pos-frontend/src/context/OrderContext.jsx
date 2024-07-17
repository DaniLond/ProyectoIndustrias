import { createContext, useContext, useEffect, useState } from 'react';
import {
	getOrdersRequest,
	getOrderRequest,
	createOrderRequest,
	updateOrderRequest,
	getProductsByOrderIdRequest,
	deleteProductFromOrderRequest,
} from '../api/order.js';

export const OrderContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useOrder = () => {
	const context = useContext(OrderContext);
	if (!context) throw new Error('useOrder debe ser usado dentro de un OrderProvider');
	return context;
};

export const OrderProvider = ({ children }) => {
	const [orders, setOrders] = useState([]);
	const [orderProducts, setOrderProducts] = useState([]);
	const [errors, setErrors] = useState([]);

	const getOrders = async () => {
		try {
			const res = await getOrdersRequest();
			setOrders(res.data);
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error];
			setErrors(errorMessage);
		}
	};

	const getOrder = async (id) => {
		try {
			const res = await getOrderRequest(id);
			return res.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error];
			setErrors(errorMessage);
		}
	};

	const createOrder = async (order) => {
		try {
			const res = await createOrderRequest(order);
			setOrders([...orders, res.data]);
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error];
			setErrors(errorMessage);
		}
	};

	const updateOrder = async (id, order) => {
		try {
			const res = await updateOrderRequest(id, order);
			setOrders(orders.map((o) => (o.id === id ? res.data.order : o)));
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error];
			setErrors(errorMessage);
		}
	};

	const getProductToOrder = async (id) => {
		try {
			const res = await getProductsByOrderIdRequest(id);
			setOrderProducts(res.data);
			return res.data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error];
			setErrors(errorMessage);
		}
	};

	const deleteProductFromOrder = async (id) => {
		try {
			await deleteProductFromOrderRequest(id);
			setOrderProducts(orderProducts.filter((p) => p.id !== id));
			await getOrders();
		} catch (error) {
			const errorMessage = error.response?.data?.message || [error.response?.data?.error];
			setErrors(errorMessage);
		}
	};

	useEffect(() => {
		if (errors.length > 0) {
			const timer = setTimeout(() => {
				setErrors([]);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [errors]);

	return (
		<OrderContext.Provider
			value={{
				orders,
				orderProducts,
				errors,
				getOrders,
				getOrder,
				createOrder,
				updateOrder,
				getProductToOrder,
				deleteProductFromOrder,
			}}
		>
			{children}
		</OrderContext.Provider>
	);
};

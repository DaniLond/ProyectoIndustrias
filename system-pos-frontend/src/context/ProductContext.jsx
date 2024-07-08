import { createContext, useContext, useState, useEffect } from 'react';
import {
	getProductsRequest,
	getProductRequest,
	createProductRequest,
	updateProductRequest,
	deleteProductRequest,
} from '../api/product';

const ProductContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => {
	const context = useContext(ProductContext);
	if (!context) throw new Error('useProducts debe ser usado dentro de un ProductProvider');
	return context;
};

export function ProductProvider({ children }) {
	const [products, setProducts] = useState([]);
	const [errors, setErrors] = useState([]);

	const getProducts = async () => {
		try {
			const res = await getProductsRequest();
			setProducts(res.data);
		} catch (error) {
			const errorMessage = error.response.data.message || [error.response.data.error];
			setErrors(errorMessage);
		}
	};

	const getProduct = async (name) => {
		try {
			const res = await getProductRequest(name);
			return res.data;
		} catch (error) {
			const errorMessage = error.response.data.message || [error.response.data.error];
			setErrors(errorMessage);
		}
	};

	const createProduct = async (product) => {
		try {
			const res = await createProductRequest(product);
			if (res.statusCode === 201) setProducts([...products, product]);
		} catch (error) {
			const errorMessage = error.response.data.message || [error.response.data.error];
			setErrors(errorMessage);
		}
	};

	const updateProduct = async (name, product) => {
		try {
			const res = await updateProductRequest(name, product);
			if (res.statusCode === 200) setProducts(products.map((p) => (p.name === name ? product : p)));
		} catch (error) {
			const errorMessage = error.response.data.message || [error.response.data.error];
			setErrors(errorMessage);
		}
	};

	const deleteProduct = async (name) => {
		try {
			const res = await deleteProductRequest(name);
			if (res.status === 204) setProducts(products.filter((p) => p.name !== name));
		} catch (error) {
			const errorMessage = error.response.data.message || [error.response.data.error];
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
		<ProductContext.Provider
			value={{
				products,
				getProducts,
				getProduct,
				createProduct,
				updateProduct,
				deleteProduct,
				errors,
			}}
		>
			{children}
		</ProductContext.Provider>
	);
}

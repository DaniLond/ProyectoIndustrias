import { createContext, useContext, useEffect, useState } from 'react';
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth.js';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
	return context;
};

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [errors, setErrors] = useState([]);
	const [loading, setLoading] = useState(true);

	const signup = async (user) => {
		try {
			const res = await registerRequest(user);
			setUser(res.data);
			setIsAuthenticated(true);
		} catch (error) {
			const errorMessage = error.response.data.message || [error.response.data.error];
			setErrors(errorMessage);
		}
	};

	const signin = async (user) => {
		try {
			const res = await loginRequest(user);
			setUser(res.data);
			setIsAuthenticated(true);
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

	useEffect(() => {
		async function checkLogin() {
			const cookies = Cookies.get();
			if (!cookies.token) {
				setIsAuthenticated(false);
				setLoading(false);
				return;
			}

			try {
				const res = await verifyTokenRequest(cookies.token);
				if (!res.data) return setIsAuthenticated(false);
				setIsAuthenticated(true);
				setUser(res.data);
				setLoading(false);
			} catch (error) {
				setIsAuthenticated(false);
				setLoading(false);
			}
		}
		checkLogin();
	}, []);

	return (
		<AuthContext.Provider value={{ signup, signin, user, isAuthenticated, errors, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

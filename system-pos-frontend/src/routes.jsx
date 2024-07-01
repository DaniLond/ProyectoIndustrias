import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Error404Page from './pages/Error404Page';

export const ProtectedRoute = () => {
	const { isAuthenticated, loading } = useAuth();

	if (loading) return <Error404Page />;
	if (!isAuthenticated && !loading) return <Navigate to='/' replace />;
	return <Outlet />;
};

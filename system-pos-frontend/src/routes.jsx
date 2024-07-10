import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import { Spinner } from '@nextui-org/react';

export const ProtectedRoute = () => {
	const { isAuthenticated, loading } = useAuth();

	if (loading)
		return (
			<div className='fixed w-screen h-screen flex justify-center items-center'>
				<Spinner size='lg' label='Cargando...' color='primary' />
			</div>
		);
	if (!isAuthenticated && !loading) return <Navigate to='/' replace />;
	return <Outlet />;
};

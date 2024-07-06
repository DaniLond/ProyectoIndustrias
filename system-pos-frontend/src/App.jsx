import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ClientProvider } from './context/ClientContext';
// Páginas disponibles
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ClientePage from './pages/ClientPage';

import { ProtectedRoute } from './routes';

function App() {
	return (
		<AuthProvider>
			<ClientProvider>
				<BrowserRouter>
					<Routes>
						{/* Rutas públicas */}
						<Route path='/' element={<LoginPage />}></Route>
						<Route path='/register' element={<RegisterPage />}></Route>
						<Route path='/forgot-password' element={<ForgotPassword />}></Route>
						<Route path='/reset-password/:token' element={<ResetPassword />}></Route>
						<Route path='/client' element={<ClientePage />}></Route>
						{/* Rutas protegidas */}
						<Route element={<ProtectedRoute />}>
							<Route path='/home' element={<h1>Home page</h1>}></Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</ClientProvider>
		</AuthProvider>

	);
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Páginas disponibles
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

import { ProtectedRoute } from './routes';

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					{/* Rutas públicas */}
					<Route path='/register' element={<RegisterPage />}></Route>
					<Route path='/' element={<LoginPage />}></Route>
					{/* Rutas protegidas */}
					<Route element={<ProtectedRoute />}>
						<Route path='/home' element={<h1>Home page</h1>}></Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;

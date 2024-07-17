import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Contextos
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';

import { ClientProvider } from './context/ClientContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { OrderProvider } from './context/OrderContext';
// Páginas disponibles
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Error404Page from './pages/Error404Page';

// Rutas protegidas
import { ProtectedRoute } from './routes';
import ProductPage from './pages/product/ProductPage';
import ClientePage from './pages/client/ClientPage';
import EmployeePage from './pages/employee/EmployeePage';
import OrderPage from './pages/order/OrderPage';
import RegisterOrderPage from './pages/order/AddOrderPage';

function App() {
	return (
		<AuthProvider>
			<ProductProvider>
				<ClientProvider>
					<EmployeeProvider>
						<OrderProvider>
							<BrowserRouter>
								<Routes>
									{/* Rutas públicas */}
									<Route path='/' element={<LoginPage />}></Route>
									<Route path='/register' element={<RegisterPage />}></Route>
									<Route path='/forgot-password' element={<ForgotPassword />}></Route>
									<Route path='/reset-password/:token' element={<ResetPassword />}></Route>

									{/* Rutas protegidas */}
									<Route element={<ProtectedRoute />}>
										<Route path='/home' element={<ProductPage />}></Route>
										<Route path='/clients' element={<ClientePage />}></Route>
										<Route path='/employees' element={<EmployeePage />}></Route>
										<Route path='/orders' element={<OrderPage />}></Route>
										<Route path='/create-order' element={<RegisterOrderPage />}></Route>
										<Route path='/edit-order/:id' element={<RegisterOrderPage />} />
									</Route>

									{/* Ruta para manejo de errores 404 en rutas públicas */}
									<Route path='*' element={<Error404Page />} />
								</Routes>
							</BrowserRouter>
						</OrderProvider>
					</EmployeeProvider>
				</ClientProvider>
			</ProductProvider>
		</AuthProvider>
	);
}

export default App;

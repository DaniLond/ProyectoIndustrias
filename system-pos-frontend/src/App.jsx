import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Contextos
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { TaskProvider } from './context/TaskContext';
import { ClientProvider } from './context/ClientContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { OrderProvider } from './context/OrderContext';
import { PaymentProvider } from './context/PaymentContext';

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
import OrderEditPage from './pages/order/OrderEditPage';
import EmployeeTasksTemplate from './pages/employee/EmployeeTasksTemplate';
import CreatePaymentPage from './pages/Payment/CreatePaymentPage';
import PaymentHistoryPage from './pages/Payment/PaymentHistoryPage';
import GeneralPaymentsPage from './pages/Payment/GeneralPaymentsPage';


function App() {
	return (
		<AuthProvider>
			<ProductProvider>
				<ClientProvider>
					<EmployeeProvider>
						<PaymentProvider>
							<OrderProvider>
								<TaskProvider>
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
												<Route path="/edit-order/:id" element={<OrderEditPage />} />
												<Route path="/tasks/employee/:employeeId" element={<EmployeeTasksTemplate />} />
												<Route path="/payments" element={<GeneralPaymentsPage />} />
												<Route path='/payments/create/:employeeId' element={<CreatePaymentPage />} />
												<Route path='/payments/history/:employeeId' element={<PaymentHistoryPage />} />
											</Route>

											{/* Ruta para manejo de errores 404 en rutas públicas */}
											<Route path='*' element={<Error404Page />} />
										</Routes>
									</BrowserRouter>
								</TaskProvider>
							</OrderProvider>
						</PaymentProvider>
					</EmployeeProvider>
				</ClientProvider>
			</ProductProvider>
		</AuthProvider>
	);
}

export default App;
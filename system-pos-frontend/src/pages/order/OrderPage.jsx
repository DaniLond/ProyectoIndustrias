import { useEffect, useState } from 'react';
import DefaultLayout from '../../layouts/DefaultLayout';
import Alert from '../../components/ui/Alert';
import CustomTable from '../../components/CustomTable';
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaEdit } from 'react-icons/fa';
import { useOrder } from '../../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import { FaRegEye } from 'react-icons/fa';
import ViewProductModal from './ViewProductModal';
import OrderProgressModal from './OrderProgressModal';
import { Select, SelectItem } from '@nextui-org/react';

function OrderPage() {
	const { orders, getOrders, getProductToOrder, errors } = useOrder();
	const [visibleErrors, setVisibleErrors] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);
	const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
	const [selectedOrderProgress, setSelectedOrderProgress] = useState(null);
	const [selectedOrderInfo, setSelectedOrderInfo] = useState(null);	
	const navigate = useNavigate();
	const { updateOrderState } = useOrder();
	const { getOrderProgress } = useOrder();

	useEffect(() => {
		const fetchData = async () => {
			try {
				await getOrders();
				setIsLoading(false);
			} catch (error) {
				const errorMessage = error.response?.data?.message || error.response?.data?.error;
				setVisibleErrors([errorMessage]);
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleCreateOrder = () => {
		navigate('/create-order');
	};

	const handleViewMore = async (orderId) => {
		try {
			const products = await getProductToOrder(orderId);
			setSelectedOrderProducts(products);
			setIsModalOpen(true);
		} catch (error) {
			setVisibleErrors([error.message]);
		}
	};

	const handleStateChange = async (orderId, newState) => {
		try {
			await updateOrderState(orderId, newState);
		} catch (error) {
			setVisibleErrors([error.message]);
		}
	};

	useEffect(() => {
		setVisibleErrors(errors);
	}, [errors]);

	const handleCloseAlert = (index) => {
		setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
	};

	const handleViewProgress = async (orderId) => {
		try {
			const progress = await getOrderProgress(orderId);
			const orderInfo = orders.find(order => order.id === orderId);
			
			setSelectedOrderProgress(progress);
			setSelectedOrderInfo(orderInfo);
			setIsProgressModalOpen(true);
		} catch (error) {
			setVisibleErrors([error.message]);
		}
	};

	const orderStates = [
		{ key: 'Pendiente', label: 'Pendiente' },
		{ key: 'En progreso', label: 'En progreso' },
		{ key: 'Completado', label: 'Completado' },
		{ key: 'Despachado', label: 'Despachado' }
	];

	const columns = [
		{ name: 'ID', uid: 'id', sortable: true },
		{ name: 'DETALLE', uid: 'detail', sortable: true },
		{ name: 'CLIENTE', uid: 'client_name', sortable: true },
		{ name: 'FECHA DE REALIZACIÓN', uid: 'date_realization', sortable: true },
		{ name: 'FECHA DE ENTREGA', uid: 'delivery_date', sortable: true },
		{ name: 'DIRECCIÓN', uid: 'address', sortable: true },
		{ name: 'ESTADO', uid: 'id_state', sortable: true },
		{ name: 'PROGRESO', uid: 'progress' }, // YA ESTÁ AGREGADO
		{ name: 'ACCIONES', uid: 'actions' },
	];

	const initialVisibleColumns = ['id', 'client_name', 'date_realization', 'delivery_date', 'id_state', 'progress', 'actions'];

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toISOString().split('T')[0];
	};

	const renderCell = (order, columnKey) => {
		const cellValue = order[columnKey];
		switch (columnKey) {
			case 'id_state':
				return (
					<Select
						size="sm"
						selectedKeys={[cellValue]}
						onSelectionChange={(keys) => {
							const newState = Array.from(keys)[0];
							if (newState !== cellValue) {
								handleStateChange(order.id, newState);
							}
						}}
						className="min-w-[120px]"
					>
						{orderStates.map((state) => (
							<SelectItem key={state.key} value={state.key}>
								{state.label}
							</SelectItem>
						))}
					</Select>
				);
			case 'progress':
				return (
					<Button
						size="sm"
						variant="light"
						color="primary"
						onPress={() => handleViewProgress(order.id)}
					>
						Ver Progreso
					</Button>
				);
			case 'actions':
				return (
					<div className='relative flex justify-center items-center'>
						<Dropdown className='bg-background border-1 border-default-200'>
							<DropdownTrigger>
								<Button isIconOnly radius='full' size='sm' variant='light'>
									<BsThreeDotsVertical className='text-default-500' />
								</Button>
							</DropdownTrigger>
							<DropdownMenu color='primary' variant='bordered'>
								<DropdownItem startContent={<FaEdit />} onPress={() => navigate(`/edit-order/${order.id}`)}>
									Editar
								</DropdownItem>
								<DropdownItem startContent={<FaRegEye />} onPress={() => handleViewMore(order.id)}>
									Ver más
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				);
			case 'date_realization':
			case 'delivery_date':
				return formatDate(cellValue);
			default:
				return cellValue;
		}
	};

	return (
		<DefaultLayout>
			{visibleErrors.map((error, i) => (
				<Alert type={true} title='Error' message={error} key={i} onClose={() => handleCloseAlert(i)} />
			))}
			<div className='p-2'>
				<h2 className='text-gray-800 text-2xl font-bold'>Pedidos</h2>
			</div>
			{!isLoading && (
				<CustomTable
					elements={orders}
					name='pedidos'
					columns={columns}
					initialVisibleColumns={initialVisibleColumns}
					handleCreate={handleCreateOrder}
					renderCell={renderCell}
					filterProperty='client_name'
					additionalFilter={{ field: 'state_name', label: 'Estado' }}
				/>
			)}

			<ViewProductModal 
				isOpen={isModalOpen} 
				onClose={() => setIsModalOpen(false)} 
				products={selectedOrderProducts} 
			/>
			
			<OrderProgressModal
				isOpen={isProgressModalOpen}
				onClose={() => setIsProgressModalOpen(false)}
				progressData={selectedOrderProgress}
				orderInfo={selectedOrderInfo}
			/>
		</DefaultLayout>
	);
}

export default OrderPage;

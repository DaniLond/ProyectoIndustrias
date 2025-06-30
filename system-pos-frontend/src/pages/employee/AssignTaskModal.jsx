import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Card, CardBody, Chip } from '@nextui-org/react';
import { useTask } from '../../context/TaskContext';
import Alert from '../../components/ui/Alert';

const AssignTaskModal = ({ isOpen, onClose, employeeId }) => {
	const { pendingTasks, getPendingTasks, assignTask, errors: assignErrors } = useTask();
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredTasks, setFilteredTasks] = useState([]);
	const [visibleErrors, setVisibleErrors] = useState([]);
	const [successMessages, setSuccessMessages] = useState([]); // Nuevo estado para mensajes de éxito

	useEffect(() => {
		if (isOpen) {
			getPendingTasks(employeeId);
		}
	}, [isOpen, employeeId]);

	useEffect(() => {
		const filtered = pendingTasks.filter(
			(task) =>
				task.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
				task.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				task.order_id.toString().includes(searchTerm.toLowerCase()),
		);
		setFilteredTasks(filtered);
	}, [searchTerm, pendingTasks]);

	useEffect(() => {
		setVisibleErrors(assignErrors);
	}, [assignErrors]);

	const handleCloseAlert = (index) => {
		setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
	};

	const handleCloseSuccessAlert = (index) => {
		setSuccessMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
	};

	const handleAssign = async (taskId) => {
		try {
			await assignTask(employeeId, taskId);
			
			const assignedTask = pendingTasks.find(task => task.id === taskId);
			const successMessage = assignedTask 
				? `Tarea asignada: ${assignedTask.product} - Pedido #${assignedTask.order_id}`
				: 'Tarea asignada correctamente';
			
			setSuccessMessages(prev => [...prev, successMessage]);
			
			getPendingTasks(employeeId);

			setTimeout(() => {
				setSuccessMessages(prev => prev.slice(1));
			}, 3000);
			
		} catch (error) {
			console.error('Error al asignar tarea:', error);
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString('es-ES', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
	};

	if (!isOpen) return null;

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
				<ModalContent>
					<ModalHeader className='flex flex-col gap-1'>
						<h3>Asignar Tarea</h3>
						<p className="text-sm text-gray-500">Selecciona una tarea para asignar al empleado</p>
					</ModalHeader>
					<ModalBody>
						{visibleErrors.map((error, i) => (
							<Alert type={true} title='Error' message={error} key={i} onClose={() => handleCloseAlert(i)} />
						))}
						
						<Input
							clearable
							bordered
							fullWidth
							color='primary'
							size='lg'
							placeholder='Buscar por cliente, producto o ID de pedido'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="mb-4"
						/>

						<div className='space-y-3 max-h-96 overflow-y-auto'>
							{filteredTasks.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									{pendingTasks.length === 0 ? 'No hay tareas pendientes disponibles' : 'No se encontraron tareas con ese criterio de búsqueda'}
								</div>
							) : (
								filteredTasks.map((task) => (
									<Card key={task.id} className="border border-gray-200 hover:shadow-md transition-shadow">
										<CardBody className="p-4">
											<div className="flex items-center justify-between">
												<div className="flex-grow space-y-2">
													<div className="flex items-center gap-2 flex-wrap">
														<Chip color="primary" variant="flat" size="sm">
															Pedido #{task.order_id}
														</Chip>
													</div>
													
													<div>
														<p className="font-semibold text-lg text-gray-800">
															{task.client_name}
														</p>
														<p className="text-gray-600">
															<span className="font-medium">Producto:</span> {task.product}
														</p>
													</div>

													{task.delivery_date && (
														<p className="text-sm text-gray-500">
															<span className="font-medium">Fecha de entrega:</span> {formatDate(task.delivery_date)}
														</p>
													)}
													
													{task.order_detail_description && (
														<p className="text-sm text-gray-500">
															<span className="font-medium">Descripción:</span> {task.order_detail_description}
														</p>
													)}
												</div>
												
												<Button 
													color='primary' 
													size='sm' 
													className='ml-4 min-w-20'
													onClick={() => handleAssign(task.id)}
												>
													Asignar
												</Button>
											</div>
										</CardBody>
									</Card>
								))
							)}
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color='danger' variant='ghost' onPress={onClose}>
							Cancelar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			
			{successMessages.map((message, i) => (
				<Alert 
					key={`success-${i}`}
					type={false} 
					title='Éxito' 
					message={message} 
					onClose={() => handleCloseSuccessAlert(i)} 
				/>
			))}
		</>
	);
};

export default AssignTaskModal;
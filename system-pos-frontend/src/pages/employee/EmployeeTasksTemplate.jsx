import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DefaultLayout from '../../layouts/DefaultLayout';
import { useTask } from '../../context/TaskContext';
import Alert from '../../components/ui/Alert';
import CustomTable from '../../components/CustomTable';
import { Chip, Checkbox, DatePicker, Button, Card, CardBody } from '@nextui-org/react';
import AssignTaskModal from './AssignTaskModal';
import { I18nProvider } from '@react-aria/i18n';

const EmployeeTasksTemplate = () => {
	const { employeeId } = useParams();
	const { getEmployeeTasks, updateTaskStatus, errors } = useTask();
	const [tasks, setTasks] = useState([]);
	const [filteredTasks, setFilteredTasks] = useState([]);
	const [visibleErrors, setVisibleErrors] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [employeeInfo, setEmployeeInfo] = useState({ name: '', role: '' });
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dateFilterType, setDateFilterType] = useState('assignment');

	const formatDate = (dateString) => {
		if (!dateString) return 'SIN TERMINAR';
		const date = new Date(dateString);
		return date.toLocaleDateString('es-ES', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
	};

	const applyFilters = (tasksToFilter) => {
        if (!startDate || !endDate) {
            setFilteredTasks(tasksToFilter);
            return;
        }

        const startDateObj = new Date(startDate.year, startDate.month - 1, startDate.day);
        const endDateObj = new Date(endDate.year, endDate.month - 1, endDate.day);

        const filtered = tasksToFilter.filter(task => {
            let taskDate;
            
            if (dateFilterType === 'assignment') {
                taskDate = task.date_assignment ? new Date(task.date_assignment) : null;
            } else {
                taskDate = task.date_completed ? new Date(task.date_completed) : null;
            }

            if (!taskDate) return false;

            return taskDate >= startDateObj && taskDate <= endDateObj;
        });

        setFilteredTasks(filtered);
    };

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const fetchedTasks = await getEmployeeTasks(employeeId);
				setTasks(fetchedTasks);
				applyFilters(fetchedTasks);
				if (fetchedTasks.length > 0) {
					setEmployeeInfo({
						name: fetchedTasks[0].employee_name,
						role: fetchedTasks[0].employee_role,
					});
				}
				setIsLoading(false);
			} catch (error) {
				setVisibleErrors([error.message]);
				setIsLoading(false);
			}
		};
		fetchTasks();
	}, [employeeId]);

	useEffect(() => {
		applyFilters(tasks);
	}, [startDate, endDate, dateFilterType, tasks]);

	useEffect(() => {
		setVisibleErrors(errors);
	}, [errors]);

	const filterTasksByDateRange = () => {
        applyFilters(tasks);
    };

    const clearDateFilters = () => {
        setStartDate(null);
        setEndDate(null);
    };

	const handleCloseAlert = (index) => {
		setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
	};

	const handleUpdateStatus = async (cardId, isCompleted, workType) => {
		try {
			const newStatus = isCompleted ? 'Completado' : 'En progreso';
			await updateTaskStatus(cardId, newStatus, workType);
			
			const updatedTasks = await getEmployeeTasks(employeeId);
			setTasks(updatedTasks);
		} catch (error) {
			setVisibleErrors([error.message]);
		}
	};

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		fetchTasksAfterAssignment();
	};

	const fetchTasksAfterAssignment = async () => {
		try {
			const fetchedTasks = await getEmployeeTasks(employeeId);
			setTasks(fetchedTasks);
		} catch (error) {
			setVisibleErrors([error.message]);
		}
	};	

	const columns = [
		{ name: 'PEDIDO #', uid: 'order_id' },
		{ name: 'FECHA ASIGNACIÓN', uid: 'date_assignment' },
		{ name: 'SALA', uid: 'product' },
		{ name: 'DETALLE', uid: 'description' },
		{ name: 'CLIENTE', uid: 'client_name' },
		{ name: 'ESTADO', uid: 'state' },
		{ name: 'FECHA DE FINALIZACIÓN', uid: 'date_completed' },
	];

	const renderCell = (task, columnKey) => {
		const cellValue = task[columnKey];
		switch (columnKey) {
			case 'order_id':
                return (
                    <div className="flex items-center">
                        <span className="text-sm font-semibold text-primary-600">
                            #{cellValue}
                        </span>
                    </div>
                );
			case 'state':
				return (
                    <div className="flex items-center gap-2">
                        <Chip color={task.state === 'Completado' ? 'success' : 'primary'} variant='flat'>
                            {cellValue}
                        </Chip>
                        <Checkbox	
                            color="primary"
                            isSelected={task.state === 'Completado'}
                            onChange={(isSelected) => handleUpdateStatus(task.id, isSelected, task.employee_role)}
                        >
                        </Checkbox>
                    </div>
                );
			case 'date_assignment':
				return formatDate(cellValue);
			case 'date_completed':
				return formatDate(cellValue);
			default:
				return cellValue;
		}
	};

	return (
		<DefaultLayout>
			<I18nProvider locale="es-ES">
				<div className='p-2'>
					<h2 className='text-gray-800 text-2xl font-bold'>Plantilla de Trabajos</h2>
					{!isLoading && (
						<p className='text-gray-600'>
							Empleado: {employeeInfo.name} - {employeeInfo.role}
						</p>
					)}
				</div>
				{visibleErrors.map((error, i) => (
					<Alert type={true} title='Error' message={error} key={i} onClose={() => handleCloseAlert(i)} />
				))}
				{!isLoading && (
	                <Card className="mb-4">
	                    <CardBody>
	                        <div className="flex flex-wrap gap-4 items-end">
	                            <div className="flex gap-2 items-center">
	                                <label className="text-sm font-medium">Filtrar por:</label>
	                                <select 
	                                    className="px-3 py-2 border rounded-lg"
	                                    value={dateFilterType}
	                                    onChange={(e) => setDateFilterType(e.target.value)}
	                                >
	                                    <option value="assignment">Fecha de Asignación</option>
	                                    <option value="completion">Fecha de Finalización</option>
	                                </select>
	                            </div>
	                            
	                            <div className="flex gap-4 items-center">
	                                <DatePicker
	                                    label="Fecha inicio"
	                                    value={startDate}
	                                    onChange={setStartDate}
	                                    className="w-40"
	                                />
	                                <DatePicker
	                                    label="Fecha fin"
	                                    value={endDate}
	                                    onChange={setEndDate}
	                                    className="w-40"
	                                />
	                            </div>
	                            
	                            <div className="flex gap-2">
	                                <Button 
	                                    color="primary" 
	                                    onClick={clearDateFilters}
	                                    isDisabled={!startDate || !endDate}
	                                >
	                                    Limpiar
	                                </Button>
	                            </div>
	                        </div>
	                        
	                        {(startDate && endDate) && (
	                            <div className="mt-2 text-sm text-gray-600">
	                                Mostrando {filteredTasks.length} de {tasks.length} tareas
	                                {dateFilterType === 'assignment' ? ' por fecha de asignación' : ' por fecha de finalización'}
	                            </div>
	                        )}
	                    </CardBody>
	                </Card>
	            )}
				
				{!isLoading && filteredTasks && filteredTasks.length > 0 && (
	                <CustomTable
	                    elements={filteredTasks}
	                    name='tareas'
	                    columns={columns}
	                    initialVisibleColumns={columns.map((col) => col.uid)}
	                    renderCell={renderCell}
	                    filterProperty='product'
						handleCreate={handleOpenModal}
	                />
	            )}

	            {!isLoading && filteredTasks.length === 0 && tasks.length > 0 && (
	                <div className="text-center py-8 text-gray-500">
	                    No se encontraron tareas en el rango de fechas seleccionado
	                </div>
	            )}

				<AssignTaskModal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					employeeId={employeeId}
				/>
			</I18nProvider>
		</DefaultLayout>
	);
};

export default EmployeeTasksTemplate;

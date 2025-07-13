import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DefaultLayout from '../../layouts/DefaultLayout';
import { useTask } from '../../context/TaskContext';
import Alert from '../../components/ui/Alert';
import CustomTable from '../../components/CustomTable';
import { Chip, Checkbox, DatePicker, Button, Card, CardBody } from '@nextui-org/react';
import AssignTaskModal from './AssignTaskModal';
import { I18nProvider } from '@react-aria/i18n';
import { parseDate } from '@internationalized/date';

const EmployeeTasksTemplate = () => {
    const { employeeId } = useParams();
    const { getEmployeeTasks, updateTaskStatus, errors } = useTask();
    const [tasks, setTasks] = useState([]);
    const [visibleErrors, setVisibleErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [employeeInfo, setEmployeeInfo] = useState({ name: '', role: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dateFilterType, setDateFilterType] = useState('assignment');
    const [appliedFilter, setAppliedFilter] = useState(null);

    const getCurrentWeekRange = () => {
        const now = new Date();
        const currentDay = now.getDay();

        const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
        
        const monday = new Date(now);
        monday.setDate(now.getDate() - daysToMonday);

        const saturday = new Date(monday);
        saturday.setDate(monday.getDate() + 5);
        
        return {
            monday: parseDate(monday.toISOString().split('T')[0]),
            saturday: parseDate(saturday.toISOString().split('T')[0])
        };
    };

    const dateToString = (date) => {
        if (!date) return null;
        return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'SIN TERMINAR';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    useEffect(() => {
        const weekRange = getCurrentWeekRange();
        setStartDate(weekRange.monday);
        setEndDate(weekRange.saturday);
    }, []);

    const fetchTasks = async (useWeekFilter = true) => {
        try {
            setIsLoading(true);
            const options = {
                startDate: useWeekFilter ? null : dateToString(startDate),
                endDate: useWeekFilter ? null : dateToString(endDate),
                dateFilterType,
                useWeekFilter
            };

            const response = await getEmployeeTasks(employeeId, options);
            setTasks(response.tasks);
            setAppliedFilter(response.appliedFilter);

            if (response.tasks.length > 0) {
                setEmployeeInfo({
                    name: response.tasks[0].employee_name,
                    role: response.tasks[0].employee_role,
                });
            }
        } catch (error) {
            setVisibleErrors([error.message]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks(true);
    }, [employeeId]);

    const applyCustomFilter = () => {
        if (startDate && endDate) {
            fetchTasks(false);
        }
    };

    const clearFilters = () => {
        const weekRange = getCurrentWeekRange();
        setStartDate(weekRange.monday);
        setEndDate(weekRange.saturday);
        fetchTasks(true);
    };

    const loadAllTasks = async () => {
        try {
            setIsLoading(true);
            const options = {
                startDate: null,
                endDate: null,
                dateFilterType,
                useWeekFilter: false
            };

            const response = await getEmployeeTasks(employeeId, options);
            setTasks(response.tasks);
            setAppliedFilter(response.appliedFilter);
            setStartDate(null);
            setEndDate(null);
        } catch (error) {
            setVisibleErrors([error.message]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setVisibleErrors(errors);
    }, [errors]);

    const handleCloseAlert = (index) => {
        setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
    };

    const handleUpdateStatus = async (cardId, isCompleted, workType) => {
        try {
            const newStatus = isCompleted ? 'Completado' : 'En progreso';
            await updateTaskStatus(cardId, newStatus, workType);
            
            if (appliedFilter?.isWeekFilter) {
                fetchTasks(true);
            } else if (appliedFilter?.startDate && appliedFilter?.endDate) {
                fetchTasks(false);
            } else {
                loadAllTasks();
            }
        } catch (error) {
            setVisibleErrors([error.message]);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (appliedFilter?.isWeekFilter) {
            fetchTasks(true);
        } else if (appliedFilter?.startDate && appliedFilter?.endDate) {
            fetchTasks(false);
        } else {
            loadAllTasks();
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
                        />
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
                                        onClick={applyCustomFilter}
                                        isDisabled={!startDate || !endDate}
                                    >
                                        Aplicar Filtro
                                    </Button>
                                    <Button
                                        color="secondary"
                                        onClick={clearFilters}
                                        variant="bordered"
                                    >
                                        Semana Actual
                                    </Button>
                                    <Button
                                        color="default"
                                        onClick={loadAllTasks}
                                        variant="bordered"
                                    >
                                        Ver Todas
                                    </Button>
                                </div>
                            </div>

                            {appliedFilter && (
                                <div className="mt-2 text-sm text-gray-600">
                                    {appliedFilter.isWeekFilter ? (
                                        <>
                                            Mostrando tareas de la semana actual ({formatDate(appliedFilter.startDate)} - {formatDate(appliedFilter.endDate)})
                                            {appliedFilter.dateFilterType === 'assignment' ? ' por fecha de asignación' : ' por fecha de finalización'}
                                        </>
                                    ) : appliedFilter.startDate && appliedFilter.endDate ? (
                                        <>
                                            Mostrando tareas del {formatDate(appliedFilter.startDate)} al {formatDate(appliedFilter.endDate)}
                                            {appliedFilter.dateFilterType === 'assignment' ? ' por fecha de asignación' : ' por fecha de finalización'}
                                        </>
                                    ) : (
                                        'Mostrando todas las tareas'
                                    )}
                                    <span className="ml-2 font-medium">({tasks.length} tareas)</span>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                )}

                {!isLoading && tasks && tasks.length > 0 && (
                    <CustomTable
                        elements={tasks}
                        name='tareas'
                        columns={columns}
                        initialVisibleColumns={columns.map((col) => col.uid)}
                        renderCell={renderCell}
                        filterProperty='product'
                        handleCreate={handleOpenModal}
                    />
                )}

                {!isLoading && tasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>No se encontraron tareas para este empleado</p>
                        {appliedFilter && !appliedFilter.isWeekFilter && (
                            <p className="mt-2">Intenta cambiar el rango de fechas o ver todas las tareas</p>
                        )}
                    </div>
                )}

                {isLoading && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando tareas...</p>
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

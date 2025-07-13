import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  Divider,
  Select,
  SelectItem,
  Chip,
  Accordion,
  AccordionItem,
  Breadcrumbs,
  BreadcrumbItem
} from '@nextui-org/react';
import DefaultLayout from '../../layouts/DefaultLayout';
import { usePayment } from '../../context/PaymentContext';
import { useEmployee } from '../../context/EmployeeContext';
import Alert from '../../components/ui/Alert';
import { FaCalendar, FaUser, FaTasks, FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { formatCurrency, formatDate } from '../../utils/formatters';

const CreatePaymentPage = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  
  const {
    paymentData,
    availableConcepts,
    isLoading,
    errors,
    getCompletedTasksForPayment,
    createPayment,
    createManualPayment,
    getAvailableConcepts,
    clearErrors
  } = usePayment();

  const { employees, getEmployeeById } = useEmployee();

  const [employee, setEmployee] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [additionalConcepts, setAdditionalConcepts] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState('');
  const [customConceptName, setCustomConceptName] = useState('');
  const [customConceptValue, setCustomConceptValue] = useState('');
  const [finalAmount, setFinalAmount] = useState(0);
  const [visibleErrors, setVisibleErrors] = useState([]);
  const [isManualPayment, setIsManualPayment] = useState(false);
  const [manualAmount, setManualAmount] = useState('');

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await getAvailableConcepts();

        const foundEmployee = employees.find(emp => emp.id.toString() === employeeId);
        if (foundEmployee) {
          setEmployee(foundEmployee);
          setIsManualPayment(foundEmployee.role === 'Corte de Tela' || foundEmployee.role === 'Corte de Madera');
        } else {
          const employeeData = await getEmployeeById(employeeId);
          setEmployee(employeeData);
          setIsManualPayment(employeeData.role === 'Corte de Tela' || employeeData.role === 'Corte de Madera');
        }

        const today = new Date();
        const fiveDaysAgo = new Date(today);
        fiveDaysAgo.setDate(today.getDate() - 5);
        
        setEndDate(today.toISOString().split('T')[0]);
        setStartDate(fiveDaysAgo.toISOString().split('T')[0]);
        
        clearErrors();
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };

    if (employeeId) {
      loadInitialData();
    }
  }, [employeeId]);

  useEffect(() => {
    setVisibleErrors(errors);
  }, [errors]);

  useEffect(() => {
    if (isManualPayment) {
      const baseAmount = Number(manualAmount) || 0;
      const conceptsSum = additionalConcepts.reduce(
        (sum, concept) => sum + (Number(concept.value) || 0),
        0
      );
      setFinalAmount(baseAmount + conceptsSum);
    } else if (paymentData) {
      const baseAmount = Number(paymentData.summary?.baseAmount) || 0;
      const conceptsSum = additionalConcepts.reduce(
        (sum, concept) => sum + (Number(concept.value) || 0),
        0
      );
      setFinalAmount(baseAmount + conceptsSum);
    }
  }, [isManualPayment, manualAmount, paymentData, additionalConcepts]);

  const handleLoadTasks = async () => {
    if (!startDate || !endDate) {
      return;
    }

    try {
      await getCompletedTasksForPayment(employeeId, startDate, endDate);
      setTasksLoaded(true);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  const handleAddConcept = () => {
    if (selectedConcept) {
      const concept = availableConcepts.find(c => c.id.toString() === selectedConcept);
      if (concept && !additionalConcepts.find(ac => ac.concept_id === concept.id)) {
        setAdditionalConcepts([...additionalConcepts, {
          concept_id: concept.id,
          name: concept.concept_name,
          value: concept.value
        }]);
        setSelectedConcept('');
      }
    } else if (customConceptName && customConceptValue !== '') {
      setAdditionalConcepts([...additionalConcepts, {
        name: customConceptName,
        value: parseInt(customConceptValue) || 0
      }]);
      setCustomConceptName('');
      setCustomConceptValue('');
    }
  };

  const handleRemoveConcept = (index) => {
    setAdditionalConcepts(additionalConcepts.filter((_, i) => i !== index));
  };

  const handleCreatePayment = async () => {
    if (isManualPayment) {
      const paymentPayload = {
        employeeId: employeeId,
        manualAmount: Number(manualAmount) || 0,
        paymentDate: new Date().toISOString().split('T')[0],
        startDate: startDate,
        endDate: endDate,
        additionalConcepts: additionalConcepts.map(concept => ({
          ...concept,
          value: Number(concept.value) || 0
        }))
      };

      console.log('Payload pago manual:', paymentPayload);
      await createManualPayment(paymentPayload);
    } else {
      if (!paymentData) return;

      const paidCards = paymentData.tasks?.map(task => ({
        card_id: task.card_id
      })) || [];

      const paymentPayload = {
        employeeId: employeeId,
        baseAmount: Number(paymentData.summary.baseAmount) || 0,
        paymentDate: new Date().toISOString().split('T')[0],
        additionalConcepts: additionalConcepts.map(concept => ({
          ...concept,
          value: Number(concept.value) || 0
        })),
        paidCards: paidCards
      };

      console.log('Payload pago normal:', paymentPayload);
      await createPayment(paymentPayload);
    }
    
    navigate(`/payments/history/${employeeId}`);
  };

  const handleCloseAlert = (index) => {
    setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  const getConceptColor = (value) => {
    return value >= 0 ? 'success' : 'danger';
  };

  return (
    <DefaultLayout>
      <div className="p-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/employees">Empleados</BreadcrumbItem>
          <BreadcrumbItem>Crear Pago</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      {visibleErrors.map((error, i) => (
        <Alert
          type={true}
          title="Error"
          message={error}
          key={i}
          onClose={() => handleCloseAlert(i)}
        />
      ))}

      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onPress={() => navigate('/employees')}
          >
            <FaArrowLeft />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Crear Pago</h1>
            <p className="text-gray-600">{employee?.name} - {employee?.role}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <FaCalendar className="text-primary" />
              <h3 className="text-lg font-semibold">
                {isManualPayment ? 'Período de Pago Manual' : 'Período de Trabajo'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                type="date"
                label="Fecha de inicio"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                label="Fecha de fin"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              
              {isManualPayment ? (
                <Input
                  type="number"
                  label="Monto a pagar"
                  placeholder="0"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                />
              ) : (
                <Button
                  color="primary"
                  onPress={handleLoadTasks}
                  isLoading={isLoading}
                  isDisabled={!startDate || !endDate}
                >
                  Cargar Tareas
                </Button>
              )}
            </div>
          </CardBody>
        </Card>

        {tasksLoaded && paymentData && !isManualPayment && (
          <Card>
            <CardBody>
              <div className="flex items-center gap-2 mb-4">
                <FaUser className="text-primary" />
                <h3 className="text-lg font-semibold">Resumen del Empleado</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{paymentData.summary.totalTasks}</p>
                  <p className="text-small text-gray-600">Tareas Completadas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{formatCurrency(paymentData.summary.baseAmount)}</p>
                  <p className="text-small text-gray-600">Monto Base</p>
                </div>
                <div className="text-center">
                  <p className="text-small text-gray-600">Período</p>
                  <p className="font-semibold">{formatDate(paymentData.period.start)} - {formatDate(paymentData.period.end)}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {tasksLoaded && paymentData && !isManualPayment && (
          <Accordion>
            <AccordionItem
              key="tasks"
              aria-label="Detalle de tareas"
              title={
                <div className="flex items-center gap-2">
                  <FaTasks className="text-primary" />
                  <span>Detalle de Tareas ({paymentData.tasks?.length || 0})</span>
                </div>
              }
            >
              {paymentData.tasks && paymentData.tasks.length > 0 ? (
                <Table aria-label="Tareas completadas">
                  <TableHeader>
                    <TableColumn>ORDEN</TableColumn>
                    <TableColumn>PRODUCTO</TableColumn>
                    <TableColumn>TIPO DE TRABAJO</TableColumn>
                    <TableColumn>FECHA COMPLETADA</TableColumn>
                    <TableColumn>CLIENTE</TableColumn>
                    <TableColumn>COSTO</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {paymentData.tasks.map((task, index) => (
                      <TableRow key={index}>
                        <TableCell>{task.order_id}</TableCell>
                        <TableCell>{task.product}</TableCell>
                        <TableCell>{task.work_type}</TableCell>
                        <TableCell>{formatDate(task.date_completed)}</TableCell>
                        <TableCell>{task.client_name}</TableCell>
                        <TableCell>{formatCurrency(task.task_cost)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500 py-4">No se encontraron tareas completadas en el período seleccionado</p>
              )}
            </AccordionItem>
          </Accordion>
        )}

        {isManualPayment && startDate && endDate && manualAmount && (
          <Card>
            <CardBody>
              <div className="flex items-center gap-2 mb-4">
                <FaUser className="text-primary" />
                <h3 className="text-lg font-semibold">Resumen del Pago Manual</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{formatCurrency(manualAmount)}</p>
                  <p className="text-small text-gray-600">Monto Base</p>
                </div>
                <div className="text-center">
                  <p className="text-small text-gray-600">Período</p>
                  <p className="font-semibold">{formatDate(startDate)} - {formatDate(endDate)}</p>
                </div>
                <div className="text-center">
                  <p className="text-small text-gray-600">Tipo de Pago</p>
                  <p className="font-semibold">Manual</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <FaPlus className="text-primary" />
              <h3 className="text-lg font-semibold">Conceptos Adicionales</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Select
                label="Concepto predefinido"
                placeholder="Seleccionar concepto"
                value={selectedConcept}
                onChange={(e) => setSelectedConcept(e.target.value)}
              >
                {availableConcepts.map((concept) => (
                  <SelectItem key={concept.id} value={concept.id.toString()}>
                    {concept.concept_name} ({concept.value >= 0 ? '+' : ''}{formatCurrency(concept.value)})
                  </SelectItem>
                ))}
              </Select>
              
              <Input
                label="Concepto personalizado"
                placeholder="Nombre del concepto"
                value={customConceptName}
                onChange={(e) => setCustomConceptName(e.target.value)}
              />
              
              <Input
                type="number"
                label="Valor"
                placeholder="0"
                value={customConceptValue}
                onChange={(e) => setCustomConceptValue(e.target.value)}
              />
              
              <Button
                color="primary"
                onPress={handleAddConcept}
                isDisabled={!selectedConcept && (!customConceptName || customConceptValue === '')}
              >
                Agregar
              </Button>
            </div>

            {additionalConcepts.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Conceptos Agregados:</h4>
                {additionalConcepts.map((concept, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{concept.name}</span>
                      <Chip color={getConceptColor(concept.value)} size="sm">
                        {concept.value >= 0 ? '+' : ''}{formatCurrency(concept.value)}
                      </Chip>
                    </div>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      size="sm"
                      onPress={() => handleRemoveConcept(index)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {((isManualPayment && manualAmount) || (!isManualPayment && paymentData)) && (
          <Card className="bg-primary-50">
            <CardBody>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Resumen del Pago</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monto Base:</span>
                    <span className="font-semibold">
                      {formatCurrency(isManualPayment ? manualAmount : paymentData.summary.baseAmount)}
                    </span>
                  </div>
                  {additionalConcepts.length > 0 && (
                    <div className="flex justify-between">
                      <span>Conceptos Adicionales:</span>
                      <span className="font-semibold">
                        {formatCurrency(additionalConcepts.reduce((sum, c) => sum + c.value, 0))}
                      </span>
                    </div>
                  )}
                  <Divider />
                  <div className="flex justify-between text-xl">
                    <span className="font-bold">Total a Pagar:</span>
                    <span className="font-bold text-primary">{formatCurrency(finalAmount)}</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Button
            color="danger"
            variant="light"
            onPress={() => navigate('/employees')}
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleCreatePayment}
            isLoading={isLoading}
            isDisabled={
              isManualPayment 
                ? (!startDate || !endDate || !manualAmount || finalAmount <= 0)
                : (!tasksLoaded || !paymentData || finalAmount <= 0)
            }
          >
            Crear Pago
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreatePaymentPage;
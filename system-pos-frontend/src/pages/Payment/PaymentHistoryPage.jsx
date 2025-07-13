import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  Pagination,
  Spinner,
  Chip,
  Input,
  Breadcrumbs,
  BreadcrumbItem
} from '@nextui-org/react';
import DefaultLayout from '../../layouts/DefaultLayout';
import { usePayment } from '../../context/PaymentContext';
import { useEmployee } from '../../context/EmployeeContext';
import Alert from '../../components/ui/Alert';
import PaymentDetailsModal from './PaymentDetailsModal';
import { FaHistory, FaEye, FaCalendar, FaSearch, FaArrowLeft, FaPlus } from 'react-icons/fa';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PaymentHistoryPage = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  
  const {
    paymentHistory,
    isLoading,
    errors,
    getEmployeePaymentHistory,
    clearErrors
  } = usePayment();

  const { employees, getEmployeeById } = useEmployee();

  const [employee, setEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [visibleErrors, setVisibleErrors] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const foundEmployee = employees.find(emp => emp.id.toString() === employeeId);
        if (foundEmployee) {
          setEmployee(foundEmployee);
        } else {
          const employeeData = await getEmployeeById(employeeId);
          setEmployee(employeeData);
        }

        await getEmployeePaymentHistory(employeeId, 100, 0);
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
    if (paymentHistory) {
      const filtered = paymentHistory.filter(payment =>
        formatDate(payment.date_paid).toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.total_amount.toString().includes(searchTerm)
      );
      setFilteredHistory(filtered);
    }
  }, [paymentHistory, searchTerm]);

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setDetailsModalOpen(true);
  };

  const handleCloseAlert = (index) => {
    setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  const totalPages = Math.ceil((filteredHistory?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredHistory?.slice(startIndex, endIndex) || [];
  const totalPaid = paymentHistory?.reduce((sum, payment) => sum + payment.total_amount, 0) || 0;
  const averagePayment = paymentHistory?.length > 0 ? totalPaid / paymentHistory.length : 0;

  return (
    <DefaultLayout>
      <div className="p-4">
        <Breadcrumbs>
          <BreadcrumbItem href="/employees">Empleados</BreadcrumbItem>
          <BreadcrumbItem>Historial de Pagos</BreadcrumbItem>
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
            <h1 className="text-2xl font-bold text-gray-800">Historial de Pagos</h1>
            <p className="text-gray-600">{employee?.name} - {employee?.role}</p>
          </div>
        </div>
        <Button
          color="primary"
          startContent={<FaPlus />}
          onPress={() => navigate(`/payments/create/${employeeId}`)}
        >
          Crear Nuevo Pago
        </Button>
      </div>

      <div className="p-4 space-y-6">
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{paymentHistory?.length || 0}</p>
                <p className="text-small text-gray-600">Total de Pagos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{formatCurrency(totalPaid)}</p>
                <p className="text-small text-gray-600">Total Pagado</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">{formatCurrency(averagePayment)}</p>
                <p className="text-small text-gray-600">Promedio por Pago</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Input
              placeholder="Buscar por fecha o monto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<FaSearch className="text-gray-400" />}
              className="max-w-md"
            />
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                {currentItems.length > 0 ? (
                  <>
                    <Table aria-label="Historial de pagos">
                      <TableHeader>
                        <TableColumn>ID PAGO</TableColumn>
                        <TableColumn>FECHA</TableColumn>
                        <TableColumn>MONTO TOTAL</TableColumn>
                        <TableColumn>CONCEPTOS</TableColumn>
                        <TableColumn>ACCIONES</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {currentItems.map((payment) => (
                          <TableRow key={payment.payment_id}>
                            <TableCell>
                              <Chip color="primary" size="sm">
                                #{payment.payment_id}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FaCalendar className="text-gray-400 text-sm" />
                                {formatDate(payment.date_paid)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-success">
                                {formatCurrency(payment.total_amount)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Chip color="default" size="sm">
                                {payment.total_concepts} conceptos
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                color="primary"
                                variant="light"
                                startContent={<FaEye />}
                                onPress={() => handleViewDetails(payment)}
                              >
                                Ver Detalles
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {totalPages > 1 && (
                      <div className="flex justify-center mt-4">
                        <Pagination
                          total={totalPages}
                          page={currentPage}
                          onChange={setCurrentPage}
                          showControls
                          showShadow
                          color="primary"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <FaHistory className="text-4xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? 'No se encontraron pagos que coincidan con la búsqueda' : 'No hay pagos registrados para este empleado'}
                    </p>
                    {!searchTerm && (
                      <Button
                        color="primary"
                        className="mt-4"
                        startContent={<FaPlus />}
                        onPress={() => navigate(`/payments/create/${employeeId}`)}
                      >
                        Crear Primer Pago
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </div>

      <PaymentDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        paymentId={selectedPayment?.payment_id}
      />
    </DefaultLayout>
  );
};

export default PaymentHistoryPage;
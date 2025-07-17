import { useState, useEffect } from 'react';
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
  CardHeader,
  Pagination,
  Spinner,
  Chip,
  Input,
} from '@nextui-org/react';
import { usePayment } from '../../context/PaymentContext';
import { FaMoneyBillWave, FaSearch, FaPrint, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { formatCurrency, formatDate } from '../../utils/formatters';
import DefaultLayout from '../../layouts/DefaultLayout';

const PaymentsGeneralPage = () => {
  const {
    paymentsByDate,
    isLoading,
    errors,
    getPaymentsByDateRange,
    clearErrors
  } = usePayment();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getFirstDayOfMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return firstDay.toISOString().split('T')[0];
  };

  useEffect(() => {
    const today = getTodayDate();
    const firstDay = getFirstDayOfMonth();
    setStartDate(firstDay);
    setEndDate(today);
  }, []);

  useEffect(() => {
    if (paymentsByDate) {
      const filtered = paymentsByDate.filter(payment =>
        payment.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.employee_role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(payment.date_paid).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPayments(filtered);
      setCurrentPage(1);
    }
  }, [paymentsByDate, searchTerm]);

  const handleSearchPayments = async () => {
    if (!startDate || !endDate) {
      alert('Por favor selecciona ambas fechas');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('La fecha de inicio no puede ser mayor a la fecha de fin');
      return;
    }

    try {
      await getPaymentsByDateRange(startDate, endDate);
      setHasSearched(true);
      clearErrors();
    } catch (error) {
      console.error('Error al buscar pagos:', error);
    }
  };

  const handlePrint = () => {
    if (!filteredPayments || filteredPayments.length === 0) {
      alert('No hay datos para imprimir');
      return;
    }

    const totalPayments = filteredPayments.length;
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.total_amount, 0);
    const uniqueEmployees = [...new Set(filteredPayments.map(p => p.employee_id))].length;
    const averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;

    const printContent = `
      <div class="header">
        <h1>Reporte de Pagos</h1>
      </div>
      
      <div class="date-range">
        <p><strong>Período:</strong> ${formatDate(startDate)} - ${formatDate(endDate)}</p>
      </div>

      <div class="summary">
        <div class="summary-item">
          <div class="value">${totalPayments}</div>
          <div class="label">Total Pagos</div>
        </div>
        <div class="summary-item">
          <div class="value">${formatCurrency(totalAmount)}</div>
          <div class="label">Monto Total</div>
        </div>
        <div class="summary-item">
          <div class="value">${uniqueEmployees}</div>
          <div class="label">Empleados</div>
        </div>
        <div class="summary-item">
          <div class="value">${formatCurrency(averagePayment)}</div>
          <div class="label">Promedio</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Empleado</th>
            <th>Rol</th>
            <th>Monto</th>
            <th>ID Pago</th>
          </tr>
        </thead>
        <tbody>
          ${filteredPayments.map((payment) => `
            <tr>
              <td>${formatDate(payment.date_paid)}</td>
              <td>${payment.employee_name}</td>
              <td>${payment.employee_role}</td>
              <td>${formatCurrency(payment.total_amount)}</td>
              <td>#${payment.payment_id}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td colspan="3"><strong>TOTAL</strong></td>
            <td><strong>${formatCurrency(totalAmount)}</strong></td>
            <td><strong>${totalPayments} pagos</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="print-date">
        <p>Reporte generado el: ${formatDate(new Date().toISOString())}</p>
      </div>
    `;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) {
      alert('Por favor permite las ventanas emergentes para imprimir');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reporte de Pagos</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #7828C8;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #1a1a1a;
              font-size: 24px;
            }
            .header h2 {
              margin: 5px 0 0 0;
              color: #666;
              font-size: 16px;
              font-weight: normal;
            }
            .date-range {
              text-align: center;
              margin-bottom: 20px;
              color: #666;
              font-size: 14px;
            }
            .summary {
              display: flex;
              justify-content: space-around;
              margin-bottom: 30px;
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 8px;
              border: 1px solid #e9ecef;
            }
            .summary-item {
              text-align: center;
              flex: 1;
            }
            .summary-item .value {
              font-size: 18px;
              font-weight: bold;
              color: #7828C8;
              margin-bottom: 5px;
            }
            .summary-item .label {
              font-size: 12px;
              color: #666;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #7828C8;
              color: white;
              font-weight: bold;
              text-align: center;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .total-row {
              font-weight: bold;
              background-color: #e3f2fd !important;
            }
            .print-date {
              text-align: right;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body {
                margin: 0;
                padding: 10px;
              }
              .summary {
                background-color: #f8f9fa !important;
                -webkit-print-color-adjust: exact;
              }
              th {
                background-color: #7828C8 !important;
                color: white !important;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    
    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = function() {
        printWindow.close();
      };
    };
  };

  const totalPages = Math.ceil((filteredPayments?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredPayments?.slice(startIndex, endIndex) || [];

  const totalPayments = filteredPayments?.length || 0;
  const totalAmount = filteredPayments?.reduce((sum, payment) => sum + payment.total_amount, 0) || 0;
  const uniqueEmployees = filteredPayments ? [...new Set(filteredPayments.map(p => p.employee_id))].length : 0;
  const averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;

  return (
    <DefaultLayout>
        <div className='p-2'>
            <h2 className='text-gray-800 text-2xl font-bold'>Pagos</h2>
        </div>
        <Card className="mb-6">
            <CardHeader>
            <div className="flex items-center gap-2">
                <FaFilter className="text-primary" />
                <span className="font-semibold">Filtrar por Fecha</span>
            </div>
            </CardHeader>
            <CardBody>
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Fecha Inicio</label>
                <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    startContent={<FaCalendarAlt className="text-gray-400" />}
                />
                </div>
                <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Fecha Fin</label>
                <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    startContent={<FaCalendarAlt className="text-gray-400" />}
                />
                </div>
                <Button
                color="primary"
                onClick={handleSearchPayments}
                isLoading={isLoading}
                startContent={<FaSearch />}
                >
                Buscar Pagos
                </Button>
            </div>
            </CardBody>
        </Card>

        {errors.length > 0 && (
            <Card className="mb-6 border-red-200 bg-red-50">
            <CardBody>
                {errors.map((error, index) => (
                <p key={index} className="text-red-600">{error}</p>
                ))}
            </CardBody>
            </Card>
        )}

        {hasSearched && (
            <>
            <Card className="mb-6">
                <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{totalPayments}</p>
                    <p className="text-sm text-gray-600">Total Pagos</p>
                    </div>
                    <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
                    <p className="text-sm text-gray-600">Monto Total</p>
                    </div>
                    <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{uniqueEmployees}</p>
                    <p className="text-sm text-gray-600">Empleados</p>
                    </div>
                    <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(averagePayment)}</p>
                    <p className="text-sm text-gray-600">Promedio</p>
                    </div>
                </div>
                </CardBody>
            </Card>

            <Card className="mb-6">
                <CardBody>
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <Input
                    placeholder="Buscar por empleado, rol o fecha..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startContent={<FaSearch className="text-gray-400" />}
                    className="max-w-md"
                    />
                    <Button
                    color="secondary"
                    startContent={<FaPrint />}
                    onClick={handlePrint}
                    isDisabled={!filteredPayments || filteredPayments.length === 0}
                    >
                    Imprimir Reporte
                    </Button>
                </div>
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
                        <Table aria-label="Pagos generales">
                            <TableHeader>
                            <TableColumn>FECHA</TableColumn>
                            <TableColumn>EMPLEADO</TableColumn>
                            <TableColumn>ROL</TableColumn>
                            <TableColumn>MONTO</TableColumn>
                            <TableColumn>ID PAGO</TableColumn>
                            </TableHeader>
                            <TableBody>
                            {currentItems.map((payment) => (
                                <TableRow key={payment.payment_id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-gray-400 text-sm" />
                                    {formatDate(payment.date_paid)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-medium">{payment.employee_name}</span>
                                </TableCell>
                                <TableCell>
                                    <Chip color="primary" size="sm" variant="flat">
                                    {payment.employee_role}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <span className="font-bold text-green-600">
                                    {formatCurrency(payment.total_amount)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Chip color="default" size="sm">
                                    #{payment.payment_id}
                                    </Chip>
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
                        <FaMoneyBillWave className="text-4xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                            {searchTerm ? 'No se encontraron pagos que coincidan con la búsqueda' : 'No hay pagos en el rango de fechas seleccionado'}
                        </p>
                        </div>
                    )}
                    </>
                )}
                </CardBody>
            </Card>
            </>
        )}

    </DefaultLayout>
  );
};

export default PaymentsGeneralPage;
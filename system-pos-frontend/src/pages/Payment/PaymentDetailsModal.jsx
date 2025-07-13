import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Chip,
  Spinner,
  Accordion,
  AccordionItem
} from '@nextui-org/react';
import { usePayment } from '../../context/PaymentContext';
import { FaFileInvoice, FaUser, FaCalendar, FaMoneyBillWave, FaList, FaBox } from 'react-icons/fa';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PaymentDetailsModal = ({ isOpen, onClose, paymentId }) => {
  const { isLoading, errors, getPaymentDetails, getPaidProductsByPayment, clearErrors } = usePayment();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paidProducts, setPaidProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (isOpen && paymentId) {
      loadPaymentDetails();
      clearErrors();
    }
  }, [isOpen, paymentId]);

  const loadPaymentDetails = async () => {
    try {
      const details = await getPaymentDetails(paymentId);
      setPaymentDetails(details);
    } catch (error) {
      console.error('Error al cargar detalles del pago:', error);
    }
  };

  const loadPaidProducts = async () => {
    if (paidProducts.length > 0) return;
    
    setLoadingProducts(true);
    try {
      const products = await getPaidProductsByPayment(paymentId);
      setPaidProducts(products);
    } catch (error) {
      console.error('Error al cargar productos pagados:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleClose = () => {
    setPaymentDetails(null);
    setPaidProducts([]);
    clearErrors();
    onClose();
  };

  const getConceptColor = (value) => {
    if (value > 0) return 'success';
    if (value < 0) return 'danger';
    return 'default';
  };

  const getConceptLabel = (value) => {
    if (value > 0) return 'Bonificación';
    if (value < 0) return 'Descuento';
    return 'Neutral';
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
        <ModalContent>
          <ModalBody>
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FaFileInvoice className="text-primary" />
            <span>Detalles del Pago #{paymentId}</span>
          </div>
        </ModalHeader>
        
        <ModalBody>
          {paymentDetails ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-primary" />
                    <h3 className="text-lg font-semibold">Información General</h3>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-400" />
                        <div>
                          <p className="text-small text-gray-600">Empleado</p>
                          <p className="font-semibold">{paymentDetails.employee.name}</p>
                          <p className="text-small text-gray-500">{paymentDetails.employee.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-gray-400" />
                        <div>
                          <p className="text-small text-gray-600">Fecha de Pago</p>
                          <p className="font-semibold">{formatDate(paymentDetails.datePaid)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center md:text-right">
                      <div className="bg-primary-50 rounded-lg p-4">
                        <p className="text-small text-gray-600 mb-1">Monto Total</p>
                        <p className="text-3xl font-bold text-primary">
                          {formatCurrency(paymentDetails.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FaList className="text-primary" />
                    <h3 className="text-lg font-semibold">Desglose de Conceptos</h3>
                  </div>
                </CardHeader>
                <CardBody>
                  {paymentDetails.concepts && paymentDetails.concepts.length > 0 ? (
                    <div className="space-y-4">
                      <Table aria-label="Conceptos del pago" removeWrapper>
                        <TableHeader>
                          <TableColumn>CONCEPTO</TableColumn>
                          <TableColumn>TIPO</TableColumn>
                          <TableColumn align="end">VALOR</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {paymentDetails.concepts.map((concept, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <div className="font-medium">{concept.name}</div>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  color={getConceptColor(concept.value)}
                                  size="sm"
                                  variant="flat"
                                >
                                  {getConceptLabel(concept.value)}
                                </Chip>
                              </TableCell>
                              <TableCell>
                                <div className={`text-right font-semibold ${
                                  concept.value >= 0 ? 'text-success' : 'text-danger'
                                }`}>
                                  {concept.value >= 0 ? '+' : ''}{formatCurrency(concept.value)}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <Divider />

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2">
                          {(() => {
                            const baseWork = paymentDetails.concepts.find(c => c.name === 'Trabajo Realizado');
                            const additionalConcepts = paymentDetails.concepts.filter(c => c.name !== 'Trabajo Realizado');
                            const additionalTotal = additionalConcepts.reduce((sum, c) => sum + c.value, 0);
                            
                            return (
                              <>
                                {baseWork && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Trabajo Realizado:</span>
                                    <span className="font-medium">{formatCurrency(baseWork.value)}</span>
                                  </div>
                                )}
                                {additionalTotal !== 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Conceptos Adicionales:</span>
                                    <span className={`font-medium ${additionalTotal >= 0 ? 'text-success' : 'text-danger'}`}>
                                      {additionalTotal >= 0 ? '+' : ''}{formatCurrency(additionalTotal)}
                                    </span>
                                  </div>
                                )}
                                <Divider />
                                <div className="flex justify-between text-lg">
                                  <span className="font-bold">Total Pagado:</span>
                                  <span className="font-bold text-primary">
                                    {formatCurrency(paymentDetails.totalAmount)}
                                  </span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No se encontraron conceptos para este pago</p>
                    </div>
                  )}
                </CardBody>
              </Card>

              <Card>
                <Accordion>
                  <AccordionItem
                    key="products"
                    aria-label="Productos Pagados"
                    title={
                      <div className="flex items-center gap-2">
                        <FaBox className="text-primary" />
                        <span className="text-lg font-semibold">Productos Pagados</span>
                      </div>
                    }
                    onPress={loadPaidProducts}
                  >
                    {loadingProducts ? (
                      <div className="flex justify-center py-4">
                        <Spinner size="sm" />
                        <span className="ml-2">Cargando productos...</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {paidProducts.length > 0 ? (
                          <Table aria-label="Productos pagados" removeWrapper>
                            <TableHeader>
                              <TableColumn>PRODUCTO</TableColumn>
                              <TableColumn>TIPO DE TRABAJO</TableColumn>
                              <TableColumn>CANTIDAD TAREAS</TableColumn>
                              <TableColumn align="end">COSTO UNITARIO</TableColumn>
                              <TableColumn align="end">SUBTOTAL</TableColumn>
                            </TableHeader>
                            <TableBody>
                              {paidProducts.map((product, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <div className="font-medium">{product.product}</div>
                                  </TableCell>
                                  <TableCell>
                                    <Chip color="default" size="sm">
                                      {product.work_type}
                                    </Chip>
                                  </TableCell>
                                  <TableCell>
                                    <span className="font-medium">{product.cantidad_tareas}</span>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-right">
                                      {formatCurrency(product.cost)}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-right font-semibold text-success">
                                      {formatCurrency(product.cost * product.cantidad_tareas)}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-500">No se encontraron productos para este pago</p>
                          </div>
                        )}
                      </div>
                    )}
                  </AccordionItem>
                </Accordion>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No se pudieron cargar los detalles del pago</p>
            </div>
          )}

          {/* Mostrar errores */}
          {errors.length > 0 && (
            <Card className="bg-danger-50 border-danger-200">
              <CardBody>
                <div className="text-danger">
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button color="primary" onPress={handleClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentDetailsModal;
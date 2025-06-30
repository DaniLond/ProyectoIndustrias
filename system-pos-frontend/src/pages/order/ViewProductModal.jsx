import React, { useState } from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip
} from '@nextui-org/react';
import { FaEye } from 'react-icons/fa';
import { useOrder } from '../../context/OrderContext';
import TaskDetailModal from './TaskDetailModal';

const ViewProductModal = ({ isOpen, onClose, products }) => {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedProductTasks, setSelectedProductTasks] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedProductStatus, setSelectedProductStatus] = useState('');
  
  const { getOrderDetailTasks } = useOrder();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado':
        return 'success';
      case 'En progreso':
        return 'warning';
      case 'Pendiente':
        return 'danger';
      default:
        return 'default';
    }
  };

  const handleViewTasks = async (orderDetailId, productName) => {
    try {
      const result = await getOrderDetailTasks(orderDetailId);
      setSelectedProductTasks(result.tasks);
      setSelectedProductStatus(result.orderDetailStatus);
      setSelectedProductName(productName);
      setTaskModalOpen(true);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            Productos de la Orden
          </ModalHeader>
          
          <ModalBody>
            {products && products.length > 0 ? (
              <Table aria-label="Tabla de productos">
                <TableHeader>
                  <TableColumn>PRODUCTO</TableColumn>
                  <TableColumn>DESCRIPCIÓN</TableColumn>
                  <TableColumn>ESTADO</TableColumn>
                  <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.product}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-600 truncate">
                            {product.description || 'Sin descripción'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          color={getStatusColor(product.state)} 
                          variant="flat"
                        >
                          {product.state}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Tooltip content="Ver tareas del producto">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="primary"
                            onPress={() => handleViewTasks(product.id, product.product)}
                          >
                            <FaEye />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay productos en esta orden
              </div>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button 
              color="primary" 
              variant="light" 
              onPress={onClose}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TaskDetailModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        tasks={selectedProductTasks}
        orderDetailStatus={selectedProductStatus}
        productName={selectedProductName}
      />
    </>
  );
};

export default ViewProductModal;

import React from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@nextui-org/react';

const TaskDetailModal = ({ isOpen, onClose, tasks, orderDetailStatus, productName }) => {
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

  const getStatusText = (status) => {
    const statusMap = {
      'Completado': 'Completado',
      'En progreso': 'En Progreso',
      'Pendiente': 'Pendiente'
    };
    return statusMap[status] || status;
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <span>Tareas del Producto: {productName}</span>
          <Chip 
            color={getStatusColor(orderDetailStatus)} 
            variant="flat"
          >
            {getStatusText(orderDetailStatus)}
          </Chip>
        </ModalHeader>
        
        <ModalBody>
          {tasks && tasks.length > 0 ? (
            <Table aria-label="Tabla de tareas">
              <TableHeader>
                <TableColumn>TIPO DE TRABAJO</TableColumn>
                <TableColumn>EMPLEADO</TableColumn>
                <TableColumn>ESTADO</TableColumn>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      {task.work_type}
                    </TableCell>
                    <TableCell>
                      {task.employee_name || (
                        <span className="text-gray-400 italic">
                          Sin asignar
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        color={getStatusColor(task.state)} 
                        variant="flat"
                        size="sm"
                      >
                        {getStatusText(task.state)}
                      </Chip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay tareas disponibles
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
  );
};

export default TaskDetailModal;
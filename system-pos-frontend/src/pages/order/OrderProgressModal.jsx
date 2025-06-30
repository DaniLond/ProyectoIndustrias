import React from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button 
} from '@nextui-org/react';
import OrderProgressCard from './OrderProgressCard';

const OrderProgressModal = ({ isOpen, onClose, progressData, orderInfo }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">Progreso de la Orden</h3>
          {orderInfo && (
            <p className="text-sm text-gray-600">
              Cliente: {orderInfo.client_name} | ID: #{orderInfo.id}
            </p>
          )}
        </ModalHeader>
        
        <ModalBody className="flex justify-center">
          <OrderProgressCard progressData={progressData} />
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

export default OrderProgressModal;
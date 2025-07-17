import React, { useState, useRef } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { FaPrint } from 'react-icons/fa';

const PrintOrderModal = ({ isOpen, onClose, order, orderProducts }) => {
  const [isLoading, setIsLoading] = useState(false);
  const printRef = useRef();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handlePrint = () => {
    setIsLoading(true);
    
    const printWindow = window.open('', '_blank');
    const printContent = printRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pedido ${order?.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #7828C8;
              margin-bottom: 10px;
            }
            .order-title {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .order-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .info-section {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #7828C8;
            }
            .info-title {
              font-weight: bold;
              color: #7828C8;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .info-item {
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
              color: #555;
            }
            .products-section {
              margin-top: 30px;
            }
            .products-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #7828C8;
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
            }
            .products-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
            }
            .product-item {
              background: #f8f9fa;
              padding: 12px;
              border-radius: 6px;
              border-left: 4px solid #006FEE;
              break-inside: avoid;
            }
            .product-name {
              font-weight: bold;
              color: #333;
              margin-bottom: 6px;
              font-size: 14px;
              line-height: 1.3;
            }
            .product-description {
              color: #666;
              font-style: italic;
              font-size: 12px;
              margin-bottom: 8px;
              line-height: 1.3;
            }
            .product-state {
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: bold;
              display: inline-block;
              text-align: center;
              width: 100%;
              box-sizing: border-box;
            }
            .state-pendiente {
              background-color: #fff3cd;
              color: #856404;
            }
            .state-en-progreso {
              background-color: #cce5ff;
              color: #0056b3;
            }
            .state-completado {
              background-color: #d4edda;
              color: #155724;
            }
            .state-despachado {
              background-color: #e2e3e5;
              color: #383d41;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            .no-products {
              text-align: center;
              color: #666;
              font-style: italic;
              padding: 20px;
              grid-column: 1 / -1;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
              .products-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
              }
              .product-item {
                padding: 10px;
              }
            }
            @media (max-width: 768px) {
              .products-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            @media (max-width: 480px) {
              .products-grid {
                grid-template-columns: 1fr;
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
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      setIsLoading(false);
    }, 500);
  };

  const getStateClass = (state) => {
    switch (state?.toLowerCase()) {
      case 'pendiente':
        return 'state-pendiente';
      case 'en progreso':
        return 'state-en-progreso';
      case 'completado':
        return 'state-completado';
      case 'despachado':
        return 'state-despachado';
      default:
        return 'state-pendiente';
    }
  };

  if (!order) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "p-0",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-bold">Vista previa de impresión</h3>
          <p className="text-sm text-gray-600">Pedido #{order.id}</p>
        </ModalHeader>
        
        <ModalBody>
          <div ref={printRef} className="p-6 bg-white">
            <div className="header">
              <div className="company-name">Industrias Londoño</div>
              <div className="order-title">PEDIDO #{order.id}</div>
            </div>

            <div className="order-info">
              <div className="info-section">
                <div className="info-title">Información del Cliente</div>
                <div className="info-item">
                  <span className="info-label">Cliente:</span> {order.client_name}
                </div>
                <div className="info-item">
                  <span className="info-label">Dirección:</span> {order.address}
                </div>
              </div>

              <div className="info-section">
                <div className="info-title">Información del Pedido</div>
                <div className="info-item">
                  <span className="info-label">Fecha de realización:</span> {formatDate(order.date_realization)}
                </div>
                <div className="info-item">
                  <span className="info-label">Fecha de entrega:</span> {formatDate(order.delivery_date)}
                </div>
                <div className="info-item">
                  <span className="info-label">Estado:</span> {order.state_name}
                </div>
              </div>
            </div>

            {order.detail && (
              <div className="info-section" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
                <div className="info-title">Detalle del Pedido</div>
                <div className="info-item">{order.detail}</div>
              </div>
            )}

            <div className="products-section">
              <div className="products-title">
                Productos ({orderProducts?.length || 0})
              </div>
              
              {orderProducts && orderProducts.length > 0 ? (
                <div className="products-grid">
                  {orderProducts.map((product, index) => (
                    <div key={product.id} className="product-item">
                      <div className="product-name">
                        {index + 1}. {product.product}
                      </div>
                      {product.description && (
                        <div className="product-description">
                          {product.description}
                        </div>
                      )}
                      <div className={`product-state ${getStateClass(product.state)}`}>
                        {product.state}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-products">
                  No hay productos en este pedido
                </div>
              )}
            </div>

            <div className="footer">
              <p>Documento generado el {formatDate(new Date().toISOString())}</p>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button 
            color="danger" 
            variant="light" 
            onPress={onClose}
          >
            Cerrar
          </Button>
          <Button 
            color="primary" 
            onPress={handlePrint}
            isLoading={isLoading}
            startContent={!isLoading && <FaPrint />}
          >
            {isLoading ? 'Preparando...' : 'Imprimir'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PrintOrderModal;
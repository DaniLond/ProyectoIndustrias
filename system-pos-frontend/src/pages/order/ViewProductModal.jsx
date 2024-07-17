// src/components/orders/ProductsModal.jsx
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';

function ViewProductModal({ isOpen, onClose, products }) {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalContent>
				<ModalHeader>Productos del Pedido</ModalHeader>
				<ModalBody>
					{products.map((product, index) => (
						<div key={index}>
							<p>
								<strong>Producto:</strong> {product.product}
							</p>
							<p>
								<strong>Descripción:</strong> {product.description}
							</p>
							<p>
								<strong>Estado:</strong> {product.state}
							</p>
							<hr />
						</div>
					))}
				</ModalBody>
				<ModalFooter>
					<Button color='primary' onPress={onClose}>
						Cerrar
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

export default ViewProductModal;

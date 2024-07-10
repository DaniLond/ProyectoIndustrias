import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useProducts } from '../../context/ProductContext';

import Alert from '../../components/ui/Alert';
import CustomInput from '../../components/ui/CustomInput';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';

function ProductForm({ isOpen, onClose, initialData }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const { createProduct, updateProduct, errors: formErrors } = useProducts();
	const [visibleErrors, setVisibleErrors] = useState([]);

	useEffect(() => {
		setVisibleErrors(formErrors);
	}, [formErrors]);

	const onSubmit = handleSubmit(async (values) => {
		values.name = values.name.trim();
		if (initialData) {
			await updateProduct(initialData.name, { ...values });
		} else {
			await createProduct({ ...values });
		}
		onClose();
	});

	const handleCloseAlert = (index) => {
		setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onOpenChange={onClose}
				size='lg'
				isDismissable={false}
				isKeyboardDismissDisabled={false}
				placement='top-center'
			>
				<ModalContent>
					{(onClose) => (
						<>
							<form onSubmit={onSubmit}>
								<ModalHeader className='flex flex-col gap-1'>
									{initialData ? 'Editar Producto' : 'Añadir Producto'}
								</ModalHeader>
								<ModalBody>
									{visibleErrors.map((error, i) => (
										<Alert
											type={true}
											title='Error en el formulario de productos'
											message={error}
											key={i}
											onClose={() => handleCloseAlert(i)}
										/>
									))}
									<CustomInput
										type='text'
										register={register('name', {
											validate: {
												trimmedLength: (value) => {
													const trimmedValue = value.trim();
													if (trimmedValue.length === 0) {
														return 'El nombre del producto es obligatorio';
													}
													if (trimmedValue.length < 3) {
														return 'El nombre del producto debe tener un mínimo de 3 caracteres';
													}
													if (trimmedValue.length > 100) {
														return 'El nombre del producto no puede exceder los 100 caracteres';
													}
													return true;
												},
											},
										})}
										label='Nombre del producto'
										placeholder='Ingrese el nombre del producto'
										name='name'
										errorMessage={errors.name?.message}
										errors={errors}
										defaultValue={initialData?.name || ''}
										autoFocus
									/>
									<CustomInput
										type='number'
										register={register('wood_cut_price', {
											required: 'El precio del corte de madera es obligatorio',
											min: {
												value: 0,
												message: 'El precio del corte de madera debe ser mayor a 0',
											},
										})}
										label='Precio corte de madera'
										placeholder='Ingrese el precio del corte de madera'
										name='wood_cut_price'
										errorMessage={errors.wood_cut_price?.message}
										errors={errors}
										defaultValue={initialData?.wood_cut_price || ''}
									/>
									<CustomInput
										type='number'
										register={register('fabric_cut_price', {
											required: 'El precio del corte de tela es obligatorio',
											min: {
												value: 0,
												message: 'El precio del corte de tela debe ser mayor a 0',
											},
										})}
										label='Precio corte de tela'
										placeholder='Ingrese el precio del corte de tela'
										name='fabric_cut_price'
										errorMessage={errors.fabric_cut_price?.message}
										errors={errors}
										defaultValue={initialData?.fabric_cut_price || ''}
									/>
									<CustomInput
										type='number'
										register={register('sewing_price', {
											required: 'El precio de la costura es obligatorio',
											min: {
												value: 0,
												message: 'El precio de la costura debe ser mayor a 0',
											},
										})}
										label='Precio de la costura'
										placeholder='Ingrese el precio de la costura'
										name='sewing_price'
										errorMessage={errors.sewing_price?.message}
										errors={errors}
										defaultValue={initialData?.sewing_price || ''}
									/>
									<CustomInput
										type='number'
										register={register('upholsterer_price', {
											required: 'El precio del tapizado es obligatorio',
											min: {
												value: 0,
												message: 'El precio del tapizado debe ser mayor a 0',
											},
										})}
										label='Precio del tapizado'
										placeholder='Ingrese el precio del tapizado'
										name='upholsterer_price'
										errorMessage={errors.upholsterer_price?.message}
										errors={errors}
										defaultValue={initialData?.upholsterer_price || ''}
									/>
									<CustomInput
										type='number'
										register={register('assembled_price', {
											required: 'El precio del ensamblado es obligatorio',
											min: {
												value: 0,
												message: 'El precio del ensamblado debe ser mayor a 0',
											},
										})}
										label='Precio del ensamblado'
										placeholder='Ingrese el precio del ensamblado'
										name='assembled_price'
										errorMessage={errors.assembled_price?.message}
										errors={errors}
										defaultValue={initialData?.assembled_price || ''}
									/>
									<CustomInput
										type='number'
										register={register('sales_price', {
											required: 'El precio de venta es obligatorio',
											min: {
												value: 0,
												message: 'El precio de venta debe ser mayor a 0',
											},
										})}
										label='Precio de venta'
										placeholder='Ingrese el precio de venta'
										name='sales_price'
										errorMessage={errors.sales_price?.message}
										errors={errors}
										defaultValue={initialData?.sales_price || ''}
									/>
								</ModalBody>
								<ModalFooter>
									<Button color='danger' variant='ghost' radius='sm' onPress={onClose}>
										Cancelar
									</Button>
									<Button type='submit' color='primary' radius='sm'>
										Guardar
									</Button>
								</ModalFooter>
							</form>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}

export default ProductForm;

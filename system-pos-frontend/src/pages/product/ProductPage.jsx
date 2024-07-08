import { useState, useEffect, useCallback } from 'react';
import { useProducts } from '../../context/ProductContext';
import DefaultLayout from '../../layouts/DefaultLayout';
import ProductForm from './ProductForm';

import Alert from '../../components/ui/Alert';
import CustomTable from '../../components/CustomTable';
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem } from '@nextui-org/react';

import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

function ProductPage() {
	const { products, getProducts, deleteProduct, errors: productErrors } = useProducts();
	const [visibleErrors, setVisibleErrors] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

	useEffect(() => {
		getProducts();
	}, []);

	useEffect(() => {
		setVisibleErrors(productErrors);
	}, [productErrors]);

	const handleCreate = () => {
		setSelectedProduct(null);
		setIsModalOpen(true);
	};

	const handleEdit = (product) => {
		setSelectedProduct(product);
		setIsModalOpen(true);
	};

	const handleDelete = async (name) => {
		await deleteProduct(name);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const handleCloseAlert = (index) => {
		setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
	};

	// --- CONFIGURACIÓN DE LA TABLA DE PRODUCTOS ---
	const columns = [
		{ name: 'PRODUCTO', uid: 'name', sortable: true },
		{ name: 'PRECIO DE VENTA', uid: 'sales_price', sortable: true },
		{ name: 'CORTE DE MADERA', uid: 'wood_cut_price', sortable: true },
		{ name: 'CORTE DE TELA', uid: 'fabric_cut_price', sortable: true },
		{ name: 'COSTURA', uid: 'sewing_price', sortable: true },
		{ name: 'TAPICERA', uid: 'upholsterer_price', sortable: true },
		{ name: 'ENSAMBLADO', uid: 'assembled_price', sortable: true },
		{ name: 'ACCIONES', uid: 'actions' },
	];

	const initialVisibleColumns = [
		'name',
		'sales_price',
		'wood_cut_price',
		'fabric_cut_price',
		'sewing_price',
		'upholsterer_price',
		'assembled_price',
		'actions',
	];

	const formatterPrice = new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 1,
	});

	const renderCell = useCallback((product, columnKey) => {
		const cellValue = product[columnKey];

		switch (columnKey) {
			case 'sales_price':
			case 'wood_cut_price':
			case 'fabric_cut_price':
			case 'sewing_price':
			case 'upholsterer_price':
			case 'assembled_price':
				return <span>{formatterPrice.format(cellValue)}</span>;

			case 'actions':
				return (
					<div className='relative flex justify-center items-center'>
						<Dropdown className='bg-background border-1 border-default-200'>
							<DropdownTrigger>
								<Button isIconOnly radius='full' size='sm' variant='light'>
									<BsThreeDotsVertical className='text-default-500' />
								</Button>
							</DropdownTrigger>
							<DropdownMenu color='primary' variant='bordered' disallowEmptySelection>
								<DropdownItem startContent={<FaEdit />} onClick={() => handleEdit(product)}>
									Editar
								</DropdownItem>
								<DropdownItem
									className='text-danger'
									color='danger'
									startContent={<MdDelete />}
									onClick={() => handleDelete(product.name)}
								>
									Eliminar
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				);

			default:
				return cellValue;
		}
	}, []);

	return (
		<DefaultLayout>
			{visibleErrors.map((error, i) => (
				<Alert type={true} title='Error' message={error} key={i} onClose={() => handleCloseAlert(i)} />
			))}
			<div className='p-2'>
				<h2 className='text-gray-800 text-2xl font-bold'>Productos</h2>
			</div>
			<CustomTable
				elements={products}
				name='productos'
				columns={columns}
				initialVisibleColumns={initialVisibleColumns}
				handleCreate={handleCreate}
				Modal={ProductForm}
				renderCell={renderCell}
			/>
			{isModalOpen && <ProductForm isOpen={isModalOpen} onClose={handleModalClose} initialData={selectedProduct} />}
		</DefaultLayout>
	);
}

export default ProductPage;

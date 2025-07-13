import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layouts/DefaultLayout';
import CustomTable from '../../components/CustomTable';
import ProductModal from './ProductModal';
import Alert from '../../components/ui/Alert';
import CustomInput from '../../components/ui/CustomInput';
import CustomSelect from '../../components/ui/CustomSelect';
import { Button } from '@nextui-org/react';
import { useOrder } from '../../context/OrderContext';
import { useClient } from '../../context/ClientContext';
import { useProducts } from '../../context/ProductContext';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

function OrderEditPage() {
    const { id } = useParams();
    const { getOrder, updateOrder, getProductToOrder, errors: orderErrors } = useOrder();
    const { clients, getClients } = useClient();
    const { products, getProducts } = useProducts();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const [visibleErrors, setVisibleErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [orderData, setOrderData] = useState({
        detail: '',
        client: '',
        delivery_date: '',
        address: '',
        id_state: '',
        products: [],
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nextProductId, setNextProductId] = useState(1);
    const [editingProduct, setEditingProduct] = useState(null);

    const orderStates = [
        { value: 'Pendiente', label: 'Pendiente' },
        { value: 'En progreso', label: 'En progreso' },
        { value: 'Completado', label: 'Completado' }
    ];

    useEffect(() => {
        const loadOrderData = async () => {
            try {
                setIsLoading(true);
                await getClients();
                await getProducts();
                
                const order = await getOrder(id);
                const orderProducts = await getProductToOrder(id);
                
                if (order && orderProducts) {
                    const formattedDate = new Date(order.delivery_date).toISOString().split('T')[0];
                    
                    setValue('detail', order.detail || '');
                    setValue('client', order.client);
                    setValue('delivery_date', formattedDate);
                    setValue('address', order.address || '');
                    setValue('id_state', order.id_state);

                    const productsWithIds = orderProducts.map((product, index) => ({
                        ...product,
                        id: index + 1,
                        product_name: product.product,
                        detail: product.description || 'opcional'
                    }));
                    
                    setOrderData({
                        detail: order.detail || '',
                        client: order.client,
                        delivery_date: formattedDate,
                        address: order.address || '',
                        id_state: order.id_state,
                        products: productsWithIds,
                    });
                    
                    setNextProductId(productsWithIds.length + 1);
                }
            } catch (error) {
                setVisibleErrors([error.message || 'Error al cargar los datos de la orden']);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            loadOrderData();
        }
    }, [setValue]);

    useEffect(() => {
        setVisibleErrors(orderErrors);
    }, [orderErrors]);

    const handleAddOrEditProduct = (products) => {
        if (editingProduct) {
            setOrderData((prevData) => ({
                ...prevData,
                products: prevData.products.map((p) => 
                    p.id === editingProduct.id ? { ...p, ...products } : p
                ),
            }));
        } else {
            setOrderData((prevData) => {
                const updatedProducts = products.map((p, index) => ({
                    ...p,
                    id: nextProductId + index,
                    order_detail_id: null,
                }));

                return {
                    ...prevData,
                    products: [...prevData.products, ...updatedProducts],
                };
            });

            setNextProductId(nextProductId + products.length);
        }

        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = (productId) => {
        setOrderData((prevData) => ({
            ...prevData,
            products: prevData.products.filter((p) => p.id !== productId),
        }));
    };

    const handleCreateProduct = () => {
        setIsModalOpen(true);
    };

    const columns = [
        { uid: 'id', name: 'ID', sortable: true },
        { uid: 'product_name', name: 'Producto', sortable: true },
        { uid: 'detail', name: 'Detalle' },
        { uid: 'state', name: 'Estado' },
        { uid: 'actions', name: 'Acciones' },
    ];

    const renderCell = (product, columnKey) => {
        switch (columnKey) {
            case 'actions':
                return (
                    <div className='relative flex justify-center items-center gap-2'>
                        <Button 
                            isIconOnly 
                            size='sm' 
                            variant='light' 
                            color='primary' 
                            onPress={() => handleEditProduct(product)}
                        >
                            <FaEdit />
                        </Button>
                        <Button 
                            isIconOnly 
                            size='sm' 
                            variant='light' 
                            color='danger' 
                            onPress={() => handleDeleteProduct(product.id)}
                        >
                            <MdDelete />
                        </Button>
                    </div>
                );
            case 'state':
                return product.state || 'Pendiente';
            default:
                return product[columnKey];
        }
    };

    const onSubmit = async (data) => {
        try {
            const productsToUpdate = orderData.products
                .filter(p => p.order_detail_id)
                .map(p => ({
                    order_detail_id: p.order_detail_id,
                    description: p.detail
                }));

            const updateData = {
                id: parseInt(id),
                detail: data.detail,
                delivery_date: data.delivery_date,
                address: data.address,
                id_state: data.id_state,
                productsToUpdate
            };

            await updateOrder(id, updateData);
            navigate('/orders');
        } catch (error) {
            setVisibleErrors([error.message || 'Error al actualizar la orden']);
        }
    };

    const handleCloseAlert = (index) => {
        setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
    };

    const handleCancel = () => {
        navigate('/orders');
    };

    if (isLoading) {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Cargando datos de la orden...</div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            {visibleErrors.map((error, i) => (
                <Alert 
                    key={i} 
                    type={true} 
                    title='Error' 
                    message={error} 
                    onClose={() => handleCloseAlert(i)} 
                />
            ))}

            <div className='p-2'>
                <h2 className='text-gray-800 text-2xl font-bold'>Editar Pedido #{id}</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-10 flex flex-col items-center'>
                <CustomSelect
                    register={register('client', { required: 'El cliente es obligatorio' })}
                    label='Cliente'
                    name='client'
                    placeholder='Seleccione un cliente'
                    errorMessage={errors.client?.message}
                    errors={errors}
                    options={clients.map((client) => ({ value: client.id, label: client.client_name }))}
                    disabled={true} // El cliente no debería cambiar en edición
                />

                <CustomInput
                    type='text'
                    register={register('detail')}
                    label='Detalle'
                    placeholder='Ingrese el detalle del pedido'
                    name='detail'
                    errorMessage={errors.detail?.message}
                    errors={errors}
                />

                <CustomInput
                    type='date'
                    register={register('delivery_date', { required: 'La fecha de entrega es obligatoria' })}
                    label='Fecha de entrega'
                    placeholder='Seleccione la fecha de entrega'
                    name='delivery_date'
                    errorMessage={errors.delivery_date?.message}
                    errors={errors}
                />

                <CustomInput
                    type='text'
                    register={register('address')}
                    label='Dirección'
                    placeholder='Ingrese la dirección de entrega'
                    name='address'
                    errorMessage={errors.address?.message}
                    errors={errors}
                />

                <CustomSelect
                    register={register('id_state', { required: 'El estado es obligatorio' })}
                    label='Estado'
                    name='id_state'
                    placeholder='Seleccione el estado'
                    errorMessage={errors.id_state?.message}
                    errors={errors}
                    options={orderStates}
                />

                <CustomTable
                    elements={orderData.products}
                    name='producto'
                    columns={columns}
                    initialVisibleColumns={['id', 'product_name', 'detail', 'state', 'actions']}
                    handleCreate={handleCreateProduct}
                    renderCell={renderCell}
                    filterProperty='product_name'
                />

                <div className='flex space-x-4'>
                    <Button color='danger' variant='ghost' onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button type='submit' color='primary'>
                        Actualizar
                    </Button>
                </div>
            </form>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                }}
                onAddProduct={handleAddOrEditProduct}
                products={products}
                editingProduct={editingProduct}
            />
        </DefaultLayout>
    );
}

export default OrderEditPage;
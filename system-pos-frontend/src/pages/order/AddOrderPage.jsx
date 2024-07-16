import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { useNavigate } from 'react-router-dom';

function OrderRegistrationPage() {
  const { createOrder, errors: orderErrors } = useOrder();
  const { clients, getClients } = useClient();
  const { products, getProducts } = useProducts();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [visibleErrors, setVisibleErrors] = useState([]);
  const [orderData, setOrderData] = useState({
    detail: '',
    client: '',
    delivery_date: '',
    address: '',
    products: []
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getClients();
    getProducts();
  }, []);


  useEffect(() => {
    setVisibleErrors(orderErrors);
  }, [orderErrors]);

  const columns = [
    { uid: 'product_name', name: 'Producto', sortable: true },
    { uid: 'quantity', name: 'Cantidad', sortable: true },
    { uid: 'detail', name: 'Detalle' },
    { uid: 'actions', name: 'Acciones' }
  ];

  const handleAddProduct = (product) => {
    setOrderData(prevData => ({
      ...prevData,
      products: [...prevData.products, product]
    }));
    setIsModalOpen(false);
  };

  const handleCreateProduct = () => {
    setIsModalOpen(true);
  };

  const renderCell = (product, columnKey) => {
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex justify-center items-center">
            <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDeleteProduct(product.product_name)}>
              <MdDelete />
            </Button>

          </div>
        );
      default:
        return product[columnKey];
    }
  };



  const handleDeleteProduct = (productId) => {
    setOrderData(prevData => ({
      ...prevData,
      products: prevData.products.filter(p => p.product_name !== productId)
    }));
  };

  const onSubmit = async (data) => {
    try {
      await createOrder({ ...orderData, ...data });
      navigate('/orders')
    } catch (error) {
      setVisibleErrors([error.message]);
    }
  };

  const handleCloseAlert = (index) => {
    setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    navigate('/orders');
  };

  return (
    <DefaultLayout>
      {visibleErrors.map((error, i) => (
        <Alert key={i} type={true} title='Error' message={error} onClose={() => handleCloseAlert(i)} />
      ))}
      <div className='p-2'>
        <h2 className='text-gray-800 text-2xl font-bold'>Registrar Pedido</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-10 flex flex-col items-center'>
        <CustomSelect
          register={register("client", { required: "El cliente es obligatorio" })}
          label="Cliente"
          name="client"
          placeholder="Seleccione un cliente"
          errorMessage={errors.client?.message}
          errors={errors}
          options={clients.map(client => ({ value: client.id, label: client.client_name }))}
        />
        <CustomInput
          type="text"
          register={register("detail", { required: "El detalle es obligatorio" })}
          label="Detalle"
          placeholder="Ingrese el detalle del pedido"
          name="detail"
          errorMessage={errors.detail?.message}
          errors={errors}
        />
        <CustomInput
          type="date"
          register={register("delivery_date", { required: "La fecha de entrega es obligatoria" })}
          label="Fecha de entrega"
          placeholder="Seleccione la fecha de entrega"
          name="delivery_date"
          errorMessage={errors.delivery_date?.message}
          errors={errors}
        />
        <CustomInput
          type="text"
          register={register("address", { required: "La dirección es obligatoria" })}
          label="Dirección"
          placeholder="Ingrese la dirección de entrega"
          name="address"
          errorMessage={errors.address?.message}
          errors={errors}
        />

        <CustomTable
          elements={orderData.products}
          name="producto"
          columns={columns}
          initialVisibleColumns={['product_name', 'quantity', 'detail', 'actions']}
          handleCreate={handleCreateProduct}
          renderCell={renderCell}
          filterProperty="product_name"
        />
        <div className='flex space-x-4'>
          <Button color='danger' variant='ghost' onClick={handleCancel}>Cancelar</Button>
          <Button type="submit" color="primary" >Guardar</Button>
        </div>
      </form>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddProduct}
        products={products}
      />
    </DefaultLayout>
  );
}

export default OrderRegistrationPage;



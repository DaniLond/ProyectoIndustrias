import { useEffect, useState } from 'react';
import DefaultLayout from '../../layouts/DefaultLayout';
import Alert from '../../components/ui/Alert';
import CustomTable from '../../components/CustomTable';
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaEdit } from 'react-icons/fa';
import { useOrder } from '../../context/OrderContext';
import { useNavigate } from 'react-router-dom';

function OrderPage() {
    const { orders, getOrders, errors } = useOrder();
    const [visibleErrors, setVisibleErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getOrders();
                setIsLoading(false);
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.response?.data?.error;
                setVisibleErrors([errorMessage]);
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateOrder = () => {
        navigate('/create-order');
    };


    useEffect(() => {
        setVisibleErrors(errors);
    }, [errors]);

    const handleCloseAlert = (index) => {
        setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
    };

    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "DETALLE", uid: "detail", sortable: true },
        { name: "CLIENTE", uid: "client_name", sortable: true },
        { name: "FECHA DE REALIZACIÓN", uid: "date_realization", sortable: true },
        { name: "FECHA DE ENTREGA", uid: "delivery_date", sortable: true },
        { name: "DIRECCIÓN", uid: "address", sortable: true },
        { name: "ESTADO", uid: "id_state", sortable: true },
        { name: "ACCIONES", uid: "actions" }
    ];

    const initialVisibleColumns = ["id", "client_name", "date_realization", "delivery_date", "id_state", "actions"];

    const renderCell = (order, columnKey) => {
        const cellValue = order[columnKey];
        switch (columnKey) {
            case 'actions':
                return (
                    <div className='relative flex justify-center items-center'>
                        <Dropdown className='bg-background border-1 border-default-200'>
                            <DropdownTrigger>
                                <Button isIconOnly radius='full' size='sm' variant='light'>
                                    <BsThreeDotsVertical className='text-default-500' />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu color='primary' variant='bordered'>
                                <DropdownItem startContent={<FaEdit />}>
                                    Editar
                                </DropdownItem>
                                <DropdownItem>
                                    Ver más
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    };

    return (
        <DefaultLayout>
            {visibleErrors.map((error, i) => (
                <Alert type={true} title='Error' message={error} key={i} onClose={() => handleCloseAlert(i)} />
            ))}
            <div className='p-2'>
                <h2 className='text-gray-800 text-2xl font-bold'>Pedidos</h2>
            </div>
            {!isLoading && orders && orders.length > 0 && (
                <CustomTable
                    elements={orders}
                    name='pedidos'
                    columns={columns}
                    initialVisibleColumns={initialVisibleColumns}
                    handleCreate={handleCreateOrder}
                    renderCell={renderCell}
                    filterProperty='client_name'
                    additionalFilter={{ field: 'state_name', label: 'Estado' }}
                />
            )}
        </DefaultLayout>
    );
}

export default OrderPage;

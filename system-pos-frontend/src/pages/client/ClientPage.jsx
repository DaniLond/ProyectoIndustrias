import { useEffect, useState } from 'react';
import DefaultLayout from '../../layouts/DefaultLayout';
import { ClientRegistrationModal } from './ClientRegistrationModal';
import Alert from '../../components/ui/Alert';
import CustomTable from '../../components/CustomTable';
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useClient } from '../../context/ClientContext';

function ClientPage() {
  const { clients, getClients, deleteClient, errors } = useClient();
  const [visibleErrors, setVisibleErrors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getClients();
        setIsLoading(false);
      } catch (error) {
        const errorMessage = error.response.data.message || error.response.data.error;
        setVisibleErrors([errorMessage]);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setVisibleErrors(errors);
  }, [errors]);

  const handleEdit = (client) => {
    setEditingClient(client);
    setIsOpen(true);
  };

  const handleCreate = () => {
    setEditingClient(null);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteClient(id);
  };

  const handleCloseAlert = (index) => {
    setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NOMBRE", uid: "client_name", sortable: true },
    { name: "EMAIL", uid: "email", sortable: true },
    { name: "TELÉFONO", uid: "phone" },
    { name: "DIRECCIÓN", uid: "address" },
    { name: "CIUDAD", uid: "city", sortable: true },
    { name: "ACCIONES", uid: "actions" }
  ];

  const initialVisibleColumns = ["id", "client_name", "email", "phone", "city", "actions"];

  const renderCell = (client, columnKey) => {
    const cellValue = client[columnKey];

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
              <DropdownMenu color='primary' variant='bordered' disallowEmptySelection>
                <DropdownItem startContent={<FaEdit />} onClick={() => handleEdit(client)}>
                  Editar
                </DropdownItem>
                <DropdownItem
                  className='text-danger'
                  color='danger'
                  startContent={<MdDelete />}
                  onClick={() => handleDelete(client.id)}
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
  };

  return (
    <DefaultLayout>
      {visibleErrors.map((error, i) => (
        <Alert type={true} title='Error' message={error} key={i} onClose={() => handleCloseAlert(i)} />
      ))}
      <div className='p-2'>
        <h2 className='text-gray-800 text-2xl font-bold'>Clientes</h2>
      </div>
      {!isLoading && clients && clients.length > 0 && (
        <CustomTable
          elements={clients}
          name='clientes'
          columns={columns}
          initialVisibleColumns={initialVisibleColumns}
          handleCreate={handleCreate}
          Modal={ClientRegistrationModal}
          renderCell={renderCell}
          filterProperty='client_name'
          additionalFilter={{ field: 'city', label: 'Ciudad' }}
        />
      )}
      <ClientRegistrationModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingClient(null);
        }}
        clientToEdit={editingClient}
      />
    </DefaultLayout>
  );
}

export default ClientPage;

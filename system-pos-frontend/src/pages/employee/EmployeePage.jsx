import { useEffect, useState } from 'react';
import DefaultLayout from '../../layouts/DefaultLayout';
import { EmployeeRegistrationModal } from './EmployeeRegistrationModal';
import Alert from '../../components/ui/Alert';
import CustomTable from '../../components/CustomTable';
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useEmployee } from '../../context/EmployeeContext';
import { FaClipboardList } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { FiExternalLink } from 'react-icons/fi';
import { BsGrid } from 'react-icons/bs';

function EmployeePage() {
  const { employees, getEmployees, deleteEmployee, errors } = useEmployee();
  const [visibleErrors, setVisibleErrors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getEmployees();
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

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setIsOpen(true);
  };

  const handleCreate = () => {
    setEditingEmployee(null);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteEmployee(id);
  };

  const handleCloseAlert = (index) => {
    setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NOMBRE", uid: "name", sortable: true },
    { name: "PUESTO DE TRABAJO", uid: "role", sortable: true },
    { name: "EMAIL", uid: "email", sortable: true },
    { name: "TELÉFONO", uid: "phone" },
    { name: "DIRECCIÓN", uid: "address" },
    { name: "ACCIONES", uid: "actions" }
  ];

  const initialVisibleColumns = ["id", "name", "role", "email", "phone", "actions"];

  const renderCell = (employee, columnKey) => {
    const cellValue = employee[columnKey];

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
                <DropdownItem startContent={<FaEdit />} onClick={() => handleEdit(employee)}>
                  Editar
                </DropdownItem>
                <DropdownItem startContent={<FaPlus />} >
                  Asignar Tarea
                </DropdownItem>
                <DropdownItem startContent={<FaClipboardList />} >
                  Plantilla
                </DropdownItem>
                <DropdownItem startContent={<FiExternalLink />} >
                  Realizar Pago
                </DropdownItem>
                <DropdownItem startContent={<BsGrid />} >
                  Historial de Pagos
                </DropdownItem>
                <DropdownItem
                  className='text-danger'
                  color='danger'
                  startContent={<MdDelete />}
                  onClick={() => handleDelete(employee.id)}
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
        <h2 className='text-gray-800 text-2xl font-bold'>Colaboradores</h2>
      </div>
      {!isLoading && employees && employees.length > 0 && (
        <CustomTable
          elements={employees}
          name='colaboradores'
          columns={columns}
          initialVisibleColumns={initialVisibleColumns}
          handleCreate={handleCreate}
          Modal={EmployeeRegistrationModal}
          renderCell={renderCell}
          filterProperty='name'
          additionalFilter={{ field: 'role', label: 'Puesto de trabajo' }}
        />
      )}
      <EmployeeRegistrationModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingEmployee(null);
        }}
        employeeToEdit={editingEmployee}
      />
    </DefaultLayout>
  );
}

export default EmployeePage;
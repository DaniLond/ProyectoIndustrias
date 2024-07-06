import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, User, Pagination,
} from "@nextui-org/react";
import { SearchIcon } from "../components/icon/SearchIcon";
import { ChevronDownIcon } from "../components/icon/ChevronDownIcon";
import { VerticalDotsIcon } from "../components/icon/VerticalDotsIcon";
import { useClient } from '../context/ClientContext';
import Alert from '../components/ui/Alert';
import { PlusIcon } from "../components/icon/PlusIcon";
import { ClientRegistrationModal } from '../components/ui/ClientRegistrationModal';

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NOMBRE", uid: "client_name", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "TELÉFONO", uid: "phone" },
  { name: "DIRECCIÓN", uid: "address" },
  { name: "CIUDAD", uid: "city", sortable: true },
  { name: "ACCIONES", uid: "actions" }
];

const INITIAL_VISIBLE_COLUMNS = ["id", "client_name", "email", "phone", "city", "actions"];

export default function ClientPage() {
  const { clients = [], getClients, deleteClient, errors } = useClient();
  const [filterValue, setFilterValue] = useState("");
  const [visibleErrors, setVisibleErrors] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "client_name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    getClients();
  }, []);

  useEffect(() => {
    setVisibleErrors(errors);
  }, [errors]);

  const handleCloseAlert = (index) => {
    setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  };

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredClients = [...clients];
    if (hasSearchFilter) {
      filteredClients = filteredClients.filter((client) =>
        client.client_name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredClients;
  }, [clients, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((client, columnKey) => {
    const cellValue = client[columnKey];

    switch (columnKey) {
      case "client_name":
        return (
          <User
            name={cellValue}
            description={client.email}
          >
            {client.email}
          </User>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-primary hover:bg-primary hover:text-white active:bg-primary-dark"
                >
                  <VerticalDotsIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Acciones"
              >

                <DropdownItem
                  key="editar"
                  className="text-primary hover:bg-primary hover:text-white active:bg-primary-dark"
                  onClick={() => handleEdit(client)}
                >
                  Editar
                </DropdownItem>
                <DropdownItem
                  key="eliminar"
                  className="text-primary hover:bg-primary hover:text-white active:bg-primary-dark"
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
  }, []);

  const handleDelete = async (id) => {
      await deleteClient(id);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setIsOpen(true);
  };

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            classNames={{
              input: "text-small",
              inputWrapper: "border-2 border-secondary-light focus:border-secondary",
            }}
            placeholder="Buscar por nombre..."
            startContent={<SearchIcon className="text-secondary" />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  color="secondary"
                  variant="flat"
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Columnas de la tabla"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              endContent={<PlusIcon />}
              onPress={() => setIsOpen(true)}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {clients.length} clientes</span>
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    clients.length,
    onSearchChange,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" color="primary" variant="flat" onPress={onPreviousPage}>
            Anterior
          </Button>
          <Button isDisabled={pages === 1} size="sm" color="primary" variant="flat" onPress={onNextPage}>
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [page, pages, onPreviousPage, onNextPage]);

  return (
    <div className="container mx-auto py-10">
      <h1 style={{ fontSize: '38px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid rgba(211, 211, 211, 0.5)', paddingBottom: '10px', color: '#1F2937' }}>Clientes</h1>
      {visibleErrors.map((error, i) => (
        <Alert
          type={true}
          title="Error"
          message={error}
          key={i}
          onClose={() => handleCloseAlert(i)}
        />
      ))}
      <Table
        aria-label="Tabla de clientes"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ClientRegistrationModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingClient(null);
        }}
        clientToEdit={editingClient}
      />
    </div>
  );
}
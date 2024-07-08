import { useState, useMemo, useCallback } from 'react';

import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Button,
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Pagination,
	Select,
	SelectItem,
	Input,
} from '@nextui-org/react';

import { FaPlus } from 'react-icons/fa6';
import { CiSearch } from 'react-icons/ci';
import { FaChevronDown } from 'react-icons/fa';

function CustomTable({ elements, name, columns, initialVisibleColumns, handleCreate, Modal, renderCell }) {
	const [filterValue, setFilterValue] = useState(''); // Maneja la barra de búsqueda
	const [selectedKeys, setSelectedKeys] = useState(new Set([])); // Maneja la seleccion de una fila
	const [visibleColumns, setVisibleColumns] = useState(new Set(initialVisibleColumns)); // Maneja las columnas visibles en la tabla
	const [page, setPage] = useState(1); // Maneja la cantidad de páginas de la tabla
	const [rowsPerPage, setRowsPerPage] = useState(10); // Maneja la cantidad de filas de la tabla
	const [sortDescriptor, setSortDescriptor] = useState({
		direction: 'ascending',
	}); // Maneja la dirección en la que ordena los elementos de la tabla

	const pages = Math.ceil(elements.length / rowsPerPage);

	const hasSearchFilter = Boolean(filterValue);

	const headerColumns = useMemo(() => {
		return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
	}, [visibleColumns, columns]);

	const filteredItems = useMemo(() => {
		let filteredElements = [...elements];
		if (hasSearchFilter) {
			filteredElements = filteredElements.filter((e) => e.name.toLowerCase().includes(filterValue.toLowerCase()));
		}

		return filteredElements;
	}, [elements, hasSearchFilter, filterValue]);

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

			return sortDescriptor.direction === 'descending' ? -cmp : cmp;
		});
	}, [sortDescriptor, items]);

	const onRowsPerPageChange = useCallback((e) => {
		if (e.target.value.length === 0) return;
		setRowsPerPage(e.target.value);
		setPage(1);
	}, []);

	const onSearchChange = useCallback((value) => {
		if (value) {
			setFilterValue(value);
			setPage(1);
		} else {
			setFilterValue('');
		}
	}, []);

	const topContent = useMemo(() => {
		return (
			<div className='flex flex-col gap-4'>
				<div className='flex justify-between gap-2 items-center'>
					<Input
						type='text'
						placeholder={`Buscar ${name}...`}
						variant='bordered'
						size='sm'
						radius='sm'
						isClearable
						color='primary'
						classNames={{
							base: 'w-full sm:max-w-[40%]',
						}}
						startContent={<CiSearch className='text-black' />}
						value={filterValue}
						onClear={() => setFilterValue('')}
						onValueChange={onSearchChange}
					/>
					<div className='flex gap-4'>
						<Button onPress={handleCreate} color='primary' endContent={<FaPlus />} size='sm'>
							{`Añadir ${name}`}
						</Button>
						<Dropdown>
							<DropdownTrigger className='hidden sm:flex'>
								<Button
									endContent={<FaChevronDown className='text-small' />}
									size='sm'
									variant='bordered'
									color='primary'
								>
									Columnas
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								color='primary'
								variant='bordered'
								disallowEmptySelection
								aria-label='Columnas de la tabla'
								closeOnSelect={false}
								selectedKeys={visibleColumns}
								selectionMode='multiple'
								onSelectionChange={setVisibleColumns}
							>
								{columns.map((column) => (
									<DropdownItem key={column.uid}>{column.name}</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
						<Modal />
					</div>
				</div>
				<div className='flex justify-between items-center text-default-400 text-small'>
					Total {elements.length} {name}
					<div>
						<Select
							color='primary'
							variant='bordered'
							label='Filas por página'
							labelPlacement='outside-left'
							classNames={{
								label: 'text-default-400',
							}}
							radius='sm'
							selectedKeys={[rowsPerPage]}
							onChange={onRowsPerPageChange}
						>
							<SelectItem color='primary' variant='bordered' key={10} textValue='10'>
								10
							</SelectItem>
							<SelectItem color='primary' variant='bordered' key={20} textValue='20'>
								20
							</SelectItem>
							<SelectItem color='primary' variant='bordered' key={30} textValue='30'>
								30
							</SelectItem>
						</Select>
					</div>
				</div>
			</div>
		);
	}, [
		name,
		filterValue,
		onSearchChange,
		handleCreate,
		visibleColumns,
		columns,
		elements.length,
		rowsPerPage,
		onRowsPerPageChange,
	]);

	const bottomContent = useMemo(() => {
		return (
			<div className='py-2 px-2 flex justify-between items-center'>
				<Pagination
					page={page}
					total={pages}
					color='primary'
					variant='light'
					showControls
					loop
					isCompact
					showShadow
					isDisabled={hasSearchFilter}
					onChange={setPage}
				/>
			</div>
		);
	}, [page, pages, hasSearchFilter]);

	const classNames = useMemo(
		() => ({
			th: ['bg-primary-500', 'text-white'],
			td: [],
		}),
		[],
	);
	return (
		<Table
			aria-label={`Tabla de ${name}`}
			isCompact
			topContent={topContent}
			bottomContent={bottomContent}
			sortDescriptor={sortDescriptor}
			onSelectionChange={setSelectedKeys}
			onSortChange={setSortDescriptor}
			selectedKeys={selectedKeys}
			classNames={classNames}
			color='primary'
		>
			<TableHeader columns={headerColumns}>
				{(column) => (
					<TableColumn
						key={column.uid}
						align={column.uid === 'actions' ? 'center' : 'start'}
						allowsSorting={column.sortable}
					>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody emptyContent={`No hay ${name} registrados`} items={sortedItems}>
				{(item) => (
					<TableRow key={item.name}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

export default CustomTable;

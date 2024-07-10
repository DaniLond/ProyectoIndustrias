import { useAuth } from '../context/AuthContext';

import { Dropdown, DropdownTrigger, DropdownItem, DropdownMenu, User } from '@nextui-org/react';

import { FaHome } from 'react-icons/fa';
import { FaClipboardList } from 'react-icons/fa';
import { FaHammer } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';

function Navbar() {
	const { user, logout } = useAuth();

	return (
		<div className='hidden md:flex flex-col w-64 border-r border-gray-200'>
			<div className='flex items-center justify-center h-16'>
				<Dropdown placement='bottom-end'>
					<DropdownTrigger>
						<User
							as='button'
							avatarProps={{
								isBordered: true,
							}}
							className='transition-transform'
							description={user.user.id}
							name={user.user.username}
						/>
					</DropdownTrigger>
					<DropdownMenu variant='flat' disabledKeys={['user']}>
						<DropdownItem className='h-14 gap-2' key={'user'}>
							<p>Ha iniciado sesión con</p>
							<p className='font-semibold'>{user.user.email}</p>
						</DropdownItem>
						<DropdownItem key={'logout'} color='danger' onClick={() => logout()}>
							Cerrar sesión
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>
			<div className='flex flex-col flex-1 overflow-y-auto'>
				<nav className='flex-1 px-2 py-4'>
					<h6 className='text-primary text-sm font-bold px-4'>PRINCIPAL</h6>
					<a
						href='/home'
						className='text-black hover:text-primary text-sm flex items-center hover:bg-primary-50 rounded px-4 py-3 transition-all'
					>
						<FaHome className='w-[18px] h-[18px] mr-4' />
						Inicio
					</a>
					<a
						href='/orders'
						className='text-black hover:text-primary text-sm flex items-center hover:bg-primary-50 rounded px-4 py-3 transition-all'
					>
						<FaClipboardList className='w-[18px] h-[18px] mr-4' />
						Pedidos
					</a>
					<a
						href='/employees'
						className='text-black hover:text-primary text-sm flex items-center hover:bg-primary-50 rounded px-4 py-3 transition-all'
					>
						<FaHammer className='w-[18px] h-[18px] mr-4' />
						Empleados
					</a>
					<a
						href='/clients'
						className='text-black hover:text-primary text-sm flex items-center hover:bg-primary-50 rounded px-4 py-3 transition-all'
					>
						<FaUsers className='w-[18px] h-[18px] mr-4' />
						Clientes
					</a>
				</nav>
			</div>
		</div>
	);
}

export default Navbar;

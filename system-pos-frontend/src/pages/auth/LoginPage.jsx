import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import Alert from '../../components/ui/Alert';
import CustomInput from '../../components/ui/CustomInput';
import { Button } from '@nextui-org/button';

function LoginPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const { signin, isAuthenticated, errors: loginErrors } = useAuth();
	const [visibleErrors, setVisibleErrors] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/home', { replace: true });
		}
	}, [isAuthenticated, navigate]);

	useEffect(() => {
		setVisibleErrors(loginErrors);
	}, [loginErrors]);

	const onSubmit = handleSubmit(async (values) => {
		await signin(values);
	});

	const handleCloseAlert = (index) => {
		setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
	};

	return (
		<>
			<section className='bg-white'>
				<main className='min-h-screen flex flex-col items-center justify-center py-6 px-4'>
					{visibleErrors.map((error, i) => (
						<Alert
							type={true}
							title='Error iniciando sesión'
							message={error}
							key={i}
							onClose={() => handleCloseAlert(i)}
						/>
					))}
					<div className='grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full'>
						<div className='border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto'>
							<form className='space-y-4' onSubmit={onSubmit}>
								<div className='mb-4'>
									<h1 className='text-gray-800 text-3xl font-extrabold'>Industrias Londoño</h1>
									<p className='text-gray-500 text-sm mt-4 leading-relaxed'>
										Bienvenido a Industrias Londoño, por favor inicie sesión en su cuenta
									</p>
								</div>

								<div className='relative flex items-center'>
									<CustomInput
										type='text'
										register={register('id', { required: 'El número de identificación es obligatorio' })}
										label='Número de identificación'
										placeholder='Ingrese su número de identificación'
										name='id'
										errorMessage={errors.id?.message}
										errors={errors}
										autofocus
									/>
								</div>

								<div className='relative flex items-center'>
									<CustomInput
										type='password'
										register={register('password', { required: 'La contraseña es obligatoria' })}
										label='Contraseña'
										placeholder='Ingrese su contraseña'
										name='password'
										errorMessage={errors.password?.message}
										errors={errors}
									/>
								</div>

								<div className='text-sm gap-4'>
									<Link to='/forgot-password' className='text-primary font-semibold'>
										¿Olvidó su contraseña?
									</Link>
								</div>

								<div className='mt-8'>
									<Button
										type='submit'
										color='primary'
										radius='sm'
										className='w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg'
									>
										Iniciar sesión
									</Button>
								</div>

								<p className='text-sm mt-8 text-center text-gray-800'>
									¿No tienes una cuenta?{' '}
									<Link to='/register' className='text-primary font-semibold'>
										Registrate aquí
									</Link>
								</p>
							</form>
						</div>

						<div className='lg:h-[400px] md:h-[300px] max-md:mt-8'>
							<img
								src='../../public/login.svg'
								className='w-full h-full max-md:w-4/5 mx-auto block object-cover'
								alt=''
							/>
						</div>
					</div>
				</main>
			</section>
		</>
	);
}

export default LoginPage;

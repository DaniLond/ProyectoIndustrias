import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import Alert from '../../components/ui/Alert';
import CustomInput from '../../components/ui/CustomInput';
import { Button } from '@nextui-org/button';

function ForgotPassword() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const { forgotPassword, errors: forgotPasswordErrors } = useAuth();
	const [visibleErrors, setVisibleErrors] = useState([]);

	useEffect(() => {
		setVisibleErrors(forgotPasswordErrors);
	}, [forgotPasswordErrors]);

	const onSubmit = handleSubmit(async (values) => {
		await forgotPassword(values);
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
							title='Error restableciendo contraseña'
							message={error}
							key={i}
							onClose={() => handleCloseAlert(i)}
						/>
					))}
					<div className='grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full'>
						<div className='border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto'>
							<form className='space-y-4' onSubmit={onSubmit}>
								<div className='mb-4'>
									<h1 className='text-gray-800 text-3xl font-extrabold'>¿Olvidaste tu contraseña?</h1>
									<p className='text-gray-500 text-sm mt-4 leading-relaxed'>
										¡No te preocupes! ¡Simplemente ingrese su número de identificación y le enviaremos un enlace a la
										dirección de correo electrónico que utilizó cuando creó su cuenta para así restablecer su
										contraseña!
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

								<div className='mt-8'>
									<Button
										type='submit'
										color='primary'
										radius='sm'
										className='w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg'
									>
										Restablecer contraseña
									</Button>
								</div>
							</form>

							<div className='mt-3 text-sm text-gray-600 items-center flex justify-between'>
								<Link to='/' className='text-primary font-semibold inline-flex items-center ml-4'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-5 w-5 mr-2'
										viewBox='0 0 20 20'
										fill='currentColor'
									>
										<path
											fillRule='evenodd'
											d='M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z'
											clipRule='evenodd'
										/>
									</svg>
									Regresar
								</Link>
							</div>
						</div>

						<div className='lg:h-[400px] md:h-[300px] max-md:mt-8'>
							<img
								src='../../public/forgot-password.svg'
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

export default ForgotPassword;

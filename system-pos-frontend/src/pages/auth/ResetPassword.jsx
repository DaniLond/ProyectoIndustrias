import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import Alert from '../../components/ui/Alert';
import CustomInput from '../../components/ui/CustomInput';
import { Button } from '@nextui-org/button';

function ResetPassword() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const { resetPassword, errors: resetPasswordErrors } = useAuth();
	const [visibleErrors, setVisibleErrors] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		setVisibleErrors(resetPasswordErrors);
	}, [resetPasswordErrors]);

	const onSubmit = handleSubmit(async (values) => {
		const url = new URL(window.location.href);
		const token = url.pathname.split('/reset-password/')[1];
		const status = await resetPassword(values, token);
		if (status === 200) navigate('/', { replace: true });
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
									<h1 className='text-gray-800 text-3xl font-extrabold'>Restablecer contraseña</h1>
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
										Confirmar cambio
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
								src='../../public/reset-password.svg'
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

export default ResetPassword;

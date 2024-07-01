/* eslint-disable react/prop-types */
const Alert = ({ type, title, message, onClose }) => {
	return (
		<aside
			role='alert'
			className='fixed bottom-4 end-4 z-50 flex items-center justify-center gap-4 rounded-lg bg-black p-4'
		>
			<div className='flex items-start gap-4'>
				{type === true ? (
					<span className='text-red-600'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth='1.5'
							stroke='currentColor'
							className='h-6 w-6'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M12 9v2.25m0 3.75h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
					</span>
				) : (
					<span className='text-green-600'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth='1.5'
							stroke='currentColor'
							className='h-6 w-6'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
					</span>
				)}

				<div className='flex-1'>
					<strong className='block font-medium text-white'>{title}</strong>
					<p className='mt-1 text-sm text-white'>{message}</p>
				</div>

				<button onClick={onClose} className='text-gray-300 transition hover:text-gray-400'>
					<span className='sr-only'>Cerrar</span>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth='1.5'
						stroke='currentColor'
						className='h-6 w-6'
					>
						<path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
					</svg>
				</button>
			</div>
		</aside>
	);
};

export default Alert;

import { Link, Button } from '@nextui-org/react';

function Error404Page() {
	return (
		<>
			<main className='min-h-screen flex flex-col items-center justify-center py-6 px-4'>
				<div className='mb-4'>
					<h1 className='uppercase tracking-widest text-gray-500'>404 | Página No Encontrada</h1>
				</div>
				<Button
					href='/home'
					as={Link}
					color='primary'
					showAnchorIcon
					variant='solid'
					className='shadow-xl py-4 px-4 text-sm tracking-wide rounded-lg'
				>
					Volver al inicio
				</Button>
			</main>
		</>
	);
}

export default Error404Page;

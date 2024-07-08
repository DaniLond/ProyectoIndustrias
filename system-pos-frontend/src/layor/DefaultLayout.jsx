import Header from '../components/Header';
import Navbar from '../components/Navbar';

// eslint-disable-next-line react/prop-types
function DefaultLayout({ children }) {
	return (
		<>
			<div className='flex h-screen bg-white'>
				<Navbar />
				<div className='flex flex-col flex-1 overflow-y-auto'>
					<Header />
					<main className='p-4'>{children}</main>
				</div>
			</div>
		</>
	);
}

export default DefaultLayout;
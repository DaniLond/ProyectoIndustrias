/* eslint-disable react/prop-types */
import { Input } from '@nextui-org/input';

const CustomInput = ({ type, register, label, placeholder, name, errorMessage, errors, ...rest }) => {
	const isInvalid = errors[name];

	return (
		<Input
			type={type}
			{...register}
			label={label}
			placeholder={placeholder}
			name={name}
			errorMessage={isInvalid ? errorMessage : ''}
			variant='bordered'
			radius='sm'
			labelPlacement='outside'
			isRequired
			isClearable
			isInvalid={isInvalid}
			color={isInvalid ? 'danger' : 'primary'}
			classNames={{
				label: 'text-black',
			}}
			{...rest}
		/>
	);
};

export default CustomInput;

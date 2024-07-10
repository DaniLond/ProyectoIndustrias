/* eslint-disable react/prop-types */
import { Select, SelectItem } from "@nextui-org/react";

const CustomSelect = ({ register, label, name, errorMessage, errors, options, placeholder, ...rest }) => {
    const isInvalid = errors[name];

    return (
        <Select
            {...register}
            label={label}
            placeholder={placeholder}
            errorMessage={isInvalid ? errorMessage : ''}
            variant="bordered"
            radius="sm"
            labelPlacement="outside"
            isRequired
            isInvalid={isInvalid}
            color={isInvalid ? 'danger' : 'primary'}
            classNames={{
                label: 'text-black',
            }}
            {...rest}
        >
            {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                    {option.label}
                </SelectItem>
            ))}
        </Select>
    );
};

export default CustomSelect;


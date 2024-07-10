// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useForm } from 'react-hook-form';
import { useEmployee } from '../../context/EmployeeContext';
import CustomInput from '../../components/ui/CustomInput';
import { useState, useEffect } from "react";
import Alert from '../../components/ui/Alert';
import CustomSelect from '../../components/ui/CustomSelect';

// eslint-disable-next-line react/prop-types
export function EmployeeRegistrationModal({ isOpen, onClose, employeeToEdit }) {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const { registerEmployee, updateEmployee, errors: registerErrors } = useEmployee();
    const [visibleErrors, setVisibleErrors] = useState([]);

    useEffect(() => {
        if (employeeToEdit) {
            Object.keys(employeeToEdit).forEach(key => {
                setValue(key, employeeToEdit[key]);
            });
        } else {
            reset();
        }
    }, [employeeToEdit, setValue, reset]);

    useEffect(() => {
        setVisibleErrors(registerErrors);
    }, [registerErrors]);

    const handleCloseAlert = (index) => {
        setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {

        if (employeeToEdit) {
            // eslint-disable-next-line react/prop-types
            await updateEmployee(employeeToEdit.id, data);
        } else {
            await registerEmployee(data);
        }
        onClose();
        reset();

    };

    const ROLES = [
        { value: 'Corte de Madera', label: 'Corte de Madera' },
        { value: 'Corte de Tela', label: 'Corte de Tela' },
        { value: 'Costura', label: 'Costura' },
        { value: 'Tapiceria', label: 'Tapiceria' },
        { value: 'Ensamblado', label: 'Ensamblado' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader className="flex flex-col gap-1">
                        {employeeToEdit ? 'Editar Colaborador' : 'Registrar Colaborador'}
                    </ModalHeader>
                    <ModalBody>
                        {visibleErrors.map((error, i) => (
                            <Alert
                                type={true}
                                title="Error"
                                message={error}
                                key={i}
                                onClose={() => handleCloseAlert(i)}
                            />
                        ))}
                        <CustomInput
                            type="text"
                            register={register("id", { required: "La cédula es obligatoria" })}
                            label="Cédula"
                            placeholder="Ingrese la cédula del colaborador"
                            name="id"
                            errorMessage={errors.id?.message}
                            errors={errors}
                            // eslint-disable-next-line react/prop-types
                            defaultValue={employeeToEdit?.id || ''}
                        />
                        <CustomInput
                            type="text"
                            register={register("name", { required: "El nombre es obligatorio" })}
                            label="Nombre"
                            placeholder="Ingrese el nombre del colaborador"
                            name="name"
                            errorMessage={errors.name?.message}
                            errors={errors}
                            // eslint-disable-next-line react/prop-types
                            defaultValue={employeeToEdit?.name || ''}
                        />
                        <CustomSelect
                            register={register("role", { required: "El puesto de trabajo es obligatorio" })}
                            label="Puesto de trabajo"
                            name="role"
                            placeholder="Seleccione un puesto de trabajo"
                            errorMessage={errors.role?.message}
                            errors={errors}
                            options={ROLES}
                            // eslint-disable-next-line react/prop-types
                            defaultValue={employeeToEdit?.role || ''}
                        />
                        <CustomInput
                            type="email"
                            register={register("email")}
                            label="Correo"
                            placeholder="Ingrese el correo del colaborador"
                            name="email"
                            errorMessage={errors.email?.message}
                            errors={errors}
                            // eslint-disable-next-line react/prop-types
                            defaultValue={employeeToEdit?.email || ''}
                        />
                        <CustomInput
                            type="tel"
                            register={register("phone")}
                            label="Teléfono"
                            placeholder="Ingrese el teléfono del colaborador"
                            name="phone"
                            errors={errors}
                            // eslint-disable-next-line react/prop-types
                            defaultValue={employeeToEdit?.phone || ''}
                        />
                        <CustomInput
                            type="text"
                            register={register("address")}
                            label="Dirección"
                            placeholder="Ingrese la dirección del colaborador"
                            name="address"
                            errors={errors}
                            // eslint-disable-next-line react/prop-types
                            defaultValue={employeeToEdit?.address || ''}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="ghost" onPress={onClose} >
                            Cancelar
                        </Button>
                        <Button color="primary" type="submit">
                            {employeeToEdit ? 'Actualizar' : 'Registrar'}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
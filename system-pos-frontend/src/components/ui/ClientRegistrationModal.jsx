// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useForm } from 'react-hook-form';
import { useClient } from '../../context/ClientContext';
import CustomInput from './CustomInput';
import { useState, useEffect } from "react";
import Alert from './Alert';

// eslint-disable-next-line react/prop-types
export function ClientRegistrationModal({ isOpen, onClose, clientToEdit }) {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const { registerClient, updateClient, errors: registerErrors } = useClient();
    const [visibleErrors, setVisibleErrors] = useState([]);

    useEffect(() => {
        if (clientToEdit) {
            Object.keys(clientToEdit).forEach(key => {
                setValue(key, clientToEdit[key]);
            });
        } else {
            reset();
        }
    }, [clientToEdit, setValue, reset]);

    useEffect(() => {
        setVisibleErrors(registerErrors);
    }, [registerErrors]);

    const handleCloseAlert = (index) => {
        setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {

        if (clientToEdit) {
            // eslint-disable-next-line react/prop-types
            await updateClient(clientToEdit.id, data);
        } else {
            await registerClient(data);
        }
        onClose();
        reset();

    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader className="flex flex-col gap-1">
                        {clientToEdit ? 'Editar Cliente' : 'Registrar Cliente'}
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
                            placeholder="Ingrese la cédula del cliente"
                            name="id"
                            errorMessage={errors.id?.message}
                            errors={errors}
                            // eslint-disable-next-line react/prop-types
                            defaultValue={clientToEdit?.id || ''}
                        />
                        <CustomInput
                            type="text"
                            register={register("client_name", { required: "El nombre es obligatorio" })}
                            label="Nombre"
                            placeholder="Ingrese el nombre del cliente"
                            name="client_name"
                            errorMessage={errors.client_name?.message}
                            errors={errors}
                            // eslint-disable-next-line react/prop-types
                            defaultValue={clientToEdit?.client_name || ''}
                        />
                        <CustomInput
                            type="email"
                            register={register("email")}
                            label="Correo"
                            placeholder="Ingrese el correo del cliente"
                            name="email"
                            errorMessage={errors.email?.message}
                            errors={errors}
                            // eslint-disable-next-line react/prop-types
                            defaultValue={clientToEdit?.email || ''}
                        />
                        <CustomInput
                            type="tel"
                            register={register("phone")}
                            label="Teléfono"
                            placeholder="Ingrese el teléfono del cliente"
                            name="phone"
                            errors={errors}
                            // eslint-disable-next-line react/prop-types
                            defaultValue={clientToEdit?.phone || ''}
                        />
                        <CustomInput
                            type="text"
                            register={register("address")}
                            label="Dirección"
                            placeholder="Ingrese la dirección del cliente"
                            name="address"
                            errors={errors}
                            // eslint-disable-next-line react/prop-types
                            defaultValue={clientToEdit?.address || ''}
                        />
                        <CustomInput
                            type="text"
                            register={register("city")}
                            label="Ciudad"
                            placeholder="Ingrese la ciudad del cliente"
                            name="city"
                            errors={errors}
                            // eslint-disable-next-line react/prop-types
                            defaultValue={clientToEdit?.city || ''}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" variant="light" onPress={onClose} >
                            Cancelar
                        </Button>
                        <Button color="primary" type="submit">
                            {clientToEdit ? 'Actualizar' : 'Registrar'}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
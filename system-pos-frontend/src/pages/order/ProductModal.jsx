import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useForm } from 'react-hook-form';
import CustomInput from '../../components/ui/CustomInput';
import CustomSelect from '../../components/ui/CustomSelect';
import Alert from '../../components/ui/Alert';

// eslint-disable-next-line react/prop-types
export function ProductModal({ isOpen, onClose, onAddProduct, products }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [visibleErrors, setVisibleErrors] = useState([]);

    const handleAddProduct = (data) => {
        onAddProduct(data);
    };

    const handleCloseAlert = (index) => {
        setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <form onSubmit={handleSubmit(handleAddProduct)}>
                    <ModalHeader className="flex flex-col gap-1">
                        Agregar Producto
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
                        <CustomSelect
                            register={register("product_name", { required: "El producto es obligatorio" })}
                            label="Producto"
                            name="product_name"
                            placeholder="Seleccione un producto"
                            errorMessage={errors.product_name?.message}
                            errors={errors}
                            options={products.map(product => ({ value: product.name, label: product.name }))}
                        />
                        <CustomInput
                            type="number"
                            register={register("quantity", { required: "La cantidad es obligatoria" })}
                            label="Cantidad"
                            placeholder="Ingrese la cantidad"
                            name="quantity"
                            errorMessage={errors.quantity?.message}
                            errors={errors}
                            min={1}
                        />
                        <CustomInput
                            type="text"
                            register={register("detail")}
                            label="Detalle del producto"
                            placeholder="Ingrese el detalle del producto"
                            name="detail"
                            errorMessage={errors.detail?.message}
                            errors={errors}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="ghost" onPress={onClose}>
                            Cancelar
                        </Button>
                        <Button color="primary" type="submit">
                            Agregar
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

export default ProductModal;



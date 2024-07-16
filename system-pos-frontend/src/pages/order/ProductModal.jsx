import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useForm } from 'react-hook-form';
import CustomInput from '../../components/ui/CustomInput';
import CustomSelect from '../../components/ui/CustomSelect';
import Alert from '../../components/ui/Alert';

// eslint-disable-next-line react/prop-types
export function ProductModal({ isOpen, onClose, onAddProduct, products, editingProduct }) {
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
    const [visibleErrors, setVisibleErrors] = useState([]);

    useEffect(() => {
        if (editingProduct) {
            setValue("product_name", editingProduct.product_name);
            setValue("detail", editingProduct.detail);
        } else {
            reset({
                product_name: '',
                quantity: '',
                detail: 'opcional'
            });
        }
    }, [editingProduct, setValue, reset]);

    const handleAddOrEditProduct = (data) => {
        if (editingProduct) {
            // If editing, only update the detail
            onAddProduct({
                ...editingProduct,
                detail: data.detail
            });
        } else {
            // If adding new products
            const quantity = parseInt(data.quantity, 10);
            const productsToAdd = Array.from({ length: quantity }, () => ({
                product_name: data.product_name,
                detail: "opcional",
            }));
            onAddProduct(productsToAdd);
        }
    };

    const handleCloseAlert = (index) => {
        setVisibleErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <form onSubmit={handleSubmit(handleAddOrEditProduct)}>
                    <ModalHeader className="flex flex-col gap-1">
                        {editingProduct ? "Editar Producto" : "Agregar Producto"}
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
                            register={register("product_name", { required: "El nombre de la sala es obligatorio" })}
                            label="Nombre de la Sala"
                            name="product_name"
                            placeholder="Seleccione un nombre de sala"
                            errorMessage={errors.product_name?.message}
                            errors={errors}
                            options={products.map(product => ({ value: product.name, label: product.name }))}
                            disabled={!!editingProduct}
                        />
                        {!editingProduct && (
                            <CustomInput
                                type="number"
                                register={register("quantity", { required: "La cantidad es obligatoria" })}
                                label="Cantidad de Salas"
                                placeholder="Ingrese la cantidad de salas a crear"
                                name="quantity"
                                errorMessage={errors.quantity?.message}
                                errors={errors}
                                min={1}
                            />
                        )}
                        <CustomInput
                            type="text"
                            register={register("detail")}
                            label="Detalle de la sala"
                            placeholder="Ingrese el detalle de la sala"
                            name="detail"
                            errorMessage={errors.detail?.message}
                            errors={errors}
                            disabled={!editingProduct}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="ghost" onPress={onClose}>
                            Cancelar
                        </Button>
                        <Button color="primary" type="submit">
                            {editingProduct ? "Guardar" : "Agregar"}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

export default ProductModal;



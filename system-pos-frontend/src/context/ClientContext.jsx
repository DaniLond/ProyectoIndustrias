import { createContext, useContext, useEffect, useState } from 'react';
import { registerClientRequest, getClientsRequest, updateClientRequest, deleteClientRequest } from '../api/client.js';


export const ClientContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useClient = () => {
    const context = useContext(ClientContext);
    if (!context) throw new Error('useClient debe ser usado dentro de un ClientProvider');
    return context;
}

// eslint-disable-next-line react/prop-types
export const ClientProvider = ({ children }) => {
    const [clients, setClients] = useState([]);
    const [errors, setErrors] = useState([]);

    const getClients = async () => {
        try {
            const res = await getClientsRequest();
            setClients(res.data);
        } catch (error) {
            const errorMessage = error.response.data.message || [error.response.data.error];
            setErrors(errorMessage);
        }
    }

    const registerClient = async (client) => {
        try {
            const res = await registerClientRequest(client);
            setClients(res.data);
            await getClients();
        } catch (error) {
            const errorMessage = error.response.data.message || [error.response.data.error];
            setErrors(errorMessage);
        }
    }

    const updateClient = async (id, client) => {
        try {
            const res = await updateClientRequest(id, client);
            setClients(clients.map(c => c.id === id ? res.data.client : c))
        } catch (error) {
            const errorMessage = error.response.data.message || [error.response.data.error];
            setErrors(errorMessage);
        }
    }

    const deleteClient = async (id) => {
        try {
            await deleteClientRequest(id);
            setClients(clients.filter(c => c.id !== id));
            await getClients();
        } catch (error) {
            const errorMessage = error.response.data.message || [error.response.data.error];
            setErrors(errorMessage);
        }
    }

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <ClientContext.Provider
            value={{ clients, errors, getClients, registerClient, updateClient, deleteClient }}
        >
            {children}
        </ClientContext.Provider>
    );

}
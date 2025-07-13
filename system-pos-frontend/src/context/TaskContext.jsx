// TaskContext.js - Contexto optimizado
import { createContext, useContext, useState, useEffect } from 'react';
import { getPendingTasksRequest, assignTaskRequest, getEmployeeTasksRequest, updateTaskStatusRequest } from '../api/task.js';

export const TaskContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTask = () => {
    const context = useContext(TaskContext);
    if (!context) throw new Error('useTask debe ser usado dentro de un TaskProvider');
    return context;
};

export const TaskProvider = ({ children }) => {
    const [pendingTasks, setPendingTasks] = useState([]);
    const [errors, setErrors] = useState([]);

    const getPendingTasks = async (employeeId) => {
        try {
            const res = await getPendingTasksRequest(employeeId);
            setPendingTasks(res.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || [error.response?.data?.error] || [
                'Error al obtener tareas pendientes',
            ];
            setErrors(errorMessage);
        }
    };

    const assignTask = async (employeeId, cardId) => {
        try {
            await assignTaskRequest(employeeId, cardId);
        } catch (error) {
            const errorMessage = error.response?.data?.message || [error.response?.data?.error] || ['Error al asignar tarea'];
            setErrors(errorMessage);
        }
    };

    const getEmployeeTasks = async (employeeId, options = {}) => {
        try {
            const res = await getEmployeeTasksRequest(employeeId, options);
            return res.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || [error.response?.data?.error] || [
                'Error al obtener tareas del empleado',
            ];
            setErrors(errorMessage);
            throw error;
        }
    };

    const updateTaskStatus = async (cardId, newStatus, workType) => {
        try {
            await updateTaskStatusRequest(cardId, newStatus, workType);
            setPendingTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === cardId ? {...task, state: newStatus} : task
                )
            );
        } catch (error) {
            const errorMessage = error.response?.data?.message || [error.response?.data?.error] || ['Error al actualizar el estado de la tarea'];
            setErrors(errorMessage);
        }
    };

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <TaskContext.Provider value={{ 
            pendingTasks, 
            errors, 
            getPendingTasks, 
            assignTask, 
            getEmployeeTasks, 
            updateTaskStatus
        }}>
            {children}
        </TaskContext.Provider>
    );  
};
import { createContext, useContext, useEffect, useState } from 'react';
import { registerEmployeeRequest, getEmployeesRequest, updateEmployeeRequest, deleteEmployeeRequest } from '../api/employee.js';


export const EmployeeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useEmployee = () => {
    const context = useContext(EmployeeContext);
    if (!context) throw new Error('useEmployee debe ser usado dentro de un EmployeeProvider');
    return context;
}

// eslint-disable-next-line react/prop-types
export const EmployeeProvider = ({ children }) => {
    const [employees, setEmployees] = useState([]);
    const [errors, setErrors] = useState([]);

    const getEmployees = async () => {
        try {
            const res = await getEmployeesRequest();
            setEmployees(res.data);
        } catch (error) {
            const errorMessage = error.response.data.message || [error.response.data.error];
            setErrors(errorMessage);
        }
    }

    const registerEmployee = async (employee) => {
        try {
            const res = await registerEmployeeRequest(employee);
            setEmployees(res.data);
            await getEmployees();
        } catch (error) {
            const errorMessage = error.response.data.message || [error.response.data.error];
            setErrors(errorMessage);
        }
    }

    const updateEmployee = async (id, employee) => {
        try {
            const res = await updateEmployeeRequest(id, employee);
            setEmployees(employees.map(e => e.id === id ? res.data.employee : e))
        } catch (error) {
            const errorMessage = error.response.data.message || [error.response.data.error];
            setErrors(errorMessage);
        }
    }

    const deleteEmployee = async (id) => {
        try {
            await deleteEmployeeRequest(id);
            setEmployees(employees.filter(e => e.id !== id));
            await getEmployees();
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
        <EmployeeContext.Provider
            value={{ employees, errors, getEmployees, registerEmployee, updateEmployee, deleteEmployee }}
        >
            {children}
        </EmployeeContext.Provider>
    );

}
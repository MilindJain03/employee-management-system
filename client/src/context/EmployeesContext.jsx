import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import * as employeesAPI from '../api/employees';

const EmployeesContext = createContext();

export const useEmployees = () => {
  const context = useContext(EmployeesContext);
  if (!context) {
    throw new Error('useEmployees must be used within EmployeesProvider');
  }
  return context;
};

export const EmployeesProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmployees = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeesAPI.getEmployees(params);
      setEmployees(response.data);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch employees');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addEmployee = useCallback(async (employeeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeesAPI.createEmployee(employeeData);
      setEmployees(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmployee = useCallback(async (id, employeeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeesAPI.updateEmployee(id, employeeData);
      setEmployees(prev =>
        prev.map(emp => (emp.id === id ? response.data : emp))
      );
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmployee = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await employeesAPI.deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchEmployees = useCallback(async (name) => {
    setSearchTerm(name);
    if (name.trim()) {
      await fetchEmployees({ name });
    } else {
      await fetchEmployees();
    }
  }, [fetchEmployees]);

  const value = useMemo(() => ({
    employees,
    loading,
    error,
    searchTerm,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
  }), [employees, loading, error, searchTerm, fetchEmployees, addEmployee, updateEmployee, deleteEmployee, searchEmployees]);

  return (
    <EmployeesContext.Provider value={value}>
      {children}
    </EmployeesContext.Provider>
  );
};

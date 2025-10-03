import { useEffect, useState, useCallback } from 'react';
import { useEmployees } from '../context/EmployeesContext';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeForm from '../components/EmployeeForm';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';
import ColumnCustomizer from '../components/ColumnCustomizer';

const EmployeeListPage = () => {
  const {
    employees,
    loading,
    error,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
  } = useEmployees();

  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [showColumnCustomizer, setShowColumnCustomizer] = useState(false);

  // All available columns
  const allColumns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'position', label: 'Position' },
    { id: 'createdAt', label: 'Created Date' },
    { id: 'updatedAt', label: 'Updated Date' },
  ];

  // Load visible columns from localStorage or use defaults
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem('employeeVisibleColumns');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [allColumns[1], allColumns[2], allColumns[3]]; // name, email, position
      }
    }
    return [allColumns[1], allColumns[2], allColumns[3]]; // name, email, position
  });

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAddClick = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteClick = (employee) => {
    setDeleteConfirm(employee);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, formData);
        setToast({ message: 'Employee updated successfully', type: 'success' });
      } else {
        await addEmployee(formData);
        setToast({ message: 'Employee created successfully', type: 'success' });
      }
      setShowForm(false);
      setEditingEmployee(null);
    } catch (err) {
      setToast({ 
        message: err.message || 'Operation failed', 
        type: 'error' 
      });
      throw err; // Re-throw to let form handle validation errors
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteEmployee(deleteConfirm.id);
      setToast({ message: 'Employee deleted successfully', type: 'success' });
      setDeleteConfirm(null);
    } catch (err) {
      setToast({ 
        message: err.message || 'Failed to delete employee', 
        type: 'error' 
      });
    }
  };

  const handleSearch = useCallback((searchTerm) => {
    searchEmployees(searchTerm);
  }, [searchEmployees]);

  const handleSaveColumns = (newColumns) => {
    setVisibleColumns(newColumns);
    localStorage.setItem('employeeVisibleColumns', JSON.stringify(newColumns));
    setToast({ message: 'Column preferences saved', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="gradient-primary shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Employee Management</h1>
              <p className="text-purple-100 text-sm mt-1">Manage your team efficiently</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Bar */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 animate-slide-up">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <SearchBar onSearch={handleSearch} />
            <div className="flex gap-3">
              <button
                onClick={() => setShowColumnCustomizer(true)}
                className="px-4 py-3 bg-white border-2 border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 hover:border-purple-300 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-200 flex items-center gap-2 font-medium"
                title="Customize columns"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span className="hidden sm:inline">Customize</span>
              </button>
              <button
                onClick={handleAddClick}
                className="px-6 py-3 gradient-primary text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300 flex items-center gap-2 font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Employee
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && !loading && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl shadow-lg animate-slide-up">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && employees.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600 font-medium">Loading employees...</p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden animate-fade-in">
            <EmployeeTable
              employees={employees}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              visibleColumns={visibleColumns}
            />
          </div>
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={handleFormCancel}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in overflow-hidden">
            <div className="gradient-primary px-6 py-5">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {editingEmployee ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    )}
                  </svg>
                </div>
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
            </div>
            <div className="p-6">
              <EmployeeForm
                initialValues={editingEmployee}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                mode={editingEmployee ? 'edit' : 'create'}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Column Customizer */}
      <ColumnCustomizer
        isOpen={showColumnCustomizer}
        onClose={() => setShowColumnCustomizer(false)}
        availableColumns={allColumns}
        visibleColumns={visibleColumns}
        onSave={handleSaveColumns}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default EmployeeListPage;

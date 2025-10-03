import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmployeesProvider } from '../src/context/EmployeesContext';
import EmployeeListPage from '../src/pages/EmployeeListPage';
import * as employeesAPI from '../src/api/employees';

// Mock the API
vi.mock('../src/api/employees');

const mockEmployees = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    position: 'Engineer',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    position: 'Manager',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

describe('EmployeeListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render employee list page', async () => {
    employeesAPI.getEmployees.mockResolvedValue({
      data: mockEmployees,
      page: 1,
      limit: 100,
      total: 2,
    });

    render(
      <EmployeesProvider>
        <EmployeeListPage />
      </EmployeesProvider>
    );

    expect(screen.getByText('Employee Management System')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    });
  });

  it('should show empty state when no employees', async () => {
    employeesAPI.getEmployees.mockResolvedValue({
      data: [],
      page: 1,
      limit: 100,
      total: 0,
    });

    render(
      <EmployeesProvider>
        <EmployeeListPage />
      </EmployeesProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No employees')).toBeInTheDocument();
    });
  });

  it('should open add employee form when clicking add button', async () => {
    employeesAPI.getEmployees.mockResolvedValue({
      data: mockEmployees,
      page: 1,
      limit: 100,
      total: 2,
    });

    render(
      <EmployeesProvider>
        <EmployeeListPage />
      </EmployeesProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add employee/i });
    fireEvent.click(addButton);

    expect(screen.getByText('Add New Employee')).toBeInTheDocument();
  });

  it('should add a new employee', async () => {
    const newEmployee = {
      id: 3,
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      position: 'Designer',
      createdAt: '2024-01-03T00:00:00.000Z',
      updatedAt: '2024-01-03T00:00:00.000Z',
    };

    employeesAPI.getEmployees.mockResolvedValue({
      data: mockEmployees,
      page: 1,
      limit: 100,
      total: 2,
    });

    employeesAPI.createEmployee.mockResolvedValue({
      data: newEmployee,
    });

    render(
      <EmployeesProvider>
        <EmployeeListPage />
      </EmployeesProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    // Open form
    const addButton = screen.getByRole('button', { name: /add employee/i });
    fireEvent.click(addButton);

    // Fill form
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const positionInput = screen.getByLabelText(/position/i);

    fireEvent.change(nameInput, { target: { value: 'Charlie Brown' } });
    fireEvent.change(emailInput, { target: { value: 'charlie@example.com' } });
    fireEvent.change(positionInput, { target: { value: 'Designer' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create employee/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(employeesAPI.createEmployee).toHaveBeenCalledWith({
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        position: 'Designer',
      });
    });
  });

  it('should open edit form when clicking edit button', async () => {
    employeesAPI.getEmployees.mockResolvedValue({
      data: mockEmployees,
      page: 1,
      limit: 100,
      total: 2,
    });

    render(
      <EmployeesProvider>
        <EmployeeListPage />
      </EmployeesProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Edit Employee')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Alice Johnson')).toBeInTheDocument();
  });

  it('should delete an employee after confirmation', async () => {
    employeesAPI.getEmployees.mockResolvedValue({
      data: mockEmployees,
      page: 1,
      limit: 100,
      total: 2,
    });

    employeesAPI.deleteEmployee.mockResolvedValue(true);

    render(
      <EmployeesProvider>
        <EmployeeListPage />
      </EmployeesProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByRole('button', { name: /delete alice johnson/i });
    fireEvent.click(deleteButtons[0]);

    // Confirm deletion
    await waitFor(() => {
      expect(screen.getByText('Delete Employee')).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', { name: /^delete$/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(employeesAPI.deleteEmployee).toHaveBeenCalledWith(1);
    });
  });

  it('should filter employees using search', async () => {
    employeesAPI.getEmployees.mockResolvedValue({
      data: mockEmployees,
      page: 1,
      limit: 100,
      total: 2,
    });

    render(
      <EmployeesProvider>
        <EmployeeListPage />
      </EmployeesProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    // Mock filtered results
    employeesAPI.getEmployees.mockResolvedValue({
      data: [mockEmployees[0]],
      page: 1,
      limit: 100,
      total: 1,
    });

    const searchInput = screen.getByPlaceholderText(/search employees/i);
    fireEvent.change(searchInput, { target: { value: 'Alice' } });
    fireEvent.submit(searchInput.closest('form'));

    await waitFor(() => {
      expect(employeesAPI.getEmployees).toHaveBeenCalledWith({ name: 'Alice' });
    });
  });
});

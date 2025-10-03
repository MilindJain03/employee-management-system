const Employee = require('../models/employee.model');

const getAllEmployees = (req, res, next) => {
  try {
    const { name, page, limit } = req.query;
    const result = Employee.getAll({ name, page, limit });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = Employee.getById(id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.status(200).json({ data: employee });
  } catch (error) {
    next(error);
  }
};

const createEmployee = (req, res, next) => {
  try {
    const { name, email, position } = req.body;
    const employee = Employee.create({ name, email, position });
    res.status(201).json({ data: employee });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, position } = req.body;
    
    const employee = Employee.update(id, { name, email, position });
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.status(200).json({ data: employee });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = Employee.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};

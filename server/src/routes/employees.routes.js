const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employee.controller');
const {
  validateEmployee,
  validateEmployeeUpdate,
  handleValidationErrors
} = require('../middleware/validate');

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', validateEmployee, handleValidationErrors, createEmployee);
router.put('/:id', validateEmployeeUpdate, handleValidationErrors, updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;

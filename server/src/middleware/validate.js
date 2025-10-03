const { body, validationResult } = require('express-validator');

const validateEmployee = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be valid')
    .isLength({ max: 255 })
    .withMessage('Email must be at most 255 characters'),
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required')
    .isLength({ max: 50 })
    .withMessage('Position must be at most 50 characters'),
];

const validateEmployeeUpdate = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Email must be valid')
    .isLength({ max: 255 })
    .withMessage('Email must be at most 255 characters'),
  body('position')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Position cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Position must be at most 50 characters'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateEmployee,
  validateEmployeeUpdate,
  handleValidationErrors
};

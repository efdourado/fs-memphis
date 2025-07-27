import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerUserValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.'),
  body('email')
    .isEmail().withMessage('Please provide a valid email.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  handleValidationErrors,
];

export const loginUserValidator = [
  body('email')
    .isEmail().withMessage('Please provide a valid email.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.'),
  handleValidationErrors,
];

export const updateUserValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty.'),
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email.')
    .normalizeEmail(),
  body('isAdmin')
    .optional()
    .isBoolean().withMessage('isAdmin must be a boolean.'),
  body('isArtist')
    .optional()
    .isBoolean().withMessage('isArtist must be a boolean.'),

  body('artistProfile.description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters.'),
  body('artistProfile.verified')
    .optional()
    .isBoolean().withMessage('Verified status must be a boolean.'),
  handleValidationErrors,
];
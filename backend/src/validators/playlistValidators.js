import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const createPlaylistValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Playlist name is required.')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long.'),
  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters.'),
  handleValidationErrors,
];

export const updatePlaylistValidator = [
    body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty.')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long.'),
  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters.'),
  handleValidationErrors,
];
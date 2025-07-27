import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const commonSongValidations = [
    body('title')
        .trim()
        .notEmpty().withMessage('Song title is required.'),
    body('artist')
        .notEmpty().withMessage('Artist ID is required.')
        .isMongoId().withMessage('Invalid Artist ID format.'),
    body('album')
        .optional({ checkFalsy: true })
        .isMongoId().withMessage('Invalid Album ID format.'),
    body('duration')
        .notEmpty().withMessage('Duration is required.')
        .isNumeric().withMessage('Duration must be a number (in seconds).'),
    body('audioUrl')
        .optional({ checkFalsy: true })
        .isURL().withMessage('Audio URL must be a valid URL.'),
    body('isExplicit')
        .optional()
        .isBoolean().withMessage('isExplicit must be a boolean.'),
    body('lyrics')
        .optional({ checkFalsy: true })
        .trim(),
];

export const createSongValidator = [ ...commonSongValidations, handleValidationErrors ];
export const updateSongValidator = [ ...commonSongValidations, handleValidationErrors ];
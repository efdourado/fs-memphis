import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const albumTypes = ['album', 'single', 'ep', 'compilation'];

const commonAlbumValidations = [
  body('title')
    .trim()
    .notEmpty().withMessage('Album title is required.'),
  body('artist')
    .notEmpty().withMessage('Artist ID is required.')
    .isMongoId().withMessage('Invalid Artist ID format.'),
  body('releaseDate')
    .notEmpty().withMessage('Release date is required.')
    .isISO8601().withMessage('Invalid date format.').toDate(),
  body('coverImage')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Cover image must be a valid URL.'),
  body('type')
    .optional()
    .isIn(albumTypes).withMessage(`Invalid type. Must be one of: ${albumTypes.join(', ')}`),
  body('genre')
    .optional({ checkFalsy: true })
    .isString().withMessage('Genre must be a string.'),
];

export const createAlbumValidator = [ ...commonAlbumValidations, handleValidationErrors ];
export const updateAlbumValidator = [ ...commonAlbumValidations, handleValidationErrors ];
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
    body('durationMs')
        .notEmpty().withMessage('Duration is required.')
        .isNumeric().withMessage('Duration must be a number (in milliseconds).'),
    body('audioUrl')
        .optional({ checkFalsy: true })
        .isURL().withMessage('Audio URL must be a valid URL.'),
    body('coverImage')
        .optional({ checkFalsy: true })
        .isURL().withMessage('Cover image URL must be a valid URL.'),
    body('waveformUrl')
        .optional({ checkFalsy: true })
        .isURL().withMessage('Waveform URL must be a valid URL.'),
    body('subtitle')
        .optional({ checkFalsy: true })
        .trim(),
    body('description')
        .optional({ checkFalsy: true })
        .trim(),
    body('language')
        .optional({ checkFalsy: true })
        .trim(),
    body('isrc')
        .optional({ checkFalsy: true })
        .trim(),
    body('previewStartMs')
        .optional({ nullable: true })
        .isNumeric().withMessage('Preview start must be a number (in milliseconds).'),
    body('isExplicit')
        .optional()
        .isBoolean().withMessage('isExplicit must be a boolean.'),
    body('lyrics')
        .optional({ checkFalsy: true })
        .trim(),
    body('sharing.canonicalUrl')
        .optional({ checkFalsy: true })
        .isURL().withMessage('Canonical URL must be a valid URL.'),
    body('externalLinks.spotify')
        .optional({ checkFalsy: true })
        .isURL().withMessage('Spotify URL must be a valid URL.'),
    body('externalLinks.youtube')
        .optional({ checkFalsy: true })
        .isURL().withMessage('YouTube URL must be a valid URL.'),
    body('externalLinks.soundcloud')
        .optional({ checkFalsy: true })
        .isURL().withMessage('SoundCloud URL must be a valid URL.'),
    body('externalLinks.genius')
        .optional({ checkFalsy: true })
        .isURL().withMessage('Genius URL must be a valid URL.'),
    body('externalLinks.bandcamp')
        .optional({ checkFalsy: true })
        .isURL().withMessage('Bandcamp URL must be a valid URL.'),
    body('externalLinks.website')
        .optional({ checkFalsy: true })
        .isURL().withMessage('Website URL must be a valid URL.'),
];

export const createSongValidator = [ ...commonSongValidations, handleValidationErrors ];
export const updateSongValidator = [ ...commonSongValidations, handleValidationErrors ];

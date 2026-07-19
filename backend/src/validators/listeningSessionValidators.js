import { body, validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

export const listeningSessionValidator = [
  body('occurredAt').optional().isISO8601().withMessage('occurredAt must be a valid date.'),
  body('durationMinutes').optional().isInt({ min: 1, max: 1440 }).withMessage('Duration must be between 1 and 1440 minutes.'),
  body('source').optional().isIn(['spotify', 'youtube', 'bandcamp', 'soundcloud', 'vinyl', 'radio', 'live', 'other']),
  body('moodBefore').optional().isArray({ max: 12 }),
  body('moodAfter').optional().isArray({ max: 12 }),
  body('note').optional().isLength({ max: 2000 }),
  body('reference.url').optional({ checkFalsy: true }).isURL({ protocols: ['http', 'https'], require_protocol: true }),
  validate,
];

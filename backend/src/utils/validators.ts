import { body, ValidationChain } from 'express-validator';

export const registerValidationRules: ValidationChain[] = [
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
    .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character')
];

export const loginValidationRules: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const paymentValidationRules: ValidationChain[] = [
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('paymentMethod')
    .isIn(['credit_card', 'paypal', 'bank_transfer'])
    .withMessage('Invalid payment method')
];

export const membershipValidationRules: ValidationChain[] = [
  body('plan')
    .isIn(['basic', 'premium', 'pro'])
    .withMessage('Invalid membership plan')
];

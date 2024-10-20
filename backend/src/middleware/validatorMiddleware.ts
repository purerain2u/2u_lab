import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRegistration: ValidationChain[] = [
  body('email').isEmail().withMessage('유효한 이메일을 입력하세요'),
  body('password').isLength({ min: 8 }).withMessage('비밀번호는 최소 8자 이상이어야 합니다'),
  body('username').notEmpty().withMessage('사용자 이름은 필수입니다'),
];

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

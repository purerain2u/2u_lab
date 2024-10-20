import xss from 'xss';
import { Request, Response, NextFunction } from 'express';

const xssMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    });
  }
  next();
};

export default xssMiddleware;

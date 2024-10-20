import csrf from 'csurf';
import { RequestHandler } from 'express';

const csrfProtection: RequestHandler = csrf({ cookie: true });

export default csrfProtection;

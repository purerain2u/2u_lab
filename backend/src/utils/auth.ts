import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IUser } from '../models/User';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const comparePasswords = async (candidatePassword: string, userPassword: string): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.jwtSecret);
};

export const createSendToken = (user: IUser, statusCode: number, res: any): void => {
  const token = generateToken(user.id);

  const cookieOptions = {
    expires: new Date(Date.now() + config.jwtCookieExpiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: config.nodeEnv === 'production',
  };

  res.cookie('jwt', token, cookieOptions);

  // @ts-ignore
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
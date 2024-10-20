import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import User from '../models/User';
import { AppError } from '../utils/errorClasses';
import { sendEmail } from '../utils/email';
import crypto from 'crypto';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (err) {
    next(new AppError('회원가입 중 오류가 발생했습니다.', 400));
  }
};

export const login = async (email: string, password: string): Promise<{ success: boolean; user?: IUser; message?: string }> => {
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: '로그인 중 오류가 발생했습니다.' };
  }
};

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(new AppError('로그인이 필요합니다.', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('이 토큰에 해당하는 사용자가 더 이상 존재하지 않습니다.', 401));
    }
    (req as any).user = currentUser;
    next();
  } catch (error) {
    next(new AppError('인증에 실패했습니다.', 401));
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return next(new AppError('유효하지 않은 토큰입니다.', 400));
    }
    user.accountStatus.isVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    res.status(200).json({
      status: 'success',
      message: '이메일이 성공적으로 인증되었습니다.'
    });
  } catch (err) {
    next(new AppError('이메일 인증 중 오류가 발생했습니다.', 400));
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('해당 이메일을 가진 사용자가 없습니다.', 404));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `비밀번호를 재설정하려면 다음 링크를 클릭하세요: ${resetURL}`;
    try {
      await sendEmail({
        email: user.email,
        subject: '비밀번호 재설정 (유효 시간 10분)',
        message
      });
      res.status(200).json({
        status: 'success',
        message: '비밀번호 재설정 이메일을 전송했습니다.'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError('이메일 전송 중 오류가 발생했습니다. 나중에 다시 시도해주세요.', 500));
    }
  } catch (err) {
    next(new AppError('비밀번호 재설정 요청 중 오류가 발생했습니다.', 400));
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) {
      return next(new AppError('토큰이 유효하지 않거나 만료되었습니다.', 400));
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    res.status(200).json({
      status: 'success',
      token
    });
  } catch (err) {
    next(new AppError('비밀번호 재설정 중 오류가 발생했습니다.', 400));
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById((req as any).user.id).select('+password');
    if (!user) {
      return next(new AppError('사용자를 찾을 수 없습니다.', 404));
    }
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
      return next(new AppError('현재 비밀번호가 올바르지 않습니다.', 401));
    }
    user.password = req.body.newPassword;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    res.status(200).json({
      status: 'success',
      token
    });
  } catch (err) {
    next(new AppError('비밀번호 업데이트 중 오류가 발생했습니다.', 400));
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndUpdate((req as any).user._id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new AppError('리프레시 토큰이 없습니다.', 401));
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: string };
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(new AppError('이 토큰에 해당하는 사용자가 더 이상 존재하지 않습니다.', 401));
    }

    const token = jwt.sign({ id: currentUser._id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({
      status: 'success',
      token
    });
  } catch (error) {
    next(new AppError('토큰 갱신에 실패했습니다.', 401));
  }
};

import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/userModel';
import sendEmail from '../utils/sendEmails';
import { generateToken, setTokenCookie } from '../utils/tokenGenerator';
import { clientUrl } from '../config/config';

export const forgetPassword = async (req: Request, res: Response) => {
  const { Email } = req.body;
  const user = await User.findOne({ Email });
  if (!user)
    return res
      .status(404)
      .json({ message: 'There is no user with this email address' });
  if (!user.Password)
    return res.status(400).json({ message: 'User signed in with Google' });
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURl = `${clientUrl}/login/resetPassword/${resetToken}`;
  const message = `Forgot your password? Follow this link to reset your password: ${resetURl}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.Email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    return res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error: any) {
    user.PasswordResetToken = undefined;
    user.PasswordResetExpires = undefined;
    // user.PasswordConfirm = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({
      status: 'error',
      message: 'There was an error sending the email. Try again later!',
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const HashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    PasswordResetToken: HashedToken,
    PasswordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({
      message: 'Token is invalid or has expired',
    });
  }
  if (req.body.Password !== req.body.ConfirmPassword) {
    return res.status(400).json({
      message: 'Passwords do not match',
    });
  }
  user.Password = req.body.Password;
  user.PasswordResetToken = undefined;
  user.PasswordResetExpires = undefined;
  await user.save();

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  return res.status(200).json({
    status: 'success',
    token,
  });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const HashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    VerifyEmailToken: HashedToken,
    VerifyEmailExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({
      message: 'Token is invalid or has expired',
    });
  }
  user.isVerified = true;
  user.VerifyEmailToken = undefined;
  user.VerifyEmailExpires = undefined;
  await user.save();

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  return res.status(200).json({
    status: 'success',
    token,
  });
};

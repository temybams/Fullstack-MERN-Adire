/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import cloudinary from 'cloudinary';
import User from '../models/userModel';
import Order from '../models/orderModel';
import sendEmail from '../utils/sendEmails';
import { generateToken, setTokenCookie } from '../utils/tokenGenerator';
import { clientUrl } from '../config/config';

export const uploadProfilePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.files) return next();
    let ProfilePhoto: UploadedFile | UploadedFile[] = req.files.ProfilePhoto;
    if (Array.isArray(ProfilePhoto)) {
      ProfilePhoto = ProfilePhoto[0];
    }
    const filename = `user-${req.user}-${Date.now()}.jpeg`;
    const uploadImage1 = await cloudinary.v2.uploader.upload(
      ProfilePhoto.tempFilePath,
      {
        folder: 'user-images',
        public_id: `${filename}`,
        format: 'jpg',
        overwrite: true,
        invalidate: true,
        width: 500,
        height: 500,
        crop: 'limit',
      },
      (err: any) => {
        if (err) return res.status(500).json({ message: err.message });
      },
    );
    req.body.ProfilePhoto = uploadImage1.secure_url;
    return next();
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { Name, Email, Password } = req.body;
    if (await User.findOne({ Email }))
      return res.status(400).json({ message: 'User already exists' });
    if (req.body.PhoneNumber.startsWith('+234')) {
      req.body.PhoneNumber = req.body.PhoneNumber.replace('+234', '0');
    }
    const normalisedEmail = Email.toLowerCase();
    const newUser = await User.create({
      Name,
      Email: normalisedEmail,
      Password,
      PhoneNumber: req.body.PhoneNumber,
    });
    if (!newUser)
      return res.status(400).json({ message: 'Failed to create user' });
    const verifyEmail = newUser.createVerifyEmailToken();
    await newUser.save({ validateBeforeSave: false });
    const verifyURl = `${clientUrl}/verifyEmail/${verifyEmail}`;
    const message = `Hi, Welcome to Adire ${newUser.Name}, It is great to have you on board.\nVerify your email address by clicking on the link below: ${verifyURl}. \nIf you didn't create an account, please ignore this email`;
    try {
      await sendEmail({
        email: newUser.Email,
        subject: 'Welcome to Adire, Please verify your email address',
        message,
      });
      return res.status(201).json({
        status: 'success',
        message: 'Token sent to email!, please check your email and verify',
      });
    } catch (error: any) {
      newUser.VerifyEmailToken = undefined;
      newUser.VerifyEmailExpires = undefined;
      await newUser.save({ validateBeforeSave: false });
      return res.status(500).json({
        status: 'error',
        message: 'There was an error sending the email. Try again later',
      });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { Email, Password } = req.body;
    const normalisedEmail = Email.toLowerCase();
    const user = await User.findOne({ Email: normalisedEmail });
    if (!user) return res.status(400).json({ message: 'invalid credentials' });
    if (!user.Password)
      return res.status(400).json({ message: 'User signed up with Google' });
    if (user.isVerified === false) {
      const verifyEmail = user.createVerifyEmailToken();
      await user.save({ validateBeforeSave: false });
      const verifyURl = `${clientUrl}/verifyEmail/${verifyEmail}`;
      const message = `Hi ${user.Name}, Your email hasn't been verified yet, please verify your email address by clicking on the link below: ${verifyURl}.\nIf you are having trouble verifying your email, reply to this email with the issue you are experiencing`;
      try {
        await sendEmail({
          email: user.Email,
          subject: 'Verify your email address',
          message,
        });
        return res.status(401).json({
          status: 'Your email is not verified, please verify your email',
          message: 'Token sent to email!, please verify',
        });
      } catch (error: any) {
        user.VerifyEmailToken = undefined;
        user.VerifyEmailExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({
          status: 'error',
          message: 'There was an error sending the email. Try again later',
        });
      }
    }
    if (user && (await user.matchPassword(Password))) {
      const token = generateToken(user._id);
      setTokenCookie(res, token);
      return res
        .status(200)
        .json({ message: 'Logged in successfully', Name: user.Name, token });
    }
    return res.status(400).json({ message: 'Invalid credentials' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

function getMonthName(index: number): string {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[index];
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user).select('-Password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const paidOrders = await Order.find({ Tailor: req.user, isPaid: true });
    const monthlySums = Array.from({ length: 12 }, (_, monthIndex) =>
      paidOrders
        .filter((order) => order.MonthPaid === getMonthName(monthIndex))
        .map((order) => order.Price)
        .reduce((acc, curr) => acc + curr, 0),
    );
    const totalSum = monthlySums.reduce((acc, curr) => acc + curr, 0);
    return res.status(200).json({
      message: 'User fetched successfully',
      user,
      totalSum,
      monthlySums,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const generateReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    const monthNames = [
      'january',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.Tailor.toString() !== req.user)
      return res.status(401).json({ message: 'Order not found' });
    if (order.isPaid === true)
      return res.status(201).json({ message: 'Receipt already generated' });
    order.isPaid = true;
    order.DatePaid = new Date();
    order.MonthPaid = monthNames[order.DatePaid.getMonth()];
    await order.save();
    await User.findByIdAndUpdate(req.user, {
      $push: { ReceiptsGenerated: order._id },
      $inc: { ReceiptsCount: 1, ProfitMade: order.Price },
    });
    return res.status(200).json({ message: 'Receipt generated successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user: any = await User.findById(req.user);
    user.ProfilePhoto = req.body.ProfilePhoto || user.ProfilePhoto;
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (req.body.Password) {
      return res
        .status(400)
        .json({ message: 'Password cannot be updated here' });
    }
    if (req.body.Email) {
      return res.status(400).json({ message: 'Email cannot be updated' });
    }
    if (req.body.PhoneNumber && req.body.PhoneNumber.startsWith('+234')) {
      req.body.PhoneNumber = req.body.PhoneNumber.replace('+234', '0');
    }
    user.Name = req.body.Name || user.Name;
    user.PhoneNumber = req.body.PhoneNumber || user.PhoneNumber;
    user.Address = req.body.Address || user.Address;
    if (req.file) user.ProfilePhoto = req.file.filename || user.ProfilePhoto;
    if (!user.Password) {
      return res.status(400).json({
        message: 'Users signed up with Google cannot update their profile',
      });
    }
    const updatedUser = await user.save();
    if (updatedUser)
      return res
        .status(200)
        .json({ message: 'Profile updated successfully', user: updatedUser });
    return res.status(400).json({ message: 'Failed to update profile' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.Password)
      return res.status(400).json({ message: 'User signed up with Google' });
    if (req.body.Password !== req.body.ConfirmPassword)
      return res.status(400).json({ message: 'Passwords does not match' });
    if (user && (await user.matchPassword(req.body.OldPassword))) {
      user.Password = req.body.Password;
      await user.save();
      return res.status(200).json({ message: 'Password changed successfully' });
    }
    return res.status(400).json({ message: 'Invalid credentials' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const authCheck = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: 'User is authenticated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const signout = async (req: Request, res: Response) => {
  try {
    res.setHeader('Set-Cookie', `jwt=; HttpOnly; Max-Age=${0}; Path=/`);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

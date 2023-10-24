/* eslint-disable no-unused-vars */
import crypto from 'crypto';
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import joi from 'joi';

interface IUser extends Document {
  Name: string;
  Email: string;
  Password: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  PhoneNumber: string;
  Address?: string;
  ProfilePhoto?: string;
  Customers: Array<{ type: mongoose.Types.ObjectId; ref: 'Customer' }>;
  Orders: Array<{ type: mongoose.Types.ObjectId; ref: 'Order' }>;
  ReceiptsGenerated: Array<{ type: mongoose.Types.ObjectId; ref: 'Order' }>;
  ReceiptsCount: number;
  ProfitMade: number;
  // ReceiptsGenerated: number;
  isVerified: boolean;
  GoogleID?: string;
  PasswordResetToken?: string;
  PasswordResetExpires?: Date;
  PasswordChangedAt?: Date;
  VerifyEmailToken?: string;
  VerifyEmailExpires?: Date;
  createPasswordResetToken: () => void;
  createVerifyEmailToken: () => void;
}

const UserValidationSchema = joi.object({
  Name: joi.string().required(),
  Email: joi.string().email().required(),
  Password: joi.string().min(6).required(),
  PhoneNumber: joi
    .string()
    .required()
    .pattern(/^\d{11}$/),
});

const UserSchema = new Schema<IUser>(
  {
    Name: { type: String, required: true, trim: true },
    Email: { type: String, required: true, unique: true, trim: true },
    Password: { type: String, required: true },
    PhoneNumber: { type: String, required: true, unique: true, trim: true },
    Address: { type: String, trim: true },
    ProfilePhoto: {
      type: String,
      default:
        'https://res.cloudinary.com/dw88d3vwv/image/upload/v1696446296/user-images/user-64fb90a339d50a81f563128d-1696446294369.jpeg.jpg',
      trim: true,
    },
    Customers: [{ type: Schema.Types.ObjectId, ref: 'Customer' }],
    Orders: [{ type: mongoose.Types.ObjectId, ref: 'Order' }],
    ReceiptsGenerated: [{ type: mongoose.Types.ObjectId, ref: 'Order' }],
    ReceiptsCount: { type: Number, default: 0 },
    ProfitMade: { type: Number, default: 0 },
    isVerified: { type: Boolean, required: true, default: false },
    GoogleID: { type: String },
    PasswordResetToken: { type: String },
    PasswordResetExpires: { type: Date },
    PasswordChangedAt: { type: Date },
    VerifyEmailToken: { type: String },
    VerifyEmailExpires: { type: Date },
  },
  { timestamps: true },
);

UserSchema.methods.matchPassword = async function matchPassword(
  enteredPassword: string,
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.Password);
};

UserSchema.pre<IUser>('save', async function hashPassword(next) {
  if (!this.isModified('Password')) {
    next();
  }
  try {
    this.Password = await bcrypt.hash(
      this.Password,
      Number(process.env.SALT_ROUNDS!),
    );
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.pre<IUser>('validate', async function validate(next) {
  try {
    const { Name, Email, Password, PhoneNumber } = this;
    const validateUser = await UserValidationSchema.validateAsync(
      { Name, Email, Password, PhoneNumber },
      { abortEarly: false },
    );
    this.set(validateUser);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.pre('save', function passwordChangedDate(next) {
  if (!this.isModified('Password') || this.isNew) return next();
  this.PasswordChangedAt = new Date();
  return next();
});

UserSchema.methods.createPasswordResetToken =
  function createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.PasswordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    console.log({ resetToken }, this.PasswordResetToken);

    this.PasswordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
  };

UserSchema.methods.createVerifyEmailToken = function createVerifyEmailToken() {
  const verifyToken = crypto.randomBytes(32).toString('hex');
  this.VerifyEmailToken = crypto
    .createHash('sha256')
    .update(verifyToken)
    .digest('hex');

  console.log({ verifyToken }, this.VerifyEmailToken);

  this.VerifyEmailExpires = Date.now() + 10 * 60 * 1000;
  return verifyToken;
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;

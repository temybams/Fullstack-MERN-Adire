import mongoose, { Schema, Document } from 'mongoose';
import joi from 'joi';

interface ICustomer extends Document {
  _id: mongoose.Types.ObjectId;
  Name: string;
  Address: string;
  PhoneNumber: string;
  Tailor: mongoose.Types.ObjectId;
  Orders: Array<{ type: mongoose.Types.ObjectId; ref: 'Order' }>;
}

const CustomerValidationSchema = joi.object({
  Name: joi.string().required(),
  Address: joi.string().required(),
  PhoneNumber: joi
    .string()
    .required()
    .pattern(/^\d{11}$/),
});

const CustomerSchema = new Schema<ICustomer>(
  {
    Name: { type: String, required: true, trim: true },
    Address: { type: String, required: true, trim: true },
    PhoneNumber: { type: String, required: true, trim: true },
    Orders: [{ type: mongoose.Types.ObjectId, ref: 'Order' }],
    Tailor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

CustomerSchema.pre<ICustomer>('validate', async function validate(next) {
  try {
    const { Name, Address, PhoneNumber } = this;
    const validateCustomer = await CustomerValidationSchema.validateAsync(
      { Name, Address, PhoneNumber },
      { abortEarly: false },
    );
    this.set(validateCustomer);
    next();
  } catch (error: any) {
    next(error);
  }
});

const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
export default Customer;

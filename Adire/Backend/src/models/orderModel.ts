/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import mongoose, { Schema, Document } from 'mongoose';
import joi from 'joi';

enum eSatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

enum eProjectDuration {
  OneWeek = '1 Week',
  TwoWeeks = '2 Weeks',
  ThreeWeeks = '3 Weeks',
  OneMonth = '1 Month',
  TwoMonths = '2 Months',
  ThreeMonths = '3 Months',
}

export interface IOrder extends Document {
  CustomerName: string;
  MaterialType: string;
  PhoneNumber: string;
  Address: string;
  Measurement: {
    Chest: number;
    Shoulder: number;
    Back: number;
    Neck: number;
    UnderBust: number;
    ArmHole: number;
    HalfLength: number;
    Waist: number;
    TrouserWaist: number;
    Hip: number;
    Thighs: number;
    SleeveLength: number;
    Wrist: number;
    Calf: number;
    Ankle: number;
    TrouserLength: number;
    FullLength: number;
  };
  ProjectDuration: eProjectDuration;
  Status: eSatus;
  DueDate: Date;
  OrderImages: string[];
  Price: number;
  isPaid: boolean;
  DatePaid: Date;
  MonthPaid: String;
  Customer: mongoose.Types.ObjectId;
  Tailor: mongoose.Types.ObjectId;
}

const OrderValidationSchema = joi.object({
  CustomerName: joi.string().required(),
  MaterialType: joi.string().required(),
  PhoneNumber: joi
    .string()
    .required()
    .pattern(/^\d{11}$/),
  Address: joi.string().required(),
  Measurement: joi.object({
    Chest: joi.number().required(),
    Shoulder: joi.number().required(),
    Back: joi.number().required(),
    Neck: joi.number().required(),
    UnderBust: joi.number().required(),
    ArmHole: joi.number().required(),
    HalfLength: joi.number().required(),
    Waist: joi.number().required(),
    TrouserWaist: joi.number().required(),
    Hip: joi.number().required(),
    Thighs: joi.number().required(),
    SleeveLength: joi.number().required(),
    Wrist: joi.number().required(),
    Calf: joi.number().required(),
    Ankle: joi.number().required(),
    TrouserLength: joi.number().required(),
    FullLength: joi.number().required(),
  }),
  ProjectDuration: joi
    .string()
    .valid(...Object.values(eProjectDuration))
    .required(),
  DueDate: joi.date().required(),
  OrderImages: joi.array().items(joi.string()),
  Price: joi.number().required(),
});

const OrderSchema = new Schema<IOrder>(
  {
    CustomerName: { type: String, required: true, trim: true },
    MaterialType: {
      type: String,
      required: true,
    },
    PhoneNumber: { type: String, required: true, trim: true },
    Address: { type: String, required: true, trim: true },
    Measurement: {
      Chest: { type: Number, required: true },
      Shoulder: { type: Number, required: true },
      Back: { type: Number, required: true },
      Neck: { type: Number, required: true },
      UnderBust: { type: Number, required: true },
      ArmHole: { type: Number, required: true },
      HalfLength: { type: Number, required: true },
      Waist: { type: Number, required: true },
      TrouserWaist: { type: Number, required: true },
      Hip: { type: Number, required: true },
      Thighs: { type: Number, required: true },
      SleeveLength: { type: Number, required: true },
      Wrist: { type: Number, required: true },
      Calf: { type: Number, required: true },
      Ankle: { type: Number, required: true },
      TrouserLength: { type: Number, required: true },
      FullLength: { type: Number, required: true },
    },
    Status: {
      type: String,
      enum: Object.values(eSatus),
      required: true,
      default: eSatus.Pending,
    },
    ProjectDuration: {
      type: String,
      enum: Object.values(eProjectDuration),
      required: true,
    },
    DueDate: { type: Date, required: true },
    OrderImages: [{ type: String }],
    Price: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    DatePaid: { type: Date },
    MonthPaid: { type: String },
    Customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    Tailor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

OrderSchema.pre<IOrder>('validate', async function validate(next) {
  try {
    const {
      CustomerName,
      MaterialType,
      PhoneNumber,
      Address,
      ProjectDuration,
      Measurement,
      DueDate,
      OrderImages,
      Price,
    } = this;
    const validateOrder = await OrderValidationSchema.validateAsync(
      {
        CustomerName,
        MaterialType,
        PhoneNumber,
        Address,
        ProjectDuration,
        Measurement,
        DueDate,
        OrderImages,
        Price,
      },
      { abortEarly: false },
    );
    this.set(validateOrder);
    next();
  } catch (error: any) {
    next(error);
  }
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;

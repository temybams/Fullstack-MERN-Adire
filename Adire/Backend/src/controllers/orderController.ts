/* eslint-disable no-unused-vars */
/* eslint-disable no-self-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */

import { Request, Response, NextFunction } from 'express';
import { UploadedFile } from 'express-fileupload';
import cloudinary from 'cloudinary';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';
import Customer from '../models/customerModel';
import Order, { IOrder } from '../models/orderModel';
import User from '../models/userModel';

export const uploadOrderImages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.files) return next();
    console.log(req.files);
    let orderImages: UploadedFile | UploadedFile[] = req.files['OrderImages[]'];
    if (!Array.isArray(orderImages)) {
      orderImages = [orderImages];
    }
    req.body.OrderImages = [];
    await Promise.all(
      orderImages.map(async (file: any, i: number) => {
        const filename = `user-${req.user}-${Date.now()}-${i + 1}.jpeg`;
        const Images = await cloudinary.v2.uploader.upload(
          (orderImages as UploadedFile[])[i].tempFilePath,
          {
            folder: 'order-images',
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
        req.body.OrderImages.push(Images.secure_url);
      }),
    );
    return next();
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const searchCustomer = async (req: Request, res: Response) => {
  try {
    const query = req.query.query;
    const results = await Customer.find(
      {
        Name: { $regex: query, $options: 'i' },
        Tailor: req.user,
      },
      { Name: 1 },
    );
    const customerNames = results.map((customer) => [
      customer.Name,
      customer._id,
    ]);
    res.json(customerNames);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findOne({
      Name: req.body.CustomerName,
      Tailor: req.user,
    });
    if (!customer)
      return res.status(404).json({ message: 'Customer not found' });
    console.log(customer.Tailor.toString());
    console.log(req.user);
    if (customer.Tailor.toString() !== req.user)
      return res.status(401).json({ message: 'Customer not found' });
    req.body.Customer = customer._id.toString();
    req.body.PhoneNumber = customer.PhoneNumber;
    req.body.Address = customer.Address;
    req.body.Tailor = req.user;
    const formattedMeasurementObject: {
      Measurement: any;
    } = { Measurement: {} };
    for (const key in req.body) {
      if (key.startsWith('Measurement')) {
        const formattedKey = key.replace('Measurement[', '').replace(']', '');
        formattedMeasurementObject.Measurement[formattedKey] = req.body[key];
      }
    }
    req.body.Measurement = formattedMeasurementObject.Measurement;
    console.log(req.body);
    const newOrder = await Order.create(req.body as IOrder);
    if (!newOrder)
      return res.status(400).json({ message: 'Failed to create order' });
    await Customer.findByIdAndUpdate(customer._id, {
      $push: { Orders: newOrder._id },
    });
    await User.findByIdAndUpdate(req.user, {
      $push: { Orders: newOrder._id },
    });
    return res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: newOrder,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// export const getOrders = async (req: Request, res: Response) => {
//   try {
//     const query = req.query.query;
//     let orders = await Order.find({ Tailor: req.user });
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 8;
//     const skip = (page - 1) * limit;
//     orders = await Order.find({
//       CustomerName: { $regex: query, $options: 'i' },
//       Tailor: req.user,
//     })
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 });

//     const totalCount = await Order.countDocuments({
//       CustomerName: { $regex: query, $options: 'i' },
//       Tailor: req.user,
//     });
//     return res.status(200).json({
//       data: orders,
//       currentPage: page,
//       totalPages: Math.ceil(totalCount / limit),
//     });
//   } catch (error: any) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// eslint-disable-next-line no-shadow
enum eStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export const getOrders = async (req: Request, res: Response) => {
  try {
    const query = req.query.query;
    const status = req.query.status as eStatus | undefined;
    const sortDirection = req.query.sort === 'Oldest' ? 1 : -1;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const filter: any = {
      CustomerName: { $regex: query, $options: 'i' },
      Tailor: req.user,
    };
    if (status) {
      filter.Status = status;
    }
    const orders = await Order.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sortDirection });
    const totalCount = await Order.countDocuments(filter);

    return res.status(200).json({
      data: orders,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const editOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.Tailor.toString() !== req.user)
      return res.status(401).json({ message: 'Order not found' });
    if (req.body.PhoneNumber) {
      return res.status(400).json({ message: 'PhoneNumber cannot be updated' });
    }
    if (req.body.Address) {
      return res.status(400).json({ message: 'Address cannot be updated' });
    }
    if (req.body.CustomerName) {
      return res
        .status(400)
        .json({ message: 'CustomerName cannot be updated' });
    }
    const formattedMeasurementObject: {
      Measurement: any;
    } = { Measurement: {} };
    for (const key in req.body) {
      if (key.startsWith('Measurement')) {
        const formattedKey = key.replace('Measurement[', '').replace(']', '');
        formattedMeasurementObject.Measurement[formattedKey] = req.body[key];
      }
    }

    req.body.Measurement = formattedMeasurementObject.Measurement;
    // console.log(order);
    // console.log(req.body);
    order.MaterialType = req.body.MaterialType || order.MaterialType;
    order.ProjectDuration = req.body.ProjectDuration || order.ProjectDuration;
    order.Price = req.body.Price || order.Price;
    order.DueDate = req.body.DueDate || order.DueDate;
    // order.Measurement = req.body.Measurement || order.Measurement;
    // order.OrderImages[0] = req.body.OrderImages[0] || order.OrderImages[0];
    // order.OrderImages[1] = req.body.OrderImages[1] || order.OrderImages[1];

    order.Status = req.body.Status || order.Status;
    // order.Measurement.Chest =
    //   req.body.Measurement.Chest || order.Measurement.Chest;
    if (req.body.Measurement.Chest === '') {
      order.Measurement.Chest = order.Measurement.Chest;
    } else {
      order.Measurement.Chest = req.body.Measurement.Chest;
    }
    // order.Measurement.Shoulder =
    //   req.body.Measurement.Shoulder || order.Measurement.Shoulder;
    if (req.body.Measurement.Shoulder === '') {
      order.Measurement.Shoulder = order.Measurement.Shoulder;
    } else {
      order.Measurement.Shoulder = req.body.Measurement.Shoulder;
    }
    // order.Measurement.Back =
    //   req.body.Measurement.Back || order.Measurement.Back;
    if (req.body.Measurement.Back === '') {
      order.Measurement.Back = order.Measurement.Back;
    } else {
      order.Measurement.Back = req.body.Measurement.Back;
    }
    // order.Measurement.Neck =
    //   req.body.Measurement.Neck || order.Measurement.Neck;
    if (req.body.Measurement.Neck === '') {
      order.Measurement.Neck = order.Measurement.Neck;
    } else {
      order.Measurement.Neck = req.body.Measurement.Neck;
    }
    // order.Measurement.UnderBust =
    //   req.body.Measurement.UnderBust || order.Measurement.UnderBust;
    if (req.body.Measurement.UnderBust === '') {
      order.Measurement.UnderBust = order.Measurement.UnderBust;
    } else {
      order.Measurement.UnderBust = req.body.Measurement.UnderBust;
    }
    // order.Measurement.ArmHole =
    //   req.body.Measurement.ArmHole || order.Measurement.ArmHole;
    if (req.body.Measurement.ArmHole === '') {
      order.Measurement.ArmHole = order.Measurement.ArmHole;
    } else {
      order.Measurement.ArmHole = req.body.Measurement.ArmHole;
    }
    // order.Measurement.HalfLength =
    //   req.body.Measurement.HalfLength || order.Measurement.HalfLength;
    if (req.body.Measurement.HalfLength === '') {
      order.Measurement.HalfLength = order.Measurement.HalfLength;
    } else {
      order.Measurement.HalfLength = req.body.Measurement.HalfLength;
    }
    // order.Measurement.Waist =
    //   req.body.Measurement.Waist || order.Measurement.Waist;
    if (req.body.Measurement.Waist === '') {
      order.Measurement.Waist = order.Measurement.Waist;
    } else {
      order.Measurement.Waist = req.body.Measurement.Waist;
    }
    // order.Measurement.TrouserWaist =
    //   req.body.Measurement.TrouserWaist || order.Measurement.TrouserWaist;
    if (req.body.Measurement.TrouserWaist === '') {
      order.Measurement.TrouserWaist = order.Measurement.TrouserWaist;
    } else {
      order.Measurement.TrouserWaist = req.body.Measurement.TrouserWaist;
    }
    // order.Measurement.Hip = req.body.Measurement.Hip || order.Measurement.Hip;
    if (req.body.Measurement.Hip === '') {
      order.Measurement.Hip = order.Measurement.Hip;
    } else {
      order.Measurement.Hip = req.body.Measurement.Hip;
    }
    // order.Measurement.FullLength =
    //   req.body.Measurement.FullLength || order.Measurement.FullLength;
    if (req.body.Measurement.FullLength === '') {
      order.Measurement.FullLength = order.Measurement.FullLength;
    } else {
      order.Measurement.FullLength = req.body.Measurement.FullLength;
    }
    // order.Measurement.Ankle =
    //   req.body.Measurement.Ankle || order.Measurement.Ankle;
    if (req.body.Measurement.Ankle === '') {
      order.Measurement.Ankle = order.Measurement.Ankle;
    } else {
      order.Measurement.Ankle = req.body.Measurement.Ankle;
    }
    // order.Measurement.Thighs =
    //   req.body.Measurement.Thighs || order.Measurement.Thighs;
    if (req.body.Measurement.Thighs === '') {
      order.Measurement.Thighs = order.Measurement.Thighs;
    } else {
      order.Measurement.Thighs = req.body.Measurement.Thighs;
    }
    // order.Measurement.SleeveLength =
    //   req.body.Measurement.SleeveLength || order.Measurement.SleeveLength;
    if (req.body.Measurement.SleeveLength === '') {
      order.Measurement.SleeveLength = order.Measurement.SleeveLength;
    } else {
      order.Measurement.SleeveLength = req.body.Measurement.SleeveLength;
    }
    // order.Measurement.Wrist =
    //   req.body.Measurement.Wrist || order.Measurement.Wrist;
    if (req.body.Measurement.Wrist === '') {
      order.Measurement.Wrist = order.Measurement.Wrist;
    } else {
      order.Measurement.Wrist = req.body.Measurement.Wrist;
    }
    // order.Measurement.Calf =
    //   req.body.Measurement.Calf || order.Measurement.Calf;
    if (req.body.Measurement.Calf === '') {
      order.Measurement.Calf = order.Measurement.Calf;
    } else {
      order.Measurement.Calf = req.body.Measurement.Calf;
    }
    // order.Measurement.TrouserLength =
    //   req.body.Measurement.TrouserLength || order.Measurement.TrouserLength;
    if (req.body.Measurement.TrouserLength === '') {
      order.Measurement.TrouserLength = order.Measurement.TrouserLength;
    } else {
      order.Measurement.TrouserLength = req.body.Measurement.TrouserLength;
    }
    order.Measurement = order.Measurement;
    // console.log(order.Measurement);
    const updatedOrder = await Order.findByIdAndUpdate(id, order, {
      new: true,
    });
    console.log(updatedOrder);
    return res.status(200).json({
      status: 'success',
      message: 'Order updated successfully',
      data: updatedOrder,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.Tailor.toString() !== req.user)
      return res.status(401).json({ message: 'Order not found' });
    return res.status(200).json({ data: order });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.Tailor.toString() !== req.user)
      return res.status(401).json({ message: 'Order not found' });
    // if (order.isPaid === true)
    //   return res
    //     .status(401)
    //     .json({ message: 'Cannot delete order that has been paid for' });
    await Order.findByIdAndDelete(id);
    await Customer.findByIdAndUpdate(order.Customer.toString(), {
      $pull: { Orders: order._id },
    });
    await User.findByIdAndUpdate(req.user, {
      $pull: { Orders: order._id },
    });
    return res.status(200).json({
      status: 'success',
      message: 'Order deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getReceipts = async (req: Request, res: Response) => {
  try {
    let receipts = await Order.find({ Tailor: req.user, isPaid: true });
    // if (receipts.length === 0)
    //   return res
    //     .status(400)
    //     .json({ message: 'You have not made any orders yet' });
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    receipts = await Order.find({ Tailor: req.user, isPaid: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCount = await Order.countDocuments({
      Tailor: req.user,
      isPaid: true,
    });
    const receiptData = receipts.map((receipt) => ({
      ID: receipt._id.toString(),
      Name: receipt.CustomerName,
      PhoneNumber: receipt.PhoneNumber,
      Address: receipt.Address,
      MaterialType: receipt.MaterialType,
      Measurements: `Length ${receipt.Measurement.FullLength}, Chest ${receipt.Measurement.Chest}, Ankle ${receipt.Measurement.Ankle}, Thigh ${receipt.Measurement.Thighs}, Lap ${receipt.Measurement.Thighs}`,
      Date: receipt.DueDate.toDateString()
        .split(' ')
        .splice(1)
        .join(', ')
        .replace(',', ''),
      Duration: receipt.ProjectDuration,
    }));
    return res.status(200).json({
      data: receiptData,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const receipt = await Order.findById(id);
    if (!receipt) return res.status(404).json({ message: 'Receipt not found' });
    // if (receipt.Tailor.toString() !== req.user)
    //   return res.status(401).json({ message: 'Receipt not found' });
    return res.status(200).json({
      data: {
        ID: receipt._id.toString(),
        Name: receipt.CustomerName,
        PhoneNumber: receipt.PhoneNumber,
        Address: receipt.Address,
        MaterialType: receipt.MaterialType,
        Measurements: `Length ${receipt.Measurement.FullLength}, Chest ${receipt.Measurement.Chest}, Ankle ${receipt.Measurement.Ankle}, Thigh ${receipt.Measurement.Thighs}, Lap ${receipt.Measurement.Thighs}`,
        Date: receipt.DueDate.toDateString()
          .split(' ')
          .splice(1)
          .join(', ')
          .replace(',', ''),
        Duration: receipt.ProjectDuration,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getReceiptPDF = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const receipt = await Order.findById(id);
    if (!receipt) return res.status(404).json({ message: 'Receipt not found' });
    // if (receipt.Tailor.toString() !== req.user)
    //   return res.status(401).json({ message: 'Receipt not found' });
    const directoryPath = path.join(__dirname, '..', '..', 'pdfs');
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    const doc = new PDFDocument();
    const pdfFilePath = path.join(directoryPath, 'receipt.pdf');
    const stream = doc.pipe(fs.createWriteStream(pdfFilePath));
    doc
      .fontSize(20)
      .text('Receipt Summary', { align: 'center' })
      .moveDown()
      .fontSize(12)
      .text(`Name: ${receipt.CustomerName}`)
      .moveDown()
      .text(`Phone Number: ${receipt.PhoneNumber}`)
      .moveDown()
      .text(`Address: ${receipt.Address}`)
      .moveDown()
      .text(`Material Type: ${receipt.MaterialType}`)
      .moveDown()
      .text(
        `Measurements: Full Length ${receipt.Measurement.FullLength}, Chest ${receipt.Measurement.Chest}, Ankle ${receipt.Measurement.Ankle}, Thighs ${receipt.Measurement.Thighs}, Shoulder ${receipt.Measurement.Shoulder}, Back ${receipt.Measurement.Back}, Neck ${receipt.Measurement.Neck}, Under Bust ${receipt.Measurement.UnderBust}, Arm Hole ${receipt.Measurement.ArmHole}, Half Length ${receipt.Measurement.HalfLength}, Waist ${receipt.Measurement.Waist}, Trouser Waist ${receipt.Measurement.TrouserWaist}, Hip ${receipt.Measurement.Hip}, Wrist ${receipt.Measurement.Wrist}, Calf ${receipt.Measurement.Calf} , Trouser Length ${receipt.Measurement.TrouserLength}`,
      )
      .moveDown()
      .text(`Order Image: ${receipt.OrderImages[0]}`)
      .text(`Order Image: ${receipt.OrderImages[1]}`)
      .moveDown()
      .text(
        `Due Date: ${receipt.DueDate.toDateString()
          .split(' ')
          .splice(1)
          .join(', ')
          .replace(',', '')}`,
      )
      .moveDown()
      .text(`Duration: ${receipt.ProjectDuration}`)
      .moveDown()
      .text(`Amount Paid: ${receipt.Price} Naira`)
      .moveDown()
      .text(
        `Date Paid: ${receipt.DatePaid.toDateString()
          .split(' ')
          .splice(1)
          .join(', ')
          .replace(',', '')}`,
      )
      .moveDown()
      .text(`Generated on ${new Date(Date.now()).toLocaleString()}`)
      .moveDown()
      .text(
        `Receipt ID: Adire${receipt.CustomerName.slice(0, 3)}${
          receipt._id
        }${receipt.Tailor.toString().slice(0, 3)}`,
      )
      .moveDown()
      .text(`Tailor ID: ${receipt.Tailor.toString()}`)
      .moveDown()
      .text(`Customer ID: ${receipt.Customer.toString()}`);
    doc.end();
    stream.on('finish', async () => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=AdireReceipt.pdf`,
      );
      const fileStream = fs.createReadStream(pdfFilePath);
      fileStream.pipe(res);
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

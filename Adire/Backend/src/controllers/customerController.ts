/* eslint-disable prefer-destructuring */
import { Request, Response } from 'express';
import Customer from '../models/customerModel';
import User from '../models/userModel';

export const addCustomer = async (req: Request, res: Response) => {
  try {
    req.body.Tailor = req.user;
    const uniqueCustomer = await Customer.findOne({ Name: req.body.Name });
    if (uniqueCustomer && uniqueCustomer.Tailor.toString() === req.user) {
      return res.status(400).json({ message: 'Customer already exists' });
    }
    if (req.body.PhoneNumber.startsWith('+234')) {
      req.body.PhoneNumber = req.body.PhoneNumber.replace('+234', '0');
    }
    const newCustomer = await Customer.create(req.body);
    await User.findByIdAndUpdate(req.user, {
      $push: { Customers: newCustomer._id },
    }).populate('Customers');
    return res
      .status(201)
      .json({ message: 'Customer added successfully', newCustomer });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const query = req.query.query;
    let customers = await Customer.find({ Tailor: req.user });
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    customers = await Customer.find({
      Name: { $regex: query, $options: 'i' },
      Tailor: req.user,
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCount = await Customer.countDocuments({
      Name: { $regex: query, $options: 'i' },
      Tailor: req.user,
    });
    return res.status(200).json({
      message: 'Customers fetched successfully',
      customers,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer)
      return res.status(404).json({ message: 'Customer not found' });
    if (customer.Tailor.toString() !== req.user)
      return res
        .status(401)
        .json({ message: 'Not authorised to view this customer' });
    return res
      .status(200)
      .json({ message: 'Customer fetched successfully', customer });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer)
      return res.status(404).json({ message: 'Customer not found' });
    const uniqueCustomer = await Customer.findOne({ Name: req.body.Name });
    if (uniqueCustomer && uniqueCustomer.Tailor.toString() === req.user) {
      return res.status(400).json({ message: 'Choose a different name' });
    }
    if (customer.Tailor.toString() !== req.user)
      return res
        .status(401)
        .json({ message: 'Not authorised to update this customer' });
    if (req.body.PhoneNumber && req.body.PhoneNumber.startsWith('+234')) {
      req.body.PhoneNumber = req.body.PhoneNumber.replace('+234', '0');
    }
    customer.Name = req.body.Name || customer.Name;
    customer.Address = req.body.Address || customer.Address;
    customer.PhoneNumber = req.body.PhoneNumber || customer.PhoneNumber;
    const updatedCustomer = await customer.save();
    return res
      .status(200)
      .json({ message: 'Customer updated successfully', updatedCustomer });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer)
      return res.status(404).json({ message: 'Customer not found' });
    if (customer.Tailor.toString() !== req.user)
      return res
        .status(401)
        .json({ message: 'Not authorised to delete this customer' });
    await Customer.findByIdAndDelete(id);
    await User.findByIdAndUpdate(req.user, {
      $pull: { Customers: id },
    }).populate('Customers');
    return res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

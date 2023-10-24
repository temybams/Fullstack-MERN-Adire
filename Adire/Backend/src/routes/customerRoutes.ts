import express from 'express';
import {
  addCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController';
import { protect } from '../middleware/protectMiddleware';

const router = express.Router();

router.post('/addcustomer', protect, addCustomer);
router.get('/getcustomers', protect, getCustomers);
router.get('/getcustomer/:id', protect, getCustomer);
router.patch('/updatecustomer/:id', protect, updateCustomer);
router.delete('/deletecustomer/:id', protect, deleteCustomer);

export default router;

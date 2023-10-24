// import multer from 'multer';
import express from 'express';
import {
  createOrder,
  getOrders,
  editOrder,
  getOrder,
  deleteOrder,
  uploadOrderImages,
  searchCustomer,
  getReceipt,
  getReceipts,
  getReceiptPDF,
} from '../controllers/orderController';
import { protect } from '../middleware/protectMiddleware';

// const upload = multer({ dest: 'public/images/order-images' });
const router = express.Router();

router.get('/searchcustomer', protect, searchCustomer);
router.post('/createorder', protect, uploadOrderImages, createOrder);
router.get('/getorders', protect, getOrders);
router.get('/getorder/:id', protect, getOrder);
router.patch('/editorder/:id', protect, uploadOrderImages, editOrder);
router.delete('/deleteorder/:id', protect, deleteOrder);
router.get('/getreceipt/:id', getReceipt);
router.get('/getreceipts', protect, getReceipts);
router.get('/downloadreceipt/:id', getReceiptPDF);

export default router;

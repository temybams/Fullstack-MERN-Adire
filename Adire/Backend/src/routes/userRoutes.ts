import express from 'express';

import { protect } from '../middleware/protectMiddleware';
import {
  forgetPassword,
  resetPassword,
  verifyEmail,
} from '../middleware/authMiddleware';
import {
  signup,
  signout,
  signin,
  authCheck,
  getUser,
  updateUser,
  changePassword,
  // uploadProfilePhoto,
  uploadProfilePhoto,
  generateReceipt,
} from '../controllers/userController';

const router = express.Router();

router.get('/authcheck', protect, authCheck);
router.get('/', protect, getUser);
router.post('/signup', signup);
router.post('/signout', protect, signout);
router.post('/signin', signin);
router.post('/forgetpassword', forgetPassword);
router.post('/generatereceipt/:id', protect, generateReceipt);
router.patch('/changepassword', protect, changePassword);
router.patch('/updateprofile', protect, uploadProfilePhoto, updateUser);
router.patch('/resetpassword/:token', resetPassword);
router.patch('/verifyemail/:token', verifyEmail);

export default router;

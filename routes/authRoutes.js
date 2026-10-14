import express from 'express';
import {
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

// Autentiseringsrutter
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

export default router;
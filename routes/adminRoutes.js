import express from 'express';
import { getAllUsers, updateUserRole } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js'; // Justera sökvägen om din fil heter något annat

const router = express.Router();

// Skydda ALLA admin-rutter: kräver giltig JWT och 'admin'-roll
router.use(protect, authorize('admin'));

// GET /api/admin/users – Hämta alla användare
router.get('/users', getAllUsers);

// PATCH /api/admin/users/:id/role – Uppgradera/ändra användarroll
router.patch('/users/:id/role', updateUserRole);

export default router;
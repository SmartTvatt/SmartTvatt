import express from 'express';
import { getFaultReports } from '../controllers/faultReportController.js';
import { getAllUsers, sendMessage, updateUserRole } from '../controllers/adminController.js';
import { resetTimeSlotDay, updateTimeSlots } from '../controllers/timeSlotApiController.js';
import { protect, authorize } from '../middleware/authMiddleware.js'; // Justera sökvägen om din fil heter något annat

const router = express.Router();

// Skydda ALLA admin-rutter: kräver giltig JWT och 'admin'-roll
router.use(protect, authorize('admin'));

// GET /api/admin/users – Hämta alla användare
router.get('/users', getAllUsers);

// PATCH /api/admin/users/:id/role – Uppgradera/ändra användarroll
router.patch('/users/:id/role', updateUserRole);

// GET/PUT schedule data is only writable by an authenticated administrator.
router.put('/timeslots', updateTimeSlots);
router.delete('/timeslots/:dayKey', resetTimeSlotDay);

// Serverns /api/admin-prefix gör detta till POST /api/admin/messages.
router.post('/messages', sendMessage);
router.get('/fault-reports', getFaultReports);

export default router;
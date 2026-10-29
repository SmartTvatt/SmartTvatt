import express from 'express';
import { createFaultReport } from '../controllers/faultReportController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('boende'), createFaultReport);

export default router;

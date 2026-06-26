import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { getInventoryInsights, getHealthScore } from '../controllers/aiController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/insights', getInventoryInsights);
router.get('/health-score', getHealthScore);

export default router;

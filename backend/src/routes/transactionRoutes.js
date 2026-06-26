import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  createTransaction,
  getTransactionHistory,
  getProductTransactions,
  getRecentTransactions
} from '../controllers/transactionController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createTransaction);
router.get('/', getTransactionHistory);
router.get('/recent', getRecentTransactions);
router.get('/product/:productId', getProductTransactions);

export default router;

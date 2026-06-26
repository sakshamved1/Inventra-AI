import express from 'express';
import { register, login, getCurrentUser, listUsers, approveUser, updateUserPermissions } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/users', authMiddleware, listUsers);
router.put('/users/:id/approve', authMiddleware, approveUser);
router.put('/users/:id/permissions', authMiddleware, updateUserPermissions);

export default router;

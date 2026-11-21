import { Router } from 'express';
import { health } from '../controllers/healthController.js';
import authRoutes from './authRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import taskRoutes from './taskRoutes.js';

const router = Router();

router.get('/health', health);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/tasks', taskRoutes);

export default router;

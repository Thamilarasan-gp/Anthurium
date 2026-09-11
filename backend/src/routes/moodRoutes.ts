import { Router } from 'express';
import { getMoods, createMood, updateMood, deleteMood } from '../controllers/moodController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getMoods);
router.post('/', protect, adminOnly, createMood);
router.put('/:id', protect, adminOnly, updateMood);
router.delete('/:id', protect, adminOnly, deleteMood);

export default router;

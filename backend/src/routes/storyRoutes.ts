import { Router } from 'express';
import { getStories, createStory, updateStory, deleteStory } from '../controllers/storyController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getStories);
router.post('/', protect, adminOnly, createStory);
router.put('/:id', protect, adminOnly, updateStory);
router.delete('/:id', protect, adminOnly, deleteStory);

export default router;

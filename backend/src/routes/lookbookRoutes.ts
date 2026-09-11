import { Router } from 'express';
import { getLookbooks, createLookbook, updateLookbook, deleteLookbook } from '../controllers/lookbookController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getLookbooks);
router.post('/', protect, adminOnly, createLookbook);
router.put('/:id', protect, adminOnly, updateLookbook);
router.delete('/:id', protect, adminOnly, deleteLookbook);

export default router;

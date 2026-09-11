import { Router } from 'express';
import {
  getHeroSections,
  getAllHeroSectionsAdmin,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection
} from '../controllers/heroController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getHeroSections);
router.get('/admin/all', protect, adminOnly, getAllHeroSectionsAdmin);
router.post('/', protect, adminOnly, createHeroSection);
router.put('/:id', protect, adminOnly, updateHeroSection);
router.delete('/:id', protect, adminOnly, deleteHeroSection);

export default router;

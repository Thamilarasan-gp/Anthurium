import { Router } from 'express';
import {
  getCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection
} from '../controllers/collectionController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCollections);
router.get('/slug/:slug', getCollectionBySlug);
router.post('/', protect, adminOnly, createCollection);
router.put('/:id', protect, adminOnly, updateCollection);
router.delete('/:id', protect, adminOnly, deleteCollection);

export default router;

import { Router } from 'express';
import { getWebsiteSettings, updateWebsiteSettingsAdmin } from '../controllers/settingsController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getWebsiteSettings);
router.put('/admin', protect, adminOnly, updateWebsiteSettingsAdmin);

export default router;

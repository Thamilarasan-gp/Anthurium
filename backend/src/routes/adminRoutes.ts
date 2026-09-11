import { Router } from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware';

// Controllers
import {
  getAdminDashboardAnalytics,
  getAdminCustomers,
  getAdminCustomerById,
  getAdminInventory,
  updateInventoryStock
} from '../controllers/adminController';
import {
  getAllProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection
} from '../controllers/collectionController';
import {
  getAllOrdersAdmin,
  getOrderById,
  updateOrderStatusAdmin
} from '../controllers/orderController';
import {
  getAllHeroSectionsAdmin,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection
} from '../controllers/heroController';
import {
  getStories,
  createStory,
  updateStory,
  deleteStory
} from '../controllers/storyController';
import {
  getLookbooks,
  createLookbook,
  updateLookbook,
  deleteLookbook
} from '../controllers/lookbookController';
import {
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner
} from '../controllers/bannerController';
import {
  getAllReviewsAdmin,
  updateReviewStatusAdmin,
  deleteReviewAdmin
} from '../controllers/reviewController';
import {
  getAllCouponsAdmin,
  createCouponAdmin,
  updateCouponAdmin,
  deleteCouponAdmin
} from '../controllers/couponController';
import {
  getWebsiteSettings,
  updateWebsiteSettingsAdmin
} from '../controllers/settingsController';

const router = Router();

// Apply protect & adminOnly to ALL admin routes uniformly
router.use(protect, adminOnly);

// 1. Analytics & Overview
router.get('/analytics', getAdminDashboardAnalytics);

// 2. Products
router.get('/products', getAllProductsAdmin);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// 3. Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// 4. Collections
router.get('/collections', getCollections);
router.post('/collections', createCollection);
router.put('/collections/:id', updateCollection);
router.delete('/collections/:id', deleteCollection);

// 5. Orders
router.get('/orders', getAllOrdersAdmin);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', updateOrderStatusAdmin);
router.put('/orders/:id', updateOrderStatusAdmin);

// 6. Customers
router.get('/customers', getAdminCustomers);
router.get('/customers/:id', getAdminCustomerById);

// 7. Inventory
router.get('/inventory', getAdminInventory);
router.post('/inventory/quick-update', updateInventoryStock);

// 8. CMS: Hero Slides
router.get('/hero', getAllHeroSectionsAdmin);
router.post('/hero', createHeroSection);
router.put('/hero/:id', updateHeroSection);
router.delete('/hero/:id', deleteHeroSection);

// 9. CMS: Stories
router.get('/stories', getStories);
router.post('/stories', createStory);
router.put('/stories/:id', updateStory);
router.delete('/stories/:id', deleteStory);

// 10. CMS: Lookbook
router.get('/lookbook', getLookbooks);
router.post('/lookbook', createLookbook);
router.put('/lookbook/:id', updateLookbook);
router.delete('/lookbook/:id', deleteLookbook);

// 11. CMS: Banners
router.get('/banners', getAllBannersAdmin);
router.post('/banners', createBanner);
router.put('/banners/:id', updateBanner);
router.delete('/banners/:id', deleteBanner);

// 12. Reviews
router.get('/reviews', getAllReviewsAdmin);
router.put('/reviews/:id', updateReviewStatusAdmin);
router.delete('/reviews/:id', deleteReviewAdmin);

// 13. Coupons
router.get('/coupons', getAllCouponsAdmin);
router.post('/coupons', createCouponAdmin);
router.put('/coupons/:id', updateCouponAdmin);
router.delete('/coupons/:id', deleteCouponAdmin);

// 14. Website Settings
router.get('/settings', getWebsiteSettings);
router.put('/settings', updateWebsiteSettingsAdmin);

export default router;

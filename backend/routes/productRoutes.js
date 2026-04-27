import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories } from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.post('/', protect, authorize('seller', 'tenant_admin', 'super_admin'), createProduct);
router.put('/:id', protect, authorize('seller', 'tenant_admin', 'super_admin'), updateProduct);
router.delete('/:id', protect, authorize('tenant_admin', 'super_admin'), deleteProduct);

export default router;
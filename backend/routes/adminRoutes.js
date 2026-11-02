import { Router } from 'express';
import { getAllUsers, getUserById, updateUserById, deleteUserById } from '../controllers/adminController.js';
import {
    createProduct,
    createCategory,
    deleteProduct,
    getAllProducts,
    getCategories,
    getProductById,
    updateProduct,
} from '../controllers/productController.js';
import { uploadProductImage } from '../middlewares/uploadMiddleware.js';

const router = Router();

// Admin routes for user management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUserById);
router.delete('/users/:id', deleteUserById);

// Admin routes for product management
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/product-images', uploadProductImage.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'An image file is required' });
    return res.status(201).json({
        url: `/uploads/productImages/${req.file.filename}`,
        alt: req.file.originalname,
    });
});

export default router;
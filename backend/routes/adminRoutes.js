import { Router } from 'express';
import { getAllUsers, getUserById, updateUserById, deleteUserById } from '../controllers/adminController.js';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
} from '../controllers/productController.js';

const router = Router();

// Admin routes for user management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUserById);
router.delete('/users/:id', deleteUserById);

// Admin routes for product management
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
import { Router } from 'express';
import { getAllUsers, getUserById, updateUserById, deleteUserById } from '../controllers/adminController.js';

const router = Router();

// Admin routes for user management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUserById);
router.delete('/users/:id', deleteUserById);

export default router;
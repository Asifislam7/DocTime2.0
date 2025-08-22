import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

/**
 * User Routes
 * 
 * This router handles all user-related endpoints:
 * - User creation and management
 * - Profile updates
 * - User queries and statistics
 * - Admin operations
 */

// Health check endpoint
// router.get('/health', UserController.healthCheck);

// User creation
router.post('/', UserController.createUser);

// Get user statistics (Admin only)
// router.get('/stats', UserController.getUserStats);

// Get all users with pagination and filtering
router.get('/', UserController.getUsers);

// Get user by MongoDB ID
router.get('/:userId', UserController.getUserById);

// Get user by Clerk ID
router.get('/clerk/:clerkUserId', UserController.getUserByClerkId);

// Update user profile
router.put('/clerk/:clerkUserId', UserController.updateUser);

// Update user status (Admin only)
router.patch('/clerk/:clerkUserId/status', UserController.updateUserStatus);

// Delete user (soft delete)
router.delete('/clerk/:clerkUserId', UserController.deleteUser);

export default router;

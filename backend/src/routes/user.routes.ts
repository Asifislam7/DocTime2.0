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

// Get all users with pagination and filtering
router.get('/', UserController.getUsers);

// Get user by email (must come before /:userId to avoid conflicts)
router.get('/email/:email', UserController.getUserByEmail);

// Get user by Clerk ID
router.get('/clerk/:clerkUserId', UserController.getUserByClerkId);

// Get user by MongoDB ID (must come last to avoid catching other routes)
router.get('/:userId', UserController.getUserById);

// Update user profile
router.put('/clerk/:clerkUserId', UserController.updateUser);

// Update user status (Admin only)
router.patch('/clerk/:clerkUserId/status', UserController.updateUserStatus);

// Delete user (soft delete)
router.delete('/clerk/:clerkUserId', UserController.deleteUser);

export default router;

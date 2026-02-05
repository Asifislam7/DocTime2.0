"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
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
router.post('/', user_controller_1.UserController.createUser);
// Get all users with pagination and filtering
router.get('/', user_controller_1.UserController.getUsers);
// Get user by email (must come before /:userId to avoid conflicts)
router.get('/email/:email', user_controller_1.UserController.getUserByEmail);
// Get user by Clerk ID
router.get('/clerk/:clerkUserId', user_controller_1.UserController.getUserByClerkId);
// Get user by MongoDB ID (must come last to avoid catching other routes)
router.get('/:userId', user_controller_1.UserController.getUserById);
// Update user profile
router.put('/clerk/:clerkUserId', user_controller_1.UserController.updateUser);
// Update user status (Admin only)
router.patch('/clerk/:clerkUserId/status', user_controller_1.UserController.updateUserStatus);
// Delete user (soft delete)
router.delete('/clerk/:clerkUserId', user_controller_1.UserController.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map
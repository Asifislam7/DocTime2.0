"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const user_types_1 = require("../types/user.types");
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * User Controller - Handles HTTP requests for user operations
 *
 * This controller layer handles:
 * - Request validation
 * - Response formatting
 * - Error handling
 * - HTTP status codes
 */
class UserController {
    /**
     * Create a new user
     * POST /api/v1/users
     */
    static async createUser(req, res, next) {
        try {
            const userData = req.body;
            // Basic validation
            if (!userData.clerkUserId || !userData.email || !userData.name || !userData.role) {
                throw new errorHandler_1.ApiError('Missing required fields: clerkUserId, email, name, role', 400);
            }
            // Validate role
            if (!Object.values(user_types_1.UserRole).includes(userData.role)) {
                throw new errorHandler_1.ApiError('Invalid user role', 400);
            }
            // Create user through service
            const user = await user_service_1.UserService.createUser(userData);
            // Return success response
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    id: user._id,
                    clerkUserId: user.clerkUserId,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    status: user.status,
                    createdAt: user.createdAt
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get user by Clerk ID
     * GET /api/v1/users/clerk/:clerkUserId
     */
    static async getUserByClerkId(req, res, next) {
        try {
            const { clerkUserId } = req.params;
            if (!clerkUserId) {
                throw new errorHandler_1.ApiError('Clerk user ID is required', 400);
            }
            const user = await user_service_1.UserService.getUserByClerkId(clerkUserId);
            if (!user) {
                throw new errorHandler_1.ApiError('User not found', 404);
            }
            res.status(200).json({
                success: true,
                data: user
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get user by MongoDB ID
     * GET /api/v1/users/:userId
     */
    static async getUserById(req, res, next) {
        try {
            const { userId } = req.params;
            if (!userId) {
                throw new errorHandler_1.ApiError('User ID is required', 400);
            }
            const user = await user_service_1.UserService.getUserById(userId);
            if (!user) {
                throw new errorHandler_1.ApiError('User not found', 404);
            }
            res.status(200).json({
                success: true,
                data: user
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get user by email
     * GET /api/v1/users/email/:email
     */
    static async getUserByEmail(req, res, next) {
        try {
            const { email } = req.params;
            if (!email) {
                throw new errorHandler_1.ApiError('Email is required', 400);
            }
            const user = await user_service_1.UserService.getUserByEmail(email);
            if (!user) {
                throw new errorHandler_1.ApiError('User not found', 404);
            }
            res.status(200).json({
                success: true,
                data: user
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update user profile
     * PUT /api/v1/users/clerk/:clerkUserId
     */
    static async updateUser(req, res, next) {
        try {
            const { clerkUserId } = req.params;
            const updateData = req.body;
            if (!clerkUserId) {
                throw new errorHandler_1.ApiError('Clerk user ID is required', 400);
            }
            if (Object.keys(updateData).length === 0) {
                throw new errorHandler_1.ApiError('No update data provided', 400);
            }
            // Validate date format if provided
            if (updateData.dateOfBirth) {
                const date = new Date(updateData.dateOfBirth);
                if (isNaN(date.getTime())) {
                    throw new errorHandler_1.ApiError('Invalid date format', 400);
                }
            }
            const updatedUser = await user_service_1.UserService.updateUser(clerkUserId, updateData);
            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: updatedUser
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update user status (Admin only)
     * PATCH /api/v1/users/clerk/:clerkUserId/status
     */
    static async updateUserStatus(req, res, next) {
        try {
            const { clerkUserId } = req.params;
            const { status } = req.body;
            if (!clerkUserId) {
                throw new errorHandler_1.ApiError('Clerk user ID is required', 400);
            }
            if (!status || !Object.values(user_types_1.UserStatus).includes(status)) {
                throw new errorHandler_1.ApiError('Valid status is required', 400);
            }
            const updatedUser = await user_service_1.UserService.updateUserStatus(clerkUserId, status);
            res.status(200).json({
                success: true,
                message: 'User status updated successfully',
                data: {
                    id: updatedUser._id,
                    clerkUserId: updatedUser.clerkUserId,
                    status: updatedUser.status,
                    updatedAt: updatedUser.updatedAt
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get all users with pagination and filtering
     * GET /api/v1/users
     */
    static async getUsers(req, res, next) {
        try {
            const { page = 1, limit = 10, role, status, search } = req.query;
            // Validate query parameters
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            if (isNaN(pageNum) || pageNum < 1) {
                throw new errorHandler_1.ApiError('Page must be a positive number', 400);
            }
            if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
                throw new errorHandler_1.ApiError('Limit must be between 1 and 100', 400);
            }
            // Validate role if provided
            if (role && !Object.values(user_types_1.UserRole).includes(role)) {
                throw new errorHandler_1.ApiError('Invalid user role', 400);
            }
            // Validate status if provided
            if (status && !Object.values(user_types_1.UserStatus).includes(status)) {
                throw new errorHandler_1.ApiError('Invalid user status', 400);
            }
            const result = await user_service_1.UserService.getUsers({
                page: pageNum,
                limit: limitNum,
                role: role,
                status: status,
                search: search
            });
            res.status(200).json({
                success: true,
                data: result.users,
                pagination: result.pagination
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete user (soft delete)
     * DELETE /api/v1/users/clerk/:clerkUserId
     */
    static async deleteUser(req, res, next) {
        try {
            const { clerkUserId } = req.params;
            if (!clerkUserId) {
                throw new errorHandler_1.ApiError('Clerk user ID is required', 400);
            }
            await user_service_1.UserService.deleteUser(clerkUserId);
            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map
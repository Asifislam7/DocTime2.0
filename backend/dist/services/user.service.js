"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_model_1 = require("../models/User.model");
const user_types_1 = require("../types/user.types");
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * User Service - Handles all user-related business logic
 *
 * This service layer separates business logic from controllers,
 * making the code more maintainable and testable.
 */
class UserService {
    /**
     * Create a new user in the system
     *
     * @param userData - User creation data
     * @returns Promise<UserDocument> - Created user document
     * @throws ApiError - If user creation fails
     */
    static async createUser(userData) {
        try {
            // Check if user already exists with Clerk ID
            const existingUser = await User_model_1.User.findOne({
                clerkUserId: userData.clerkUserId
            }).exec();
            if (existingUser) {
                throw new errorHandler_1.ApiError('User already exists with this Clerk ID', 409);
            }
            // Check if email is already taken
            const existingEmail = await User_model_1.User.findOne({
                email: userData.email.toLowerCase()
            }).exec();
            if (existingEmail) {
                throw new errorHandler_1.ApiError('Email address is already registered', 409);
            }
            // Create user with default status
            const user = new User_model_1.User({
                ...userData,
                email: userData.email.toLowerCase(),
                status: user_types_1.UserStatus.PENDING_VERIFICATION
            });
            // Validate and save user
            const savedUser = await user.save();
            return savedUser;
        }
        catch (error) {
            if (error instanceof errorHandler_1.ApiError) {
                throw error;
            }
            // Handle Mongoose validation errors
            if (this.isValidationError(error)) {
                const messages = Object.values(error.errors).map((err) => err.message);
                throw new errorHandler_1.ApiError(`Validation failed: ${messages.join(', ')}`, 400);
            }
            throw new errorHandler_1.ApiError('Failed to create user', 500);
        }
    }
    /**
     * Get user by Clerk ID
     *
     * @param clerkUserId - Clerk user ID
     * @returns Promise<UserDocument | null> - User document or null if not found
     * @throws ApiError - If retrieval fails
     */
    static async getUserByClerkId(clerkUserId) {
        try {
            const user = await User_model_1.User.findOne({ clerkUserId }).exec();
            return user;
        }
        catch (error) {
            throw new errorHandler_1.ApiError('Failed to retrieve user', 500);
        }
    }
    /**
     * Get user by email
     *
     * @param email - User email address
     * @returns Promise<UserDocument | null> - User document or null if not found
     * @throws ApiError - If retrieval fails
     */
    static async getUserByEmail(email) {
        try {
            const user = await User_model_1.User.findOne({ email: email.toLowerCase() }).exec();
            return user;
        }
        catch (error) {
            throw new errorHandler_1.ApiError('Failed to retrieve user', 500);
        }
    }
    /**
     * Get user by MongoDB ObjectId
     *
     * @param userId - MongoDB ObjectId
     * @returns Promise<UserDocument | null> - User document or null
     */
    static async getUserById(userId) {
        try {
            const user = await User_model_1.User.findById(userId).exec();
            return user;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            throw new errorHandler_1.ApiError('Failed to fetch user', 500);
        }
    }
    /**
     * Update user profile information
     *
     * @param clerkUserId - Clerk authentication ID
     * @param updateData - Data to update
     * @returns Promise<UserDocument> - Updated user document
     * @throws ApiError - If update fails or user not found
     */
    static async updateUser(clerkUserId, updateData) {
        try {
            const user = await User_model_1.User.findOne({ clerkUserId }).exec();
            if (!user) {
                throw new errorHandler_1.ApiError('User not found', 404);
            }
            // Update user data
            Object.assign(user, updateData);
            const updatedUser = await user.save();
            return updatedUser;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            if (error instanceof errorHandler_1.ApiError) {
                throw error;
            }
            if (this.isValidationError(error)) {
                const messages = Object.values(error.errors).map((err) => err.message);
                throw new errorHandler_1.ApiError(`Validation failed: ${messages.join(', ')}`, 400);
            }
            throw new errorHandler_1.ApiError('Failed to update user', 500);
        }
    }
    /**
     * Update user status (for admin operations)
     *
     * @param clerkUserId - Clerk authentication ID
     * @param status - New status
     * @returns Promise<UserDocument> - Updated user document
     */
    static async updateUserStatus(clerkUserId, status) {
        try {
            const user = await User_model_1.User.findOne({ clerkUserId }).exec();
            if (!user) {
                throw new errorHandler_1.ApiError('User not found', 404);
            }
            user.status = status;
            const updatedUser = await user.save();
            return updatedUser;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            if (error instanceof errorHandler_1.ApiError) {
                throw error;
            }
            throw new errorHandler_1.ApiError('Failed to update user status', 500);
        }
    }
    /**
     * Get all users with pagination and filtering
     *
     * @param options - Query options
     * @returns Promise<{ users: UserDocument[], pagination: PaginationInfo }> - Users and pagination info
     */
    static async getUsers(options = {}) {
        try {
            const { page = 1, limit = 10, role, status, search } = options;
            // Build query filter
            const filter = {};
            if (role)
                filter['role'] = role;
            if (status)
                filter['status'] = status;
            if (search) {
                filter['$or'] = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }
            // Calculate pagination
            const skip = (page - 1) * limit;
            // Execute queries
            const [users, total] = await Promise.all([
                User_model_1.User.find(filter)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .select('-__v') // Exclude version key
                    .exec(),
                User_model_1.User.countDocuments(filter).exec()
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                users: users,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            throw new errorHandler_1.ApiError('Failed to fetch users', 500);
        }
    }
    /**
     * Delete user account
     *
     * @param clerkUserId - Clerk authentication ID
     * @returns Promise<boolean> - Success status
     */
    static async deleteUser(clerkUserId) {
        try {
            const user = await User_model_1.User.findOne({ clerkUserId }).exec();
            if (!user) {
                throw new errorHandler_1.ApiError('User not found', 404);
            }
            // Soft delete - change status to inactive instead of removing
            user.status = user_types_1.UserStatus.INACTIVE;
            await user.save();
            return true;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            if (error instanceof errorHandler_1.ApiError) {
                throw error;
            }
            throw new errorHandler_1.ApiError('Failed to delete user', 500);
        }
    }
    /**
     * Update user's last login timestamp
     *
     * @param clerkUserId - Clerk authentication ID
     * @returns Promise<void>
     */
    static async updateLastLogin(clerkUserId) {
        try {
            const user = await User_model_1.User.findOne({ clerkUserId }).exec();
            if (user && typeof user.updateLastLogin === 'function') {
                await user.updateLastLogin();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            // Don't throw error for login tracking - it's not critical
            console.error('Failed to update last login:', error);
        }
    }
    /**
     * Get user statistics for dashboard
     *
     * @returns Promise<Record<string, number>> - User statistics
     */
    static async getUserStatistics() {
        try {
            const [totalUsers, activeUsers, patients, doctors, pendingVerification] = await Promise.all([
                User_model_1.User.countDocuments().exec(),
                User_model_1.User.countDocuments({ status: user_types_1.UserStatus.ACTIVE }).exec(),
                User_model_1.User.countDocuments({ role: user_types_1.UserRole.PATIENT }).exec(),
                User_model_1.User.countDocuments({ role: user_types_1.UserRole.DOCTOR }).exec(),
                User_model_1.User.countDocuments({ status: user_types_1.UserStatus.PENDING_VERIFICATION }).exec()
            ]);
            return {
                totalUsers,
                activeUsers,
                patients,
                doctors,
                pendingVerification,
                inactiveUsers: totalUsers - activeUsers
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            throw new errorHandler_1.ApiError('Failed to fetch user statistics', 500);
        }
    }
    /**
     * Type guard to check if error is a Mongoose validation error
     *
     * @param error - The error to check
     * @returns boolean - Whether the error is a validation error
     */
    static isValidationError(error) {
        return (typeof error === 'object' &&
            error !== null &&
            typeof error.name === 'string' &&
            error.name === 'ValidationError' &&
            'errors' in error);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map
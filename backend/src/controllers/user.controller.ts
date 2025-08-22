import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserInput, UpdateUserInput, UserRole, UserStatus } from '../types/user.types';
import { ApiError } from '../middleware/errorHandler';

/**
 * User Controller - Handles HTTP requests for user operations
 * 
 * This controller layer handles:
 * - Request validation
 * - Response formatting
 * - Error handling
 * - HTTP status codes
 */
export class UserController {
  
  /**
   * Create a new user
   * POST /api/v1/users
   */
  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: CreateUserInput = req.body;
      
      // Basic validation
      if (!userData.clerkUserId || !userData.email || !userData.name || !userData.role) {
        throw new ApiError('Missing required fields: clerkUserId, email, name, role', 400);
      }
      
      // Validate role
      if (!Object.values(UserRole).includes(userData.role)) {
        throw new ApiError('Invalid user role', 400);
      }
      
      // Create user through service
      const user = await UserService.createUser(userData);
      
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
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get user by Clerk ID
   * GET /api/v1/users/clerk/:clerkUserId
   */
  static async getUserByClerkId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { clerkUserId } = req.params;
      
      if (!clerkUserId) {
        throw new ApiError('Clerk user ID is required', 400);
      }
      
      const user = await UserService.getUserByClerkId(clerkUserId);
      
      if (!user) {
        throw new ApiError('User not found', 404);
      }
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get user by MongoDB ID
   * GET /api/v1/users/:userId
   */
  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        throw new ApiError('User ID is required', 400);
      }
      
      const user = await UserService.getUserById(userId);
      
      if (!user) {
        throw new ApiError('User not found', 404);
      }
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update user profile
   * PUT /api/v1/users/clerk/:clerkUserId
   */
  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { clerkUserId } = req.params;
      const updateData: UpdateUserInput = req.body;
      
      if (!clerkUserId) {
        throw new ApiError('Clerk user ID is required', 400);
      }
      
      if (Object.keys(updateData).length === 0) {
        throw new ApiError('No update data provided', 400);
      }
      
      // Validate date format if provided
      if (updateData.dateOfBirth) {
        const date = new Date(updateData.dateOfBirth);
        if (isNaN(date.getTime())) {
          throw new ApiError('Invalid date format', 400);
        }
      }
      
      const updatedUser = await UserService.updateUser(clerkUserId, updateData);
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update user status (Admin only)
   * PATCH /api/v1/users/clerk/:clerkUserId/status
   */
  static async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { clerkUserId } = req.params;
      const { status } = req.body;
      
      if (!clerkUserId) {
        throw new ApiError('Clerk user ID is required', 400);
      }
      
      if (!status || !Object.values(UserStatus).includes(status)) {
        throw new ApiError('Valid status is required', 400);
      }
      
      const updatedUser = await UserService.updateUserStatus(clerkUserId, status);
      
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
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get all users with pagination and filtering
   * GET /api/v1/users
   */
  static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        role,
        status,
        search
      } = req.query;
      
      // Validate query parameters
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      
      if (isNaN(pageNum) || pageNum < 1) {
        throw new ApiError('Page must be a positive number', 400);
      }
      
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new ApiError('Limit must be between 1 and 100', 400);
      }
      
      // Validate role if provided
      if (role && !Object.values(UserRole).includes(role as UserRole)) {
        throw new ApiError('Invalid user role', 400);
      }
      
      // Validate status if provided
      if (status && !Object.values(UserStatus).includes(status as UserStatus)) {
        throw new ApiError('Invalid user status', 400);
      }
      
      const result = await UserService.getUsers({
        page: pageNum,
        limit: limitNum,
        role: role as UserRole,
        status: status as UserStatus,
        search: search as string
      });
      
      res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete user (soft delete)
   * DELETE /api/v1/users/clerk/:clerkUserId
   */
  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { clerkUserId } = req.params;
      
      if (!clerkUserId) {
        throw new ApiError('Clerk user ID is required', 400);
      }
      
      await UserService.deleteUser(clerkUserId);
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
  
 
  
 
 
}

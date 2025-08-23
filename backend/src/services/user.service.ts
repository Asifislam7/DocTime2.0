import { User } from '../models/User.model';
import { CreateUserInput, UpdateUserInput, UserRole, UserStatus } from '../types/user.types';
import { ApiError } from '../middleware/errorHandler';
import { Document } from 'mongoose';

// Define proper user document type
type UserDocument = Document & {
  clerkUserId: string;
  email: string;
  name?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  updateLastLogin?: () => Promise<void>;
  save(): Promise<UserDocument>;
}

// Pagination interface
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Get users options interface
interface GetUsersOptions {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}

/**
 * User Service - Handles all user-related business logic
 * 
 * This service layer separates business logic from controllers,
 * making the code more maintainable and testable.
 */
export class UserService {
  
  /**
   * Create a new user in the system
   * 
   * @param userData - User creation data
   * @returns Promise<UserDocument> - Created user document
   * @throws ApiError - If user creation fails
   */
  static async createUser(userData: CreateUserInput): Promise<UserDocument> {
    try {
      // Check if user already exists with Clerk ID
      const existingUser = await User.findOne({ 
        clerkUserId: userData.clerkUserId 
      }).exec();
      
      if (existingUser) {
        throw new ApiError('User already exists with this Clerk ID', 409);
      }
      
      // Check if email is already taken
      const existingEmail = await User.findOne({ 
        email: userData.email.toLowerCase() 
      }).exec();
      
      if (existingEmail) {
        throw new ApiError('Email address is already registered', 409);
      }
      
      // Create user with default status
      const user = new User({
        ...userData,
        email: userData.email.toLowerCase(),
        status: UserStatus.PENDING_VERIFICATION
      });
      
      // Validate and save user
      const savedUser = await user.save();
      
      return savedUser as UserDocument;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle Mongoose validation errors
      if (this.isValidationError(error)) {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        throw new ApiError(`Validation failed: ${messages.join(', ')}`, 400);
      }
      
      throw new ApiError('Failed to create user', 500);
    }
  }
  
  /**
   * Get user by Clerk ID
   * 
   * @param clerkUserId - Clerk user ID
   * @returns Promise<UserDocument | null> - User document or null if not found
   * @throws ApiError - If retrieval fails
   */
  static async getUserByClerkId(clerkUserId: string): Promise<UserDocument | null> {
    try {
      const user = await User.findOne({ clerkUserId }).exec();
      return user as UserDocument | null;
    } catch (error) {
      throw new ApiError('Failed to retrieve user', 500);
    }
  }

  /**
   * Get user by email
   * 
   * @param email - User email address
   * @returns Promise<UserDocument | null> - User document or null if not found
   * @throws ApiError - If retrieval fails
   */
  static async getUserByEmail(email: string): Promise<UserDocument | null> {
    try {
      const user = await User.findOne({ email: email.toLowerCase() }).exec();
      return user as UserDocument | null;
    } catch (error) {
      throw new ApiError('Failed to retrieve user', 500);
    }
  }
  
  /**
   * Get user by MongoDB ObjectId
   * 
   * @param userId - MongoDB ObjectId
   * @returns Promise<UserDocument | null> - User document or null
   */
  static async getUserById(userId: string): Promise<UserDocument | null> {
    try {
      const user = await User.findById(userId).exec();
      return user as UserDocument | null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new ApiError('Failed to fetch user', 500);
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
  static async updateUser(clerkUserId: string, updateData: UpdateUserInput): Promise<UserDocument> {
    try {
      const user = await User.findOne({ clerkUserId }).exec();
      
      if (!user) {
        throw new ApiError('User not found', 404);
      }
      
      // Update user data
      Object.assign(user, updateData);
      const updatedUser = await user.save();
      
      return updatedUser as UserDocument;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (this.isValidationError(error)) {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        throw new ApiError(`Validation failed: ${messages.join(', ')}`, 400);
      }
      
      throw new ApiError('Failed to update user', 500);
    }
  }
  
  /**
   * Update user status (for admin operations)
   * 
   * @param clerkUserId - Clerk authentication ID
   * @param status - New status
   * @returns Promise<UserDocument> - Updated user document
   */
  static async updateUserStatus(clerkUserId: string, status: UserStatus): Promise<UserDocument> {
    try {
      const user = await User.findOne({ clerkUserId }).exec();
      
      if (!user) {
        throw new ApiError('User not found', 404);
      }
      
      user.status = status;
      const updatedUser = await user.save();
      
      return updatedUser as UserDocument;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('Failed to update user status', 500);
    }
  }
  
  /**
   * Get all users with pagination and filtering
   * 
   * @param options - Query options
   * @returns Promise<{ users: UserDocument[], pagination: PaginationInfo }> - Users and pagination info
   */
  static async getUsers(options: GetUsersOptions = {}): Promise<{ 
    users: UserDocument[]; 
    pagination: PaginationInfo; 
  }> {
    try {
      const {
        page = 1,
        limit = 10,
        role,
        status,
        search
      } = options;
      
      // Build query filter
      const filter: Record<string, any> = {};
      
      if (role) filter['role'] = role;
      if (status) filter['status'] = status;
      
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
        User.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select('-__v') // Exclude version key
          .exec(),
        
        User.countDocuments(filter).exec()
      ]);
      
      const totalPages = Math.ceil(total / limit);
      
      return {
        users: users as UserDocument[],
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
    } catch (error) {
      throw new ApiError('Failed to fetch users', 500);
    }
  }
  
  /**
   * Delete user account
   * 
   * @param clerkUserId - Clerk authentication ID
   * @returns Promise<boolean> - Success status
   */
  static async deleteUser(clerkUserId: string): Promise<boolean> {
    try {
      const user = await User.findOne({ clerkUserId }).exec();
      
      if (!user) {
        throw new ApiError('User not found', 404);
      }
      
      // Soft delete - change status to inactive instead of removing
      user.status = UserStatus.INACTIVE;
      await user.save();
      
      return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('Failed to delete user', 500);
    }
  }
  
  /**
   * Update user's last login timestamp
   * 
   * @param clerkUserId - Clerk authentication ID
   * @returns Promise<void>
   */
  static async updateLastLogin(clerkUserId: string): Promise<void> {
    try {
      const user = await User.findOne({ clerkUserId }).exec();
      
      if (user && typeof (user as any).updateLastLogin === 'function') {
        await (user as any).updateLastLogin();
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Don't throw error for login tracking - it's not critical
      console.error('Failed to update last login:', error);
    }
  }
  
  /**
   * Get user statistics for dashboard
   * 
   * @returns Promise<Record<string, number>> - User statistics
   */
  static async getUserStatistics(): Promise<Record<string, number>> {
    try {
      const [
        totalUsers,
        activeUsers,
        patients,
        doctors,
        pendingVerification
      ] = await Promise.all([
        User.countDocuments().exec(),
        User.countDocuments({ status: UserStatus.ACTIVE }).exec(),
        User.countDocuments({ role: UserRole.PATIENT }).exec(),
        User.countDocuments({ role: UserRole.DOCTOR }).exec(),
        User.countDocuments({ status: UserStatus.PENDING_VERIFICATION }).exec()
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
      } catch (error) {
      throw new ApiError('Failed to fetch user statistics', 500);
    }
  }

  /**
   * Type guard to check if error is a Mongoose validation error
   * 
   * @param error - The error to check
   * @returns boolean - Whether the error is a validation error
   */
  private static isValidationError(error: unknown): error is { name: string; errors: Record<string, unknown> } {
    return (
      typeof error === 'object' &&
      error !== null &&
      typeof (error as { name?: unknown }).name === 'string' &&
      (error as { name?: string }).name === 'ValidationError' &&
      'errors' in error
    );
  }
}
import { CreateUserInput, UpdateUserInput, UserRole, UserStatus } from '../types/user.types';
import { Document } from 'mongoose';
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
};
interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
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
export declare class UserService {
    /**
     * Create a new user in the system
     *
     * @param userData - User creation data
     * @returns Promise<UserDocument> - Created user document
     * @throws ApiError - If user creation fails
     */
    static createUser(userData: CreateUserInput): Promise<UserDocument>;
    /**
     * Get user by Clerk ID
     *
     * @param clerkUserId - Clerk user ID
     * @returns Promise<UserDocument | null> - User document or null if not found
     * @throws ApiError - If retrieval fails
     */
    static getUserByClerkId(clerkUserId: string): Promise<UserDocument | null>;
    /**
     * Get user by email
     *
     * @param email - User email address
     * @returns Promise<UserDocument | null> - User document or null if not found
     * @throws ApiError - If retrieval fails
     */
    static getUserByEmail(email: string): Promise<UserDocument | null>;
    /**
     * Get user by MongoDB ObjectId
     *
     * @param userId - MongoDB ObjectId
     * @returns Promise<UserDocument | null> - User document or null
     */
    static getUserById(userId: string): Promise<UserDocument | null>;
    /**
     * Update user profile information
     *
     * @param clerkUserId - Clerk authentication ID
     * @param updateData - Data to update
     * @returns Promise<UserDocument> - Updated user document
     * @throws ApiError - If update fails or user not found
     */
    static updateUser(clerkUserId: string, updateData: UpdateUserInput): Promise<UserDocument>;
    /**
     * Update user status (for admin operations)
     *
     * @param clerkUserId - Clerk authentication ID
     * @param status - New status
     * @returns Promise<UserDocument> - Updated user document
     */
    static updateUserStatus(clerkUserId: string, status: UserStatus): Promise<UserDocument>;
    /**
     * Get all users with pagination and filtering
     *
     * @param options - Query options
     * @returns Promise<{ users: UserDocument[], pagination: PaginationInfo }> - Users and pagination info
     */
    static getUsers(options?: GetUsersOptions): Promise<{
        users: UserDocument[];
        pagination: PaginationInfo;
    }>;
    /**
     * Delete user account
     *
     * @param clerkUserId - Clerk authentication ID
     * @returns Promise<boolean> - Success status
     */
    static deleteUser(clerkUserId: string): Promise<boolean>;
    /**
     * Update user's last login timestamp
     *
     * @param clerkUserId - Clerk authentication ID
     * @returns Promise<void>
     */
    static updateLastLogin(clerkUserId: string): Promise<void>;
    /**
     * Get user statistics for dashboard
     *
     * @returns Promise<Record<string, number>> - User statistics
     */
    static getUserStatistics(): Promise<Record<string, number>>;
    /**
     * Type guard to check if error is a Mongoose validation error
     *
     * @param error - The error to check
     * @returns boolean - Whether the error is a validation error
     */
    private static isValidationError;
}
export {};
//# sourceMappingURL=user.service.d.ts.map
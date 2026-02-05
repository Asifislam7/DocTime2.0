import { Request, Response, NextFunction } from 'express';
/**
 * User Controller - Handles HTTP requests for user operations
 *
 * This controller layer handles:
 * - Request validation
 * - Response formatting
 * - Error handling
 * - HTTP status codes
 */
export declare class UserController {
    /**
     * Create a new user
     * POST /api/v1/users
     */
    static createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get user by Clerk ID
     * GET /api/v1/users/clerk/:clerkUserId
     */
    static getUserByClerkId(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get user by MongoDB ID
     * GET /api/v1/users/:userId
     */
    static getUserById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get user by email
     * GET /api/v1/users/email/:email
     */
    static getUserByEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update user profile
     * PUT /api/v1/users/clerk/:clerkUserId
     */
    static updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update user status (Admin only)
     * PATCH /api/v1/users/clerk/:clerkUserId/status
     */
    static updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get all users with pagination and filtering
     * GET /api/v1/users
     */
    static getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete user (soft delete)
     * DELETE /api/v1/users/clerk/:clerkUserId
     */
    static deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map
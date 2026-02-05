/**
 * Backend API base URL. Set NEXT_PUBLIC_API_URL in production.
 * Defaults to local backend for local development.
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

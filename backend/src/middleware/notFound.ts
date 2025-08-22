import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      path: req.originalUrl,
      method: req.method
    },
    timestamp: new Date().toISOString(),
    suggestion: 'Check the API documentation for available endpoints'
  });
};

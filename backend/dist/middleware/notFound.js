"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = (req, res, next) => {
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
exports.notFound = notFound;
//# sourceMappingURL=notFound.js.map
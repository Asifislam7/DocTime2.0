"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionController = exports.upload = void 0;
const prescription_service_1 = require("../services/prescription.service");
const chatbot_service_1 = require("../services/chatbot.service");
const prescription_types_1 = require("../types/prescription.types");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../uploads/prescriptions');
        // Create directory if it doesn't exist
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${(0, uuid_1.v4)()}-${Date.now()}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const fileFilter = (req, file, cb) => {
    // Allow common document and image formats
    const allowedMimes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/tiff',
        'image/bmp',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only PDF, images, and documents are allowed.'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});
class PrescriptionController {
    // Upload prescription document
    static async uploadPrescription(req, res) {
        try {
            const { clerkUserId } = req.body;
            const { title, description, documentType, tags, isPublic } = req.body;
            const file = req.file;
            if (!file) {
                res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
                return;
            }
            if (!clerkUserId) {
                res.status(400).json({
                    success: false,
                    message: 'Clerk user ID is required'
                });
                return;
            }
            if (!title || !documentType) {
                res.status(400).json({
                    success: false,
                    message: 'Title and document type are required'
                });
                return;
            }
            // Validate document type
            if (!Object.values(prescription_types_1.DocumentType).includes(documentType)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid document type'
                });
                return;
            }
            // Parse tags if provided
            let parsedTags = [];
            if (tags) {
                try {
                    parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
                }
                catch {
                    parsedTags = [];
                }
            }
            const fileInfo = {
                fileName: file.filename,
                originalFileName: file.originalname,
                filePath: file.path,
                fileSize: file.size,
                mimeType: file.mimetype
            };
            const prescription = await prescription_service_1.PrescriptionService.createPrescription(clerkUserId, {
                title,
                description,
                documentType,
                tags: parsedTags,
                isPublic: isPublic === 'true'
            }, fileInfo);
            res.status(201).json({
                success: true,
                message: 'Prescription uploaded successfully',
                data: prescription
            });
        }
        catch (error) {
            console.error('Error uploading prescription:', error);
            res.status(500).json({
                success: false,
                message: 'Error uploading prescription',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Get user's prescriptions
    static async getPrescriptions(req, res) {
        try {
            const { clerkUserId } = req.params;
            const { documentType, status, search, page = '1', limit = '10', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
            const query = {
                documentType: documentType,
                status: status,
                search: search,
                page: parseInt(page),
                limit: parseInt(limit),
                sortBy: sortBy,
                sortOrder: sortOrder
            };
            const result = await prescription_service_1.PrescriptionService.getPrescriptionsByUser(clerkUserId, query);
            res.status(200).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            console.error('Error getting prescriptions:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting prescriptions',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Get single prescription
    static async getPrescription(req, res) {
        try {
            const { prescriptionId, clerkUserId } = req.params;
            const prescription = await prescription_service_1.PrescriptionService.getPrescriptionById(prescriptionId, clerkUserId);
            if (!prescription) {
                res.status(404).json({
                    success: false,
                    message: 'Prescription not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: prescription
            });
        }
        catch (error) {
            console.error('Error getting prescription:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting prescription',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Update prescription
    static async updatePrescription(req, res) {
        try {
            const { prescriptionId, clerkUserId } = req.params;
            const updateData = req.body;
            const prescription = await prescription_service_1.PrescriptionService.updatePrescription(prescriptionId, clerkUserId, updateData);
            if (!prescription) {
                res.status(404).json({
                    success: false,
                    message: 'Prescription not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Prescription updated successfully',
                data: prescription
            });
        }
        catch (error) {
            console.error('Error updating prescription:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating prescription',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Delete prescription
    static async deletePrescription(req, res) {
        try {
            const { prescriptionId, clerkUserId } = req.params;
            const deleted = await prescription_service_1.PrescriptionService.deletePrescription(prescriptionId, clerkUserId);
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: 'Prescription not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Prescription deleted successfully'
            });
        }
        catch (error) {
            console.error('Error deleting prescription:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting prescription',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Download prescription file
    static async downloadPrescription(req, res) {
        try {
            const { prescriptionId, clerkUserId } = req.params;
            const fileInfo = await prescription_service_1.PrescriptionService.getFilePathForDownload(prescriptionId, clerkUserId);
            if (!fileInfo) {
                res.status(404).json({
                    success: false,
                    message: 'Prescription not found'
                });
                return;
            }
            // Set appropriate headers
            res.setHeader('Content-Disposition', `attachment; filename="${fileInfo.fileName}"`);
            res.setHeader('Content-Type', fileInfo.mimeType);
            // Stream the file
            const fileStream = fs_1.default.createReadStream(fileInfo.filePath);
            fileStream.pipe(res);
            fileStream.on('error', (error) => {
                console.error('Error streaming file:', error);
                if (!res.headersSent) {
                    res.status(500).json({
                        success: false,
                        message: 'Error downloading file'
                    });
                }
            });
        }
        catch (error) {
            console.error('Error downloading prescription:', error);
            res.status(500).json({
                success: false,
                message: 'Error downloading prescription',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Get prescription statistics
    static async getPrescriptionStats(req, res) {
        try {
            const { clerkUserId } = req.params;
            const stats = await prescription_service_1.PrescriptionService.getPrescriptionStats(clerkUserId);
            res.status(200).json({
                success: true,
                data: stats
            });
        }
        catch (err) {
            console.error('Error getting prescription stats:', err);
            res.status(500).json({
                success: false,
                message: 'Error getting prescription statistics',
                error: err instanceof Error ? err.message : 'Unknown error'
            });
        }
    }
    // Get AI summary for prescription
    static async getPrescriptionSummary(req, res) {
        try {
            const { prescriptionId, clerkUserId } = req.params;
            const textContent = await prescription_service_1.PrescriptionService.getPrescriptionTextContent(prescriptionId, clerkUserId);
            if (!textContent || textContent.length < 10) {
                res.status(400).json({
                    success: false,
                    message: 'Not enough content to summarize. Document may not be processed yet or has no extractable text.'
                });
                return;
            }
            const summary = await chatbot_service_1.ChatbotService.summarizeDocument(textContent);
            res.status(200).json({
                success: true,
                data: { summary }
            });
        }
        catch (error) {
            console.error('Error generating prescription summary:', error);
            res.status(500).json({
                success: false,
                message: 'Error generating summary',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Update prescription status (for OCR processing)
    static async updatePrescriptionStatus(req, res) {
        try {
            const { prescriptionId } = req.params;
            const { status, extractedText, metadata } = req.body;
            if (!Object.values(prescription_types_1.DocumentStatus).includes(status)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid status'
                });
                return;
            }
            const prescription = await prescription_service_1.PrescriptionService.updatePrescriptionStatus(prescriptionId, status, extractedText, metadata);
            if (!prescription) {
                res.status(404).json({
                    success: false,
                    message: 'Prescription not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Prescription status updated successfully',
                data: prescription
            });
        }
        catch (error) {
            console.error('Error updating prescription status:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating prescription status',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.PrescriptionController = PrescriptionController;
//# sourceMappingURL=prescription.controller.js.map
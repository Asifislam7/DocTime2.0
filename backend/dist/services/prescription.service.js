"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionService = void 0;
const Prescription_model_1 = require("../models/Prescription.model");
const User_model_1 = require("../models/User.model");
const prescription_types_1 = require("../types/prescription.types");
const mongoose_1 = require("mongoose");
const fs_1 = __importDefault(require("fs"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');
class PrescriptionService {
    // Create a new prescription
    static async createPrescription(clerkUserId, prescriptionData, fileInfo) {
        try {
            // Find user by clerkUserId
            const user = await User_model_1.User.findOne({ clerkUserId });
            if (!user) {
                throw new mongoose_1.Error('User not found');
            }
            // Validate file exists
            if (!fs_1.default.existsSync(fileInfo.filePath)) {
                throw new mongoose_1.Error('File not found');
            }
            // Create prescription
            const prescription = new Prescription_model_1.Prescription({
                userId: user._id,
                clerkUserId,
                title: prescriptionData.title,
                description: prescriptionData.description,
                documentType: prescriptionData.documentType,
                fileName: fileInfo.fileName,
                originalFileName: fileInfo.originalFileName,
                filePath: fileInfo.filePath,
                fileSize: fileInfo.fileSize,
                mimeType: fileInfo.mimeType,
                tags: prescriptionData.tags || [],
                isPublic: prescriptionData.isPublic || false,
                status: prescription_types_1.DocumentStatus.PENDING
            });
            const savedPrescription = await prescription.save();
            return savedPrescription;
        }
        catch (error) {
            console.error('Error creating prescription:', error);
            throw error;
        }
    }
    // Get prescriptions by user
    static async getPrescriptionsByUser(clerkUserId, query = {}) {
        try {
            const user = await User_model_1.User.findOne({ clerkUserId });
            if (!user) {
                throw new mongoose_1.Error('User not found');
            }
            const { documentType, status, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;
            // Build filter
            const filter = { clerkUserId };
            if (documentType) {
                filter.documentType = documentType;
            }
            if (status) {
                filter.status = status;
            }
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { extractedText: { $regex: search, $options: 'i' } },
                    { tags: { $in: [new RegExp(search, 'i')] } }
                ];
            }
            // Calculate pagination
            const skip = (page - 1) * limit;
            // Build sort
            const sort = {};
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
            // Execute queries
            const [prescriptions, total] = await Promise.all([
                Prescription_model_1.Prescription.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Prescription_model_1.Prescription.countDocuments(filter)
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                prescriptions,
                total,
                page,
                totalPages
            };
        }
        catch (error) {
            console.error('Error getting prescriptions:', error);
            throw error;
        }
    }
    // Get single prescription by ID
    static async getPrescriptionById(prescriptionId, clerkUserId) {
        try {
            const prescription = await Prescription_model_1.Prescription.findOne({
                _id: prescriptionId,
                clerkUserId
            }).lean();
            return prescription;
        }
        catch (error) {
            console.error('Error getting prescription:', error);
            throw error;
        }
    }
    // Update prescription
    static async updatePrescription(prescriptionId, clerkUserId, updateData) {
        try {
            const prescription = await Prescription_model_1.Prescription.findOneAndUpdate({ _id: prescriptionId, clerkUserId }, { $set: updateData }, { new: true, runValidators: true }).lean();
            return prescription;
        }
        catch (error) {
            console.error('Error updating prescription:', error);
            throw error;
        }
    }
    // Delete prescription
    static async deletePrescription(prescriptionId, clerkUserId) {
        try {
            const prescription = await Prescription_model_1.Prescription.findOne({
                _id: prescriptionId,
                clerkUserId
            });
            if (!prescription) {
                return false;
            }
            // Delete file from filesystem
            if (fs_1.default.existsSync(prescription.filePath)) {
                fs_1.default.unlinkSync(prescription.filePath);
            }
            // Delete from database
            await Prescription_model_1.Prescription.deleteOne({ _id: prescriptionId, clerkUserId });
            return true;
        }
        catch (error) {
            console.error('Error deleting prescription:', error);
            throw error;
        }
    }
    // Update prescription status
    static async updatePrescriptionStatus(prescriptionId, status, extractedText, metadata) {
        try {
            const updateData = { status };
            if (extractedText) {
                updateData.extractedText = extractedText;
            }
            if (metadata) {
                updateData.metadata = metadata;
            }
            const prescription = await Prescription_model_1.Prescription.findByIdAndUpdate(prescriptionId, { $set: updateData }, { new: true, runValidators: true }).lean();
            return prescription;
        }
        catch (error) {
            console.error('Error updating prescription status:', error);
            throw error;
        }
    }
    // Get text content for summarization (extractedText, or extract from PDF, or title+description)
    static async getPrescriptionTextContent(prescriptionId, clerkUserId) {
        try {
            const prescription = await Prescription_model_1.Prescription.findOne({
                _id: prescriptionId,
                clerkUserId
            }).lean();
            if (!prescription) {
                return null;
            }
            if (prescription.extractedText && prescription.extractedText.trim().length > 0) {
                return prescription.extractedText.trim();
            }
            if (!fs_1.default.existsSync(prescription.filePath)) {
                const fallback = [prescription.title, prescription.description].filter(Boolean).join('\n');
                return fallback.length > 0 ? fallback : null;
            }
            const mimeType = (prescription.mimeType || '').toLowerCase();
            if (mimeType.includes('pdf')) {
                const dataBuffer = fs_1.default.readFileSync(prescription.filePath);
                const data = await pdfParse(dataBuffer);
                const text = (data?.text || '').trim();
                if (text.length > 0)
                    return text;
            }
            const fallback = [prescription.title, prescription.description].filter(Boolean).join('\n');
            return fallback.length > 0 ? fallback : null;
        }
        catch (error) {
            console.error('Error getting prescription text content:', error);
            throw error;
        }
    }
    // Get file path for download
    static async getFilePathForDownload(prescriptionId, clerkUserId) {
        try {
            const prescription = await Prescription_model_1.Prescription.findOne({
                _id: prescriptionId,
                clerkUserId
            }).lean();
            if (!prescription) {
                return null;
            }
            // Check if file exists
            if (!fs_1.default.existsSync(prescription.filePath)) {
                throw new mongoose_1.Error('File not found on server');
            }
            return {
                filePath: prescription.filePath,
                fileName: prescription.originalFileName,
                mimeType: prescription.mimeType
            };
        }
        catch (error) {
            console.error('Error getting file path:', error);
            throw error;
        }
    }
    // Get prescription statistics
    static async getPrescriptionStats(clerkUserId) {
        try {
            const user = await User_model_1.User.findOne({ clerkUserId });
            if (!user) {
                throw new mongoose_1.Error('User not found');
            }
            const [total, byType, byStatus, totalSizeResult] = await Promise.all([
                Prescription_model_1.Prescription.countDocuments({ clerkUserId }),
                Prescription_model_1.Prescription.aggregate([
                    { $match: { clerkUserId } },
                    { $group: { _id: '$documentType', count: { $sum: 1 } } }
                ]),
                Prescription_model_1.Prescription.aggregate([
                    { $match: { clerkUserId } },
                    { $group: { _id: '$status', count: { $sum: 1 } } }
                ]),
                Prescription_model_1.Prescription.aggregate([
                    { $match: { clerkUserId } },
                    { $group: { _id: null, totalSize: { $sum: '$fileSize' } } }
                ])
            ]);
            // Format results
            const byTypeFormatted = {};
            byType.forEach(item => {
                byTypeFormatted[item._id] = item.count;
            });
            const byStatusFormatted = {};
            byStatus.forEach(item => {
                byStatusFormatted[item._id] = item.count;
            });
            return {
                total,
                byType: byTypeFormatted,
                byStatus: byStatusFormatted,
                totalSize: totalSizeResult[0]?.totalSize || 0
            };
        }
        catch (error) {
            console.error('Error getting prescription stats:', error);
            throw error;
        }
    }
}
exports.PrescriptionService = PrescriptionService;
//# sourceMappingURL=prescription.service.js.map
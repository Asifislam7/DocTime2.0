import { Prescription } from '../models/Prescription.model';
import { User } from '../models/User.model';
import { 
  IPrescription, 
  CreatePrescriptionRequest, 
  UpdatePrescriptionRequest, 
  PrescriptionQuery,
  DocumentType,
  DocumentStatus 
} from '../types/prescription.types';
import { Error } from 'mongoose';
import path from 'path';
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');

export class PrescriptionService {
  // Create a new prescription
  static async createPrescription(
    clerkUserId: string,
    prescriptionData: CreatePrescriptionRequest,
    fileInfo: {
      fileName: string;
      originalFileName: string;
      filePath: string;
      fileSize: number;
      mimeType: string;
    }
  ): Promise<IPrescription> {
    try {
      // Find user by clerkUserId
      const user = await User.findOne({ clerkUserId });
      if (!user) {
        throw new Error('User not found');
      }

      // Validate file exists
      if (!fs.existsSync(fileInfo.filePath)) {
        throw new Error('File not found');
      }

      // Create prescription
      const prescription = new Prescription({
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
        status: DocumentStatus.PENDING
      });

      const savedPrescription = await prescription.save();
      return savedPrescription;
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  }

  // Get prescriptions by user
  static async getPrescriptionsByUser(
    clerkUserId: string,
    query: PrescriptionQuery = {}
  ): Promise<{ prescriptions: IPrescription[]; total: number; page: number; totalPages: number }> {
    try {
      const user = await User.findOne({ clerkUserId });
      if (!user) {
        throw new Error('User not found');
      }

      const {
        documentType,
        status,
        search,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = query;

      // Build filter
      const filter: any = { clerkUserId };
      
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
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute queries
      const [prescriptions, total] = await Promise.all([
        Prescription.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        Prescription.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        prescriptions,
        total,
        page,
        totalPages
      };
    } catch (error) {
      console.error('Error getting prescriptions:', error);
      throw error;
    }
  }

  // Get single prescription by ID
  static async getPrescriptionById(
    prescriptionId: string,
    clerkUserId: string
  ): Promise<IPrescription | null> {
    try {
      const prescription = await Prescription.findOne({
        _id: prescriptionId,
        clerkUserId
      }).lean();

      return prescription;
    } catch (error) {
      console.error('Error getting prescription:', error);
      throw error;
    }
  }

  // Update prescription
  static async updatePrescription(
    prescriptionId: string,
    clerkUserId: string,
    updateData: UpdatePrescriptionRequest
  ): Promise<IPrescription | null> {
    try {
      const prescription = await Prescription.findOneAndUpdate(
        { _id: prescriptionId, clerkUserId },
        { $set: updateData },
        { new: true, runValidators: true }
      ).lean();

      return prescription;
    } catch (error) {
      console.error('Error updating prescription:', error);
      throw error;
    }
  }

  // Delete prescription
  static async deletePrescription(
    prescriptionId: string,
    clerkUserId: string
  ): Promise<boolean> {
    try {
      const prescription = await Prescription.findOne({
        _id: prescriptionId,
        clerkUserId
      });

      if (!prescription) {
        return false;
      }

      // Delete file from filesystem
      if (fs.existsSync(prescription.filePath)) {
        fs.unlinkSync(prescription.filePath);
      }

      // Delete from database
      await Prescription.deleteOne({ _id: prescriptionId, clerkUserId });
      
      return true;
    } catch (error) {
      console.error('Error deleting prescription:', error);
      throw error;
    }
  }

  // Update prescription status
  static async updatePrescriptionStatus(
    prescriptionId: string,
    status: DocumentStatus,
    extractedText?: string,
    metadata?: any
  ): Promise<IPrescription | null> {
    try {
      const updateData: any = { status };
      
      if (extractedText) {
        updateData.extractedText = extractedText;
      }
      
      if (metadata) {
        updateData.metadata = metadata;
      }

      const prescription = await Prescription.findByIdAndUpdate(
        prescriptionId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).lean();

      return prescription;
    } catch (error) {
      console.error('Error updating prescription status:', error);
      throw error;
    }
  }

  // Get text content for summarization (extractedText, or extract from PDF, or title+description)
  static async getPrescriptionTextContent(
    prescriptionId: string,
    clerkUserId: string
  ): Promise<string | null> {
    try {
      const prescription = await Prescription.findOne({
        _id: prescriptionId,
        clerkUserId
      }).lean();

      if (!prescription) {
        return null;
      }

      if (prescription.extractedText && prescription.extractedText.trim().length > 0) {
        return prescription.extractedText.trim();
      }

      if (!fs.existsSync(prescription.filePath)) {
        const fallback = [prescription.title, prescription.description].filter(Boolean).join('\n');
        return fallback.length > 0 ? fallback : null;
      }

      const mimeType = (prescription.mimeType || '').toLowerCase();
      if (mimeType.includes('pdf')) {
        const dataBuffer = fs.readFileSync(prescription.filePath);
        const data = await pdfParse(dataBuffer);
        const text = (data?.text || '').trim();
        if (text.length > 0) return text;
      }

      const fallback = [prescription.title, prescription.description].filter(Boolean).join('\n');
      return fallback.length > 0 ? fallback : null;
    } catch (error) {
      console.error('Error getting prescription text content:', error);
      throw error;
    }
  }

  // Get file path for download
  static async getFilePathForDownload(
    prescriptionId: string,
    clerkUserId: string
  ): Promise<{ filePath: string; fileName: string; mimeType: string } | null> {
    try {
      const prescription = await Prescription.findOne({
        _id: prescriptionId,
        clerkUserId
      }).lean();

      if (!prescription) {
        return null;
      }

      // Check if file exists
      if (!fs.existsSync(prescription.filePath)) {
        throw new Error('File not found on server');
      }

      return {
        filePath: prescription.filePath,
        fileName: prescription.originalFileName,
        mimeType: prescription.mimeType
      };
    } catch (error) {
      console.error('Error getting file path:', error);
      throw error;
    }
  }

  // Get prescription statistics
  static async getPrescriptionStats(clerkUserId: string): Promise<{
    total: number;
    byType: Record<DocumentType, number>;
    byStatus: Record<DocumentStatus, number>;
    totalSize: number;
  }> {
    try {
      const user = await User.findOne({ clerkUserId });
      if (!user) {
        throw new Error('User not found');
      }

      const [total, byType, byStatus, totalSizeResult] = await Promise.all([
        Prescription.countDocuments({ clerkUserId }),
        Prescription.aggregate([
          { $match: { clerkUserId } },
          { $group: { _id: '$documentType', count: { $sum: 1 } } }
        ]),
        Prescription.aggregate([
          { $match: { clerkUserId } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        Prescription.aggregate([
          { $match: { clerkUserId } },
          { $group: { _id: null, totalSize: { $sum: '$fileSize' } } }
        ])
      ]);

      // Format results
      const byTypeFormatted: Record<DocumentType, number> = {} as Record<DocumentType, number>;
      byType.forEach(item => {
        byTypeFormatted[item._id as DocumentType] = item.count;
      });

      const byStatusFormatted: Record<DocumentStatus, number> = {} as Record<DocumentStatus, number>;
      byStatus.forEach(item => {
        byStatusFormatted[item._id as DocumentStatus] = item.count;
      });

      return {
        total,
        byType: byTypeFormatted,
        byStatus: byStatusFormatted,
        totalSize: totalSizeResult[0]?.totalSize || 0
      };
    } catch (error) {
      console.error('Error getting prescription stats:', error);
      throw error;
    }
  }
}

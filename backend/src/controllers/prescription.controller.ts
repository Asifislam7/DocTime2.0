import { Request, Response } from 'express';
import { PrescriptionService } from '../services/prescription.service';
import { DocumentType, DocumentStatus } from '../types/prescription.types';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/prescriptions');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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
  } else {
    cb(new Error('Invalid file type. Only PDF, images, and documents are allowed.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export class PrescriptionController {
  // Upload prescription document
  static async uploadPrescription(req: Request, res: Response): Promise<void> {
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
      if (!Object.values(DocumentType).includes(documentType)) {
        res.status(400).json({
          success: false,
          message: 'Invalid document type'
        });
        return;
      }

      // Parse tags if provided
      let parsedTags: string[] = [];
      if (tags) {
        try {
          parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
        } catch {
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

      const prescription = await PrescriptionService.createPrescription(
        clerkUserId,
        {
          title,
          description,
          documentType,
          tags: parsedTags,
          isPublic: isPublic === 'true'
        },
        fileInfo
      );

      res.status(201).json({
        success: true,
        message: 'Prescription uploaded successfully',
        data: prescription
      });
    } catch (error) {
      console.error('Error uploading prescription:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading prescription',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get user's prescriptions
  static async getPrescriptions(req: Request, res: Response): Promise<void> {
    try {
      const { clerkUserId } = req.params;
      const {
        documentType,
        status,
        search,
        page = '1',
        limit = '10',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const query = {
        documentType: documentType as DocumentType,
        status: status as DocumentStatus,
        search: search as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const result = await PrescriptionService.getPrescriptionsByUser(clerkUserId, query);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error getting prescriptions:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting prescriptions',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get single prescription
  static async getPrescription(req: Request, res: Response): Promise<void> {
    try {
      const { prescriptionId, clerkUserId } = req.params;

      const prescription = await PrescriptionService.getPrescriptionById(
        prescriptionId,
        clerkUserId
      );

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
    } catch (error) {
      console.error('Error getting prescription:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting prescription',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update prescription
  static async updatePrescription(req: Request, res: Response): Promise<void> {
    try {
      const { prescriptionId, clerkUserId } = req.params;
      const updateData = req.body;

      const prescription = await PrescriptionService.updatePrescription(
        prescriptionId,
        clerkUserId,
        updateData
      );

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
    } catch (error) {
      console.error('Error updating prescription:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating prescription',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete prescription
  static async deletePrescription(req: Request, res: Response): Promise<void> {
    try {
      const { prescriptionId, clerkUserId } = req.params;

      const deleted = await PrescriptionService.deletePrescription(
        prescriptionId,
        clerkUserId
      );

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
    } catch (error) {
      console.error('Error deleting prescription:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting prescription',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Download prescription file
  static async downloadPrescription(req: Request, res: Response): Promise<void> {
    try {
      const { prescriptionId, clerkUserId } = req.params;

      const fileInfo = await PrescriptionService.getFilePathForDownload(
        prescriptionId,
        clerkUserId
      );

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
      const fileStream = fs.createReadStream(fileInfo.filePath);
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
    } catch (error) {
      console.error('Error downloading prescription:', error);
      res.status(500).json({
        success: false,
        message: 'Error downloading prescription',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get prescription statistics
  static async getPrescriptionStats(req: Request, res: Response): Promise<void> {
    try {
      const { clerkUserId } = req.params;

      const stats = await PrescriptionService.getPrescriptionStats(clerkUserId);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      console.error('Error getting prescription stats:', err);
      res.status(500).json({
        success: false,
        message: 'Error getting prescription statistics',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }

  // Update prescription status (for OCR processing)
  static async updatePrescriptionStatus(req: Request, res: Response): Promise<void> {
    try {
      const { prescriptionId } = req.params;
      const { status, extractedText, metadata } = req.body;

      if (!Object.values(DocumentStatus).includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
        return;
      }

      const prescription = await PrescriptionService.updatePrescriptionStatus(
        prescriptionId,
        status,
        extractedText,
        metadata
      );

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
    } catch (error) {
      console.error('Error updating prescription status:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating prescription status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

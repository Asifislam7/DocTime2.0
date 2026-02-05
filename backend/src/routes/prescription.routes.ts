import { Router } from 'express';
import { PrescriptionController, upload } from '../controllers/prescription.controller';

const router = Router();

// Upload prescription document
router.post('/upload', upload.single('file'), PrescriptionController.uploadPrescription);

// Get user's prescriptions with query parameters
router.get('/user/:clerkUserId', PrescriptionController.getPrescriptions);

// Get single prescription
router.get('/:prescriptionId/user/:clerkUserId', PrescriptionController.getPrescription);

// Update prescription
router.put('/:prescriptionId/user/:clerkUserId', PrescriptionController.updatePrescription);

// Delete prescription
router.delete('/:prescriptionId/user/:clerkUserId', PrescriptionController.deletePrescription);

// Download prescription file
router.get('/:prescriptionId/user/:clerkUserId/download', PrescriptionController.downloadPrescription);

// Get AI summary for prescription
router.get('/:prescriptionId/user/:clerkUserId/summary', PrescriptionController.getPrescriptionSummary);

// Get prescription statistics
router.get('/user/:clerkUserId/stats', PrescriptionController.getPrescriptionStats);

// Update prescription status (for OCR processing)
router.put('/:prescriptionId/status', PrescriptionController.updatePrescriptionStatus);

export default router;

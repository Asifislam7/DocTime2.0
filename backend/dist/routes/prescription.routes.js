"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prescription_controller_1 = require("../controllers/prescription.controller");
const router = (0, express_1.Router)();
// Upload prescription document
router.post('/upload', prescription_controller_1.upload.single('file'), prescription_controller_1.PrescriptionController.uploadPrescription);
// Get user's prescriptions with query parameters
router.get('/user/:clerkUserId', prescription_controller_1.PrescriptionController.getPrescriptions);
// Get single prescription
router.get('/:prescriptionId/user/:clerkUserId', prescription_controller_1.PrescriptionController.getPrescription);
// Update prescription
router.put('/:prescriptionId/user/:clerkUserId', prescription_controller_1.PrescriptionController.updatePrescription);
// Delete prescription
router.delete('/:prescriptionId/user/:clerkUserId', prescription_controller_1.PrescriptionController.deletePrescription);
// Download prescription file
router.get('/:prescriptionId/user/:clerkUserId/download', prescription_controller_1.PrescriptionController.downloadPrescription);
// Get AI summary for prescription
router.get('/:prescriptionId/user/:clerkUserId/summary', prescription_controller_1.PrescriptionController.getPrescriptionSummary);
// Get prescription statistics
router.get('/user/:clerkUserId/stats', prescription_controller_1.PrescriptionController.getPrescriptionStats);
// Update prescription status (for OCR processing)
router.put('/:prescriptionId/status', prescription_controller_1.PrescriptionController.updatePrescriptionStatus);
exports.default = router;
//# sourceMappingURL=prescription.routes.js.map
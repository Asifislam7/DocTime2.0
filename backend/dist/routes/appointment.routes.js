"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointment_controller_1 = require("../controllers/appointment.controller");
const router = express_1.default.Router();
// Get appointments by patient email
router.get('/email/:email', appointment_controller_1.AppointmentController.getAppointmentsByEmail);
// Get appointments by patient ID
router.get('/patient/:patientId', appointment_controller_1.AppointmentController.getAppointmentsByPatientId);
// Create new appointment
router.post('/', appointment_controller_1.AppointmentController.createAppointment);
// Create appointment from comprehensive form data
router.post('/from-form', appointment_controller_1.AppointmentController.createAppointmentFromForm);
// Update appointment status
router.put('/:appointmentId/status', appointment_controller_1.AppointmentController.updateAppointmentStatus);
// Reschedule appointment
router.patch('/:appointmentId/reschedule', appointment_controller_1.AppointmentController.rescheduleAppointment);
// Cancel appointment
router.patch('/:appointmentId/cancel', appointment_controller_1.AppointmentController.cancelAppointment);
// Delete appointment
router.delete('/:appointmentId', appointment_controller_1.AppointmentController.deleteAppointment);
exports.default = router;
//# sourceMappingURL=appointment.routes.js.map
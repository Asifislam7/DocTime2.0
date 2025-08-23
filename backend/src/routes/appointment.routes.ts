import express from 'express';
import { AppointmentController } from '../controllers/appointment.controller';

const router = express.Router();

// Get appointments by patient email
router.get('/email/:email', AppointmentController.getAppointmentsByEmail);

// Get appointments by patient ID
router.get('/patient/:patientId', AppointmentController.getAppointmentsByPatientId);

// Create new appointment
router.post('/', AppointmentController.createAppointment);

// Create appointment from comprehensive form data
router.post('/from-form', AppointmentController.createAppointmentFromForm);

// Update appointment status
router.put('/:appointmentId/status', AppointmentController.updateAppointmentStatus);

// Reschedule appointment
router.patch('/:appointmentId/reschedule', AppointmentController.rescheduleAppointment);

// Cancel appointment
router.patch('/:appointmentId/cancel', AppointmentController.cancelAppointment);

// Delete appointment
router.delete('/:appointmentId', AppointmentController.deleteAppointment);

export default router;

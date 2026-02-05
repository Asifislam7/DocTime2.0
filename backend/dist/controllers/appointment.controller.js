"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const appointment_service_1 = require("../services/appointment.service");
const User_model_1 = require("../models/User.model");
class AppointmentController {
    /**
     * Get appointments by patient email
     */
    static async getAppointmentsByEmail(req, res) {
        try {
            const { email } = req.params;
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email parameter is required'
                });
            }
            const appointments = await appointment_service_1.AppointmentService.getAppointmentsByEmail(email);
            res.status(200).json({
                success: true,
                data: appointments,
                message: `Found ${appointments.length} appointment(s)`
            });
        }
        catch (error) {
            console.error('Error fetching appointments:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch appointments',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Get appointments by patient ID
     */
    static async getAppointmentsByPatientId(req, res) {
        try {
            const { patientId } = req.params;
            if (!patientId) {
                return res.status(400).json({
                    success: false,
                    message: 'Patient ID parameter is required'
                });
            }
            const appointments = await appointment_service_1.AppointmentService.getAppointmentsByPatientId(patientId);
            res.status(200).json({
                success: true,
                data: appointments,
                message: `Found ${appointments.length} appointment(s)`
            });
        }
        catch (error) {
            console.error('Error fetching appointments:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch appointments',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Create a new appointment with comprehensive data
     */
    static async createAppointment(req, res) {
        try {
            const appointmentData = req.body;
            // Validate required fields
            const requiredFields = ['patientId', 'patientEmail', 'patientName', 'doctorName', 'appointmentDate', 'reason'];
            for (const field of requiredFields) {
                if (!appointmentData[field]) {
                    return res.status(400).json({
                        success: false,
                        message: `${field} is required`
                    });
                }
            }
            const appointment = await appointment_service_1.AppointmentService.createAppointment(appointmentData);
            res.status(201).json({
                success: true,
                data: appointment,
                message: 'Appointment created successfully'
            });
        }
        catch (error) {
            console.error('Error creating appointment:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create appointment',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Create appointment from comprehensive form data
     */
    static async createAppointmentFromForm(req, res) {
        try {
            const formData = req.body;
            // Validate required fields
            const requiredFields = ['email', 'name', 'phoneNumber', 'dateOfBirth', 'gender', 'address', 'primaryPhysician', 'schedule', 'reason'];
            for (const field of requiredFields) {
                if (!formData[field]) {
                    return res.status(400).json({
                        success: false,
                        message: `${field} is required`
                    });
                }
            }
            // First, create or update user record
            let user = await User_model_1.User.findOne({ email: formData.email.toLowerCase() });
            if (!user) {
                // Create new user
                const userData = {
                    clerkUserId: formData.clerkUserId || `temp_${Date.now()}`,
                    email: formData.email,
                    name: formData.name,
                    role: 'patient',
                    phoneNumber: formData.phoneNumber,
                    dateOfBirth: formData.dateOfBirth instanceof Date ? formData.dateOfBirth : new Date(formData.dateOfBirth),
                    gender: formData.gender,
                    address: formData.address,
                    medicalHistory: formData.pastMedicalHistory ? [formData.pastMedicalHistory] : [],
                    allergies: formData.allergies ? [formData.allergies] : [],
                    currentMedications: formData.currentMedications ? [formData.currentMedications] : [],
                    familyMedicalHistory: formData.familyMedicalHistory,
                    pastMedicalHistory: formData.pastMedicalHistory,
                    insuranceProvider: formData.insuranceProvider,
                    insurancePolicyNumber: formData.insurancePolicyNumber,
                    emergencyContactName: formData.emergencyContactName,
                    emergencyContactNumber: formData.emergencyContactNumber,
                    notificationPreferences: {
                        email: formData.emailNotifications,
                        sms: formData.smsNotifications,
                        push: formData.pushNotifications,
                    }
                };
                user = new User_model_1.User(userData);
                await user.save();
            }
            else {
                // Update existing user with new information
                user.phoneNumber = formData.phoneNumber;
                user.dateOfBirth = formData.dateOfBirth instanceof Date ? formData.dateOfBirth : new Date(formData.dateOfBirth);
                user.gender = formData.gender;
                user.address = formData.address;
                user.medicalHistory = formData.pastMedicalHistory ? [formData.pastMedicalHistory] : [];
                user.allergies = formData.allergies ? [formData.allergies] : [];
                user.currentMedications = formData.currentMedications ? [formData.currentMedications] : [];
                user.familyMedicalHistory = formData.familyMedicalHistory;
                user.pastMedicalHistory = formData.pastMedicalHistory;
                user.insuranceProvider = formData.insuranceProvider;
                user.insurancePolicyNumber = formData.insurancePolicyNumber;
                user.emergencyContactName = formData.emergencyContactName;
                user.emergencyContactNumber = formData.emergencyContactNumber;
                user.notificationPreferences = {
                    email: formData.emailNotifications,
                    sms: formData.smsNotifications,
                    push: formData.pushNotifications,
                };
                await user.save();
            }
            // Now create the appointment record
            const appointment = await appointment_service_1.AppointmentService.createAppointmentFromForm(formData, user._id.toString());
            // Add appointment reference to user
            user.appointments.push(appointment._id);
            await user.save();
            res.status(201).json({
                success: true,
                data: {
                    user: user,
                    appointment: appointment
                },
                message: 'Appointment created successfully'
            });
        }
        catch (error) {
            console.error('Error creating appointment from form:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create appointment',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Update appointment status
     */
    static async updateAppointmentStatus(req, res) {
        try {
            const { appointmentId } = req.params;
            const { status } = req.body;
            if (!appointmentId || !status) {
                return res.status(400).json({
                    success: false,
                    message: 'Appointment ID and status are required'
                });
            }
            const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be one of: pending, confirmed, cancelled, completed'
                });
            }
            const appointment = await appointment_service_1.AppointmentService.updateAppointmentStatus(appointmentId, status);
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found'
                });
            }
            res.status(200).json({
                success: true,
                data: appointment,
                message: 'Appointment status updated successfully'
            });
        }
        catch (error) {
            console.error('Error updating appointment status:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update appointment status',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Delete appointment
     */
    static async deleteAppointment(req, res) {
        try {
            const { appointmentId } = req.params;
            if (!appointmentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Appointment ID parameter is required'
                });
            }
            const deleted = await appointment_service_1.AppointmentService.deleteAppointment(appointmentId);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Appointment deleted successfully'
            });
        }
        catch (error) {
            console.error('Error deleting appointment:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete appointment',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Reschedule appointment
     */
    static async rescheduleAppointment(req, res) {
        try {
            const { appointmentId } = req.params;
            const { appointmentDate, appointmentTime } = req.body;
            if (!appointmentId || !appointmentDate || !appointmentTime) {
                return res.status(400).json({
                    success: false,
                    message: 'Appointment ID, date, and time are required'
                });
            }
            // Validate date format
            const newDate = new Date(appointmentDate);
            if (isNaN(newDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format'
                });
            }
            // Check if the new date is in the past
            if (newDate < new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot schedule appointment in the past'
                });
            }
            const appointment = await appointment_service_1.AppointmentService.rescheduleAppointment(appointmentId, newDate, appointmentTime);
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found'
                });
            }
            res.status(200).json({
                success: true,
                data: appointment,
                message: 'Appointment rescheduled successfully'
            });
        }
        catch (error) {
            console.error('Error rescheduling appointment:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to reschedule appointment',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Cancel appointment
     */
    static async cancelAppointment(req, res) {
        try {
            const { appointmentId } = req.params;
            if (!appointmentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Appointment ID parameter is required'
                });
            }
            const appointment = await appointment_service_1.AppointmentService.cancelAppointment(appointmentId);
            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found'
                });
            }
            res.status(200).json({
                success: true,
                data: appointment,
                message: 'Appointment cancelled successfully'
            });
        }
        catch (error) {
            console.error('Error cancelling appointment:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to cancel appointment',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.AppointmentController = AppointmentController;
//# sourceMappingURL=appointment.controller.js.map
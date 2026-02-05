"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const Appointment_model_1 = require("../models/Appointment.model");
class AppointmentService {
    /**
     * Get appointments by patient email
     */
    static async getAppointmentsByEmail(email) {
        try {
            const appointments = await Appointment_model_1.Appointment.find({
                patientEmail: email.toLowerCase()
            })
                .sort({ appointmentDate: 1, createdAt: -1 })
                .exec();
            return appointments;
        }
        catch (error) {
            throw new Error(`Failed to fetch appointments: ${error}`);
        }
    }
    /**
     * Get appointments by patient ID
     */
    static async getAppointmentsByPatientId(patientId) {
        try {
            const appointments = await Appointment_model_1.Appointment.find({
                patientId: patientId
            })
                .sort({ appointmentDate: 1, createdAt: -1 })
                .exec();
            return appointments;
        }
        catch (error) {
            throw new Error(`Failed to fetch appointments: ${error}`);
        }
    }
    /**
     * Create a new appointment with comprehensive data
     */
    static async createAppointment(appointmentData) {
        try {
            const appointment = new Appointment_model_1.Appointment(appointmentData);
            const savedAppointment = await appointment.save();
            return savedAppointment;
        }
        catch (error) {
            throw new Error(`Failed to create appointment: ${error}`);
        }
    }
    /**
     * Create appointment from form data (comprehensive)
     */
    static async createAppointmentFromForm(formData, userId) {
        try {
            // Convert schedule string to Date object if it's not already
            const scheduleDate = formData.schedule instanceof Date ? formData.schedule : new Date(formData.schedule);
            // Format time from the schedule date
            const appointmentTime = scheduleDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            const appointmentData = {
                // Patient Information
                patientId: userId,
                patientEmail: formData.email,
                patientName: formData.name,
                patientPhoneNumber: formData.phoneNumber,
                patientDateOfBirth: formData.dateOfBirth,
                patientGender: formData.gender,
                patientAddress: formData.address,
                // Medical Information
                allergies: formData.allergies ? [formData.allergies] : [],
                currentMedications: formData.currentMedications ? [formData.currentMedications] : [],
                familyMedicalHistory: formData.familyMedicalHistory,
                pastMedicalHistory: formData.pastMedicalHistory,
                // Insurance & Emergency Contact
                insuranceProvider: formData.insuranceProvider,
                insurancePolicyNumber: formData.insurancePolicyNumber,
                emergencyContactName: formData.emergencyContactName,
                emergencyContactNumber: formData.emergencyContactNumber,
                // Appointment Details
                doctorName: formData.primaryPhysician,
                appointmentDate: scheduleDate,
                appointmentTime: appointmentTime,
                reason: formData.reason,
                notes: formData.note,
                status: 'pending',
                // Consent & Preferences
                treatmentConsent: formData.treatmentConsent,
                disclosureConsent: formData.disclosureConsent,
                privacyConsent: formData.privacyConsent,
                emailNotifications: formData.emailNotifications,
                smsNotifications: formData.smsNotifications,
                pushNotifications: formData.pushNotifications,
                // Identification
                identificationType: formData.identificationType,
                identificationNumber: formData.identificationNumber
            };
            const appointment = new Appointment_model_1.Appointment(appointmentData);
            const savedAppointment = await appointment.save();
            return savedAppointment;
        }
        catch (error) {
            throw new Error(`Failed to create appointment from form: ${error}`);
        }
    }
    /**
     * Update appointment status
     */
    static async updateAppointmentStatus(appointmentId, status) {
        try {
            const appointment = await Appointment_model_1.Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });
            return appointment;
        }
        catch (error) {
            throw new Error(`Failed to update appointment status: ${error}`);
        }
    }
    /**
     * Delete appointment
     */
    static async deleteAppointment(appointmentId) {
        try {
            const result = await Appointment_model_1.Appointment.findByIdAndDelete(appointmentId);
            return !!result;
        }
        catch (error) {
            throw new Error(`Failed to delete appointment: ${error}`);
        }
    }
    /**
     * Get appointment by ID
     */
    static async getAppointmentById(appointmentId) {
        try {
            const appointment = await Appointment_model_1.Appointment.findById(appointmentId);
            return appointment;
        }
        catch (error) {
            throw new Error(`Failed to fetch appointment: ${error}`);
        }
    }
    /**
     * Reschedule appointment
     */
    static async rescheduleAppointment(appointmentId, newDate, newTime) {
        try {
            // First check if the appointment exists and can be rescheduled
            const appointment = await Appointment_model_1.Appointment.findById(appointmentId);
            if (!appointment) {
                throw new Error('Appointment not found');
            }
            // Check if appointment can be rescheduled (not completed or already cancelled)
            if (appointment.status === 'completed' || appointment.status === 'cancelled') {
                throw new Error('Cannot reschedule completed or cancelled appointments');
            }
            // Update the appointment with new date and time
            const updatedAppointment = await Appointment_model_1.Appointment.findByIdAndUpdate(appointmentId, {
                appointmentDate: newDate,
                appointmentTime: newTime,
                updatedAt: new Date()
            }, { new: true });
            return updatedAppointment;
        }
        catch (error) {
            throw new Error(`Failed to reschedule appointment: ${error}`);
        }
    }
    /**
     * Cancel appointment
     */
    static async cancelAppointment(appointmentId) {
        try {
            // First check if the appointment exists and can be cancelled
            const appointment = await Appointment_model_1.Appointment.findById(appointmentId);
            if (!appointment) {
                throw new Error('Appointment not found');
            }
            // Check if appointment can be cancelled (not already completed or cancelled)
            if (appointment.status === 'completed' || appointment.status === 'cancelled') {
                throw new Error('Cannot cancel completed or already cancelled appointments');
            }
            // Update the appointment status to cancelled
            const cancelledAppointment = await Appointment_model_1.Appointment.findByIdAndUpdate(appointmentId, {
                status: 'cancelled',
                updatedAt: new Date()
            }, { new: true });
            return cancelledAppointment;
        }
        catch (error) {
            throw new Error(`Failed to cancel appointment: ${error}`);
        }
    }
}
exports.AppointmentService = AppointmentService;
//# sourceMappingURL=appointment.service.js.map
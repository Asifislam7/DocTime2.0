import { Appointment, IAppointment } from '../models/Appointment.model';

// Interface for form data received from frontend
interface AppointmentFormData {
  email: string;
  name: string;
  phoneNumber: string;
  dateOfBirth: Date | string;
  gender: string;
  address: string;
  allergies?: string;
  currentMedications?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  primaryPhysician: string;
  schedule: Date | string;
  reason: string;
  note?: string;
  treatmentConsent: boolean;
  disclosureConsent: boolean;
  privacyConsent: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  identificationType?: string;
  identificationNumber?: string;
}

export class AppointmentService {
  /**
   * Get appointments by patient email
   */
  static async getAppointmentsByEmail(email: string): Promise<IAppointment[]> {
    try {
      const appointments = await Appointment.find({ 
        patientEmail: email.toLowerCase() 
      })
      .sort({ appointmentDate: 1, createdAt: -1 })
      .exec();
      
      return appointments;
    } catch (error) {
      throw new Error(`Failed to fetch appointments: ${error}`);
    }
  }

  /**
   * Get appointments by patient ID
   */
  static async getAppointmentsByPatientId(patientId: string): Promise<IAppointment[]> {
    try {
      const appointments = await Appointment.find({ 
        patientId: patientId 
      })
      .sort({ appointmentDate: 1, createdAt: -1 })
      .exec();
      
      return appointments;
    } catch (error) {
      throw new Error(`Failed to fetch appointments: ${error}`);
    }
  }

  /**
   * Create a new appointment with comprehensive data
   */
  static async createAppointment(appointmentData: Partial<IAppointment>): Promise<IAppointment> {
    try {
      const appointment = new Appointment(appointmentData);
      const savedAppointment = await appointment.save();
      return savedAppointment;
    } catch (error) {
      throw new Error(`Failed to create appointment: ${error}`);
    }
  }

  /**
   * Create appointment from form data (comprehensive)
   */
  static async createAppointmentFromForm(formData: AppointmentFormData, userId: string): Promise<IAppointment> {
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

      const appointment = new Appointment(appointmentData);
      const savedAppointment = await appointment.save();
      return savedAppointment;
    } catch (error) {
      throw new Error(`Failed to create appointment from form: ${error}`);
    }
  }

  /**
   * Update appointment status
   */
  static async updateAppointmentStatus(
    appointmentId: string, 
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  ): Promise<IAppointment | null> {
    try {
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { status },
        { new: true }
      );
      return appointment;
    } catch (error) {
      throw new Error(`Failed to update appointment status: ${error}`);
    }
  }

  /**
   * Delete appointment
   */
  static async deleteAppointment(appointmentId: string): Promise<boolean> {
    try {
      const result = await Appointment.findByIdAndDelete(appointmentId);
      return !!result;
    } catch (error) {
      throw new Error(`Failed to delete appointment: ${error}`);
    }
  }

  /**
   * Get appointment by ID
   */
  static async getAppointmentById(appointmentId: string): Promise<IAppointment | null> {
    try {
      const appointment = await Appointment.findById(appointmentId);
      return appointment;
    } catch (error) {
      throw new Error(`Failed to fetch appointment: ${error}`);
    }
  }

  /**
   * Reschedule appointment
   */
  static async rescheduleAppointment(
    appointmentId: string, 
    newDate: Date, 
    newTime: string
  ): Promise<IAppointment | null> {
    try {
      // First check if the appointment exists and can be rescheduled
      const appointment = await Appointment.findById(appointmentId);
      
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Check if appointment can be rescheduled (not completed or already cancelled)
      if (appointment.status === 'completed' || appointment.status === 'cancelled') {
        throw new Error('Cannot reschedule completed or cancelled appointments');
      }

      // Update the appointment with new date and time
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { 
          appointmentDate: newDate,
          appointmentTime: newTime,
          updatedAt: new Date()
        },
        { new: true }
      );

      return updatedAppointment;
    } catch (error) {
      throw new Error(`Failed to reschedule appointment: ${error}`);
    }
  }

  /**
   * Cancel appointment
   */
  static async cancelAppointment(appointmentId: string): Promise<IAppointment | null> {
    try {
      // First check if the appointment exists and can be cancelled
      const appointment = await Appointment.findById(appointmentId);
      
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Check if appointment can be cancelled (not already completed or cancelled)
      if (appointment.status === 'completed' || appointment.status === 'cancelled') {
        throw new Error('Cannot cancel completed or already cancelled appointments');
      }

      // Update the appointment status to cancelled
      const cancelledAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { 
          status: 'cancelled',
          updatedAt: new Date()
        },
        { new: true }
      );

      return cancelledAppointment;
    } catch (error) {
      throw new Error(`Failed to cancel appointment: ${error}`);
    }
  }
}

import { IAppointment } from '../models/Appointment.model';
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
export declare class AppointmentService {
    /**
     * Get appointments by patient email
     */
    static getAppointmentsByEmail(email: string): Promise<IAppointment[]>;
    /**
     * Get appointments by patient ID
     */
    static getAppointmentsByPatientId(patientId: string): Promise<IAppointment[]>;
    /**
     * Create a new appointment with comprehensive data
     */
    static createAppointment(appointmentData: Partial<IAppointment>): Promise<IAppointment>;
    /**
     * Create appointment from form data (comprehensive)
     */
    static createAppointmentFromForm(formData: AppointmentFormData, userId: string): Promise<IAppointment>;
    /**
     * Update appointment status
     */
    static updateAppointmentStatus(appointmentId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<IAppointment | null>;
    /**
     * Delete appointment
     */
    static deleteAppointment(appointmentId: string): Promise<boolean>;
    /**
     * Get appointment by ID
     */
    static getAppointmentById(appointmentId: string): Promise<IAppointment | null>;
    /**
     * Reschedule appointment
     */
    static rescheduleAppointment(appointmentId: string, newDate: Date, newTime: string): Promise<IAppointment | null>;
    /**
     * Cancel appointment
     */
    static cancelAppointment(appointmentId: string): Promise<IAppointment | null>;
}
export {};
//# sourceMappingURL=appointment.service.d.ts.map
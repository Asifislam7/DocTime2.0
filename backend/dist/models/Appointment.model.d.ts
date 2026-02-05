import mongoose, { Document } from 'mongoose';
export interface IAppointment extends Document {
    patientId: mongoose.Types.ObjectId;
    patientEmail: string;
    patientName: string;
    patientPhoneNumber: string;
    patientDateOfBirth: Date;
    patientGender: string;
    patientAddress: string;
    allergies: string[];
    currentMedications: string[];
    familyMedicalHistory?: string;
    pastMedicalHistory?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    doctorName: string;
    appointmentDate: Date;
    appointmentTime: string;
    reason: string;
    notes?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    treatmentConsent: boolean;
    disclosureConsent: boolean;
    privacyConsent: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    identificationType?: string;
    identificationNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Appointment: mongoose.Model<IAppointment, {}, {}, {}, mongoose.Document<unknown, {}, IAppointment, {}, {}> & IAppointment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export { Appointment };
//# sourceMappingURL=Appointment.model.d.ts.map
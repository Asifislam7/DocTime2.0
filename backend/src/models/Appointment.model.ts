import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  // Patient Information (from User)
  patientId: mongoose.Types.ObjectId;
  patientEmail: string;
  patientName: string;
  patientPhoneNumber: string;
  patientDateOfBirth: Date;
  patientGender: string;
  patientAddress: string;
  
  // Medical Information
  allergies: string[];
  currentMedications: string[];
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  
  // Insurance & Emergency Contact
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  
  // Appointment Details
  doctorName: string;
  appointmentDate: Date;
  appointmentTime: string;
  reason: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  
  // Consent & Preferences
  treatmentConsent: boolean;
  disclosureConsent: boolean;
  privacyConsent: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  
  // Identification
  identificationType?: string;
  identificationNumber?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>({
  // Patient Information (from User)
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientPhoneNumber: {
    type: String,
    required: true
  },
  patientDateOfBirth: {
    type: Date,
    required: true
  },
  patientGender: {
    type: String,
    required: true
  },
  patientAddress: {
    type: String,
    required: true
  },
  
  // Medical Information
  allergies: [{
    type: String,
    trim: true
  }],
  currentMedications: [{
    type: String,
    trim: true
  }],
  familyMedicalHistory: {
    type: String,
    trim: true,
    required: false
  },
  pastMedicalHistory: {
    type: String,
    trim: true,
    required: false
  },
  
  // Insurance & Emergency Contact
  insuranceProvider: {
    type: String,
    trim: true,
    required: false
  },
  insurancePolicyNumber: {
    type: String,
    trim: true,
    required: false
  },
  emergencyContactName: {
    type: String,
    trim: true,
    required: false
  },
  emergencyContactNumber: {
    type: String,
    trim: true,
    required: false
  },
  
  // Appointment Details
  doctorName: {
    type: String,
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    trim: true,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  
  // Consent & Preferences
  treatmentConsent: {
    type: Boolean,
    required: true
  },
  disclosureConsent: {
    type: Boolean,
    required: true
  },
  privacyConsent: {
    type: Boolean,
    required: true
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: false
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  
  // Identification
  identificationType: {
    type: String,
    trim: true,
    required: false
  },
  identificationNumber: {
    type: String,
    trim: true,
    required: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
appointmentSchema.index({ patientEmail: 1 });
appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ doctorName: 1 });
appointmentSchema.index({ createdAt: -1 });

const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);

export { Appointment };

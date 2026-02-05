"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const appointmentSchema = new mongoose_1.Schema({
    // Patient Information (from User)
    patientId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const Appointment = mongoose_1.default.model('Appointment', appointmentSchema);
exports.Appointment = Appointment;
//# sourceMappingURL=Appointment.model.js.map
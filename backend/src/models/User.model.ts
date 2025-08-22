import mongoose, { Schema } from 'mongoose';
import { UserRole, UserStatus, Gender } from '../types/user.types';

// Create the user schema
const userSchema = new Schema({
  // Required fields with validation
  clerkUserId: {
    type: String,
    required: [true, 'Clerk user ID is required'],
    unique: true,
    index: true,
    trim: true
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  role: {
    type: String,
    required: [true, 'User role is required'],
    enum: {
      values: Object.values(UserRole),
      message: 'Invalid user role'
    },
    index: true
  },
  
  status: {
    type: String,
    required: [true, 'User status is required'],
    enum: {
      values: Object.values(UserStatus),
      message: 'Invalid user status'
    },
    default: UserStatus.PENDING_VERIFICATION,
    index: true
  },
  
  // Optional fields
  profileImage: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Profile image must be a valid URL'
    }
  },
  
  phoneNumber: {
    type: String,
    trim: true,
    match: [
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please enter a valid phone number'
    ]
  },
  
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(v: Date) {
        if (!v) return true;
        const today = new Date();
        const age = today.getFullYear() - v.getFullYear();
        return age >= 0 && age <= 120;
      },
      message: 'Date of birth must be a valid date'
    }
  },
  
  gender: {
    type: String,
    enum: {
      values: Object.values(Gender),
      message: 'Invalid gender selection'
    }
  },
  
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  
  // Medical Information (for patients)
  medicalHistory: [{
    type: String,
    trim: true,
    maxlength: [200, 'Medical history item cannot exceed 200 characters']
  }],
  
  allergies: [{
    type: String,
    trim: true,
    maxlength: [100, 'Allergy description cannot exceed 100 characters']
  }],
  
  currentMedications: [{
    type: String,
    trim: true,
    maxlength: [200, 'Medication description cannot exceed 200 characters']
  }],
  
  familyMedicalHistory: {
    type: String,
    trim: true,
    maxlength: [1000, 'Family medical history cannot exceed 1000 characters']
  },
  
  pastMedicalHistory: {
    type: String,
    trim: true,
    maxlength: [1000, 'Past medical history cannot exceed 1000 characters']
  },
  
  // Insurance & Administrative (for patients)
  insuranceProvider: {
    type: String,
    trim: true,
    maxlength: [100, 'Insurance provider cannot exceed 100 characters']
  },
  
  insurancePolicyNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'Policy number cannot exceed 50 characters']
  },
  
  emergencyContactName: {
    type: String,
    trim: true,
    maxlength: [100, 'Emergency contact name cannot exceed 100 characters']
  },
  
  emergencyContactNumber: {
    type: String,
    trim: true,
    match: [
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please enter a valid emergency contact number'
    ]
  },
  
  // Preferences & Settings (for patients)
  preferredDoctors: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true }
  },
  
  // Professional Information (for doctors)
  specialization: [{
    type: String,
    trim: true,
    maxlength: [100, 'Specialization cannot exceed 100 characters']
  }],
  
  licenseNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'License number cannot exceed 50 characters']
  },
  
  yearsOfExperience: {
    type: Number,
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  
  education: [{
    degree: {
      type: String,
      trim: true,
      maxlength: [100, 'Degree cannot exceed 100 characters']
    },
    institution: {
      type: String,
      trim: true,
      maxlength: [200, 'Institution cannot exceed 200 characters']
    },
    graduationYear: {
      type: Number,
      min: [1950, 'Graduation year must be after 1950'],
      max: [new Date().getFullYear() + 1, 'Graduation year cannot be in the future']
    }
  }],
  
  // Practice Information (for doctors)
  practiceAddress: {
    type: String,
    trim: true,
    maxlength: [500, 'Practice address cannot exceed 500 characters']
  },
  
  practicePhone: {
    type: String,
    trim: true,
    match: [
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please enter a valid practice phone number'
    ]
  },
  
  consultationFee: {
    type: Number,
    min: [0, 'Consultation fee cannot be negative'],
    max: [10000, 'Consultation fee cannot exceed $10,000']
  },
  
  availableDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  
  availableHours: {
    start: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format']
    },
    end: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format']
    }
  },
  
  // Performance & Ratings (for doctors)
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'], // Changed from 1 to 0
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  
  totalRatings: {
    type: Number,
    min: [0, 'Total ratings cannot be negative'],
    default: 0
  },
  
  patientCount: {
    type: Number,
    min: [0, 'Patient count cannot be negative'],
    default: 0
  },
  
  // Administrative permissions (for admins)
  permissions: [{
    type: String,
    enum: ['user_management', 'system_config', 'data_export', 'analytics']
  }],
  
  managedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  systemLogs: [{
    type: Schema.Types.ObjectId,
    ref: 'SystemLog'
  }],
  
  // Relationships
  appointments: [{
    type: Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  
  medicalRecords: [{
    type: Schema.Types.ObjectId,
    ref: 'MedicalRecord'
  }],
  
  patients: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      if (ret.__v !== undefined) {
        delete ret.__v;
      }
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Virtual fields for computed properties
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Instance methods
userSchema.methods['updateLastLogin'] = async function() {
  (this as any).lastLoginAt = new Date();
  await (this as any).save();
};

userSchema.methods['isActive'] = function() {
  return (this as any).status === UserStatus.ACTIVE;
};

// Middleware for data consistency
userSchema.pre('save', function(next) {
  // Ensure email is always lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  
  // Validate doctor-specific requirements
  if (this.role === UserRole.DOCTOR) {
    if (!this.specialization || this.specialization.length === 0) {
      return next(new Error('Doctors must have at least one specialization'));
    }
    if (!this.licenseNumber) {
      return next(new Error('Doctors must have a license number'));
    }
  }
  
  next();
});

// Indexes for better query performance
userSchema.index({ clerkUserId: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ email: 1, role: 1 });
userSchema.index({ createdAt: -1 });

// Create and export the model
const User = mongoose.model('User', userSchema);

export { User };

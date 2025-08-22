// User role enumeration - ensures only valid roles can be assigned
export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin'
}

// User status for account management and business logic
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification'
}

// Gender options for medical records and demographic data
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

// Base user interface - common fields for all users
export interface IBaseUser {
  clerkUserId: string;        // Clerk authentication ID (unique)
  email: string;              // User's email address
  name: string;               // Full name
  role: UserRole;             // User role in the system
  status: UserStatus;         // Account status
  profileImage?: string;      // Optional profile picture URL
  phoneNumber?: string;       // Contact number
  dateOfBirth?: Date;         // For age calculations and medical records
  gender?: Gender;            // For medical and demographic purposes
  address?: string;           // Physical address
  createdAt: Date;            // Account creation timestamp
  updatedAt: Date;            // Last update timestamp
  lastLoginAt?: Date;         // Track user activity
}

// Patient-specific interface extending base user
export interface IPatient extends IBaseUser {
  role: UserRole.PATIENT;     // Enforce patient role
  
  // Medical Information
  medicalHistory?: string[];           // Array of medical conditions
  allergies?: string[];                // Known allergies
  currentMedications?: string[];       // Active medications
  familyMedicalHistory?: string;      // Family health background
  pastMedicalHistory?: string;        // Previous medical conditions
  
  // Insurance & Administrative
  insuranceProvider?: string;         // Insurance company name
  insurancePolicyNumber?: string;     // Policy identifier
  emergencyContactName?: string;      // Emergency contact person
  emergencyContactNumber?: string;    // Emergency contact phone
  
  // Preferences & Settings
  preferredDoctors?: string[];        // Favorite doctors (ObjectIds)
  notificationPreferences?: {         // Communication preferences
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  // Relationships
  appointments?: string[];            // Appointment ObjectIds
  medicalRecords?: string[];         // Medical record ObjectIds
}

// Doctor-specific interface extending base user
export interface IDoctor extends IBaseUser {
  role: UserRole.DOCTOR;      // Enforce doctor role
  
  // Professional Information
  specialization: string[];           // Medical specialties
  licenseNumber: string;              // Medical license
  yearsOfExperience: number;         // Professional experience
  education: {                        // Educational background
    degree: string;
    institution: string;
    graduationYear: number;
  }[];
  
  // Practice Information
  practiceAddress?: string;           // Office location
  practicePhone?: string;             // Office phone
  consultationFee?: number;           // Appointment cost
  availableDays?: string[];           // Working days
  availableHours?: {                  // Working hours
    start: string;                    // Format: "09:00"
    end: string;                      // Format: "17:00"
  };
  
  // Performance & Ratings
  rating?: number;                    // Average rating (1-5)
  totalRatings?: number;              // Number of ratings
  patientCount?: number;              // Total patients seen
  
  // Relationships
  appointments?: string[];            // Scheduled appointments
  patients?: string[];                // Patient ObjectIds
}

// Admin interface for system management
export interface IAdmin extends IBaseUser {
  role: UserRole.ADMIN;       // Enforce admin role
  
  // Administrative permissions
  permissions: string[];              // System access rights
  managedUsers?: string[];            // Users under management
  systemLogs?: string[];              // Admin action logs
}

// Union type for all user types
export type IUser = IPatient | IDoctor | IAdmin;

// Type guard functions for runtime type checking
export const isPatient = (user: IUser): user is IPatient => {
  return user.role === UserRole.PATIENT;
};

export const isDoctor = (user: IUser): user is IDoctor => {
  return user.role === UserRole.DOCTOR;
};

export const isAdmin = (user: IUser): user is IAdmin => {
  return user.role === UserRole.ADMIN;
};

// Input validation types for API requests
export interface CreateUserInput {
  clerkUserId: string;
  email: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
}

export interface UpdateUserInput {
  name?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  profileImage?: string;
}

// Response types for API consistency
export interface UserResponse {
  success: boolean;
  data?: IUser;
  message?: string;
  error?: string;
}

export interface UsersResponse {
  success: boolean;
  data?: IUser[];
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

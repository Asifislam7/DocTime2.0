export declare enum UserRole {
    PATIENT = "patient",
    DOCTOR = "doctor",
    ADMIN = "admin"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING_VERIFICATION = "pending_verification"
}
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other",
    PREFER_NOT_TO_SAY = "prefer_not_to_say"
}
export interface IBaseUser {
    clerkUserId: string;
    email: string;
    name: string;
    role: UserRole;
    status: UserStatus;
    profileImage?: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    gender?: Gender;
    address?: string;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
}
export interface IPatient extends IBaseUser {
    role: UserRole.PATIENT;
    medicalHistory?: string[];
    allergies?: string[];
    currentMedications?: string[];
    familyMedicalHistory?: string;
    pastMedicalHistory?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    preferredDoctors?: string[];
    notificationPreferences?: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
    appointments?: string[];
    medicalRecords?: string[];
}
export interface IDoctor extends IBaseUser {
    role: UserRole.DOCTOR;
    specialization: string[];
    licenseNumber: string;
    yearsOfExperience: number;
    education: {
        degree: string;
        institution: string;
        graduationYear: number;
    }[];
    practiceAddress?: string;
    practicePhone?: string;
    consultationFee?: number;
    availableDays?: string[];
    availableHours?: {
        start: string;
        end: string;
    };
    rating?: number;
    totalRatings?: number;
    patientCount?: number;
    appointments?: string[];
    patients?: string[];
}
export interface IAdmin extends IBaseUser {
    role: UserRole.ADMIN;
    permissions: string[];
    managedUsers?: string[];
    systemLogs?: string[];
}
export type IUser = IPatient | IDoctor | IAdmin;
export declare const isPatient: (user: IUser) => user is IPatient;
export declare const isDoctor: (user: IUser) => user is IDoctor;
export declare const isAdmin: (user: IUser) => user is IAdmin;
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
//# sourceMappingURL=user.types.d.ts.map
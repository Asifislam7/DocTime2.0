import mongoose from 'mongoose';
import { UserRole, UserStatus, Gender } from '../types/user.types';
declare const User: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    medicalHistory: unknown[];
    allergies: unknown[];
    currentMedications: unknown[];
    preferredDoctors: mongoose.Types.ObjectId[];
    specialization: unknown[];
    education: mongoose.Types.DocumentArray<any, any> | unknown[] | mongoose.Types.DocumentArray<{
        [x: string]: unknown;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        [x: string]: unknown;
    }> & {
        [x: string]: unknown;
    }> | unknown[];
    availableDays: unknown[] | unknown[] | unknown[] | unknown[] | unknown[] | unknown[] | unknown[];
    permissions: unknown[] | unknown[] | unknown[] | unknown[];
    managedUsers: mongoose.Types.ObjectId[];
    systemLogs: mongoose.Types.ObjectId[];
    appointments: mongoose.Types.ObjectId[];
    medicalRecords: mongoose.Types.ObjectId[];
    patients: mongoose.Types.ObjectId[];
    clerkUserId?: unknown;
    name?: unknown;
    email?: unknown;
    role?: unknown;
    status?: unknown;
    profileImage?: unknown;
    phoneNumber?: unknown;
    dateOfBirth?: {
        toJSON?: {};
        [Symbol.toPrimitive]?: {};
        toString?: {};
        toLocaleString?: {};
        toDateString?: {};
        toTimeString?: {};
        toLocaleDateString?: {};
        toLocaleTimeString?: {};
        getTime?: {};
        getFullYear?: {};
        getUTCFullYear?: {};
        getMonth?: {};
        getUTCMonth?: {};
        getDate?: {};
        getUTCDate?: {};
        getDay?: {};
        getUTCDay?: {};
        getHours?: {};
        getUTCHours?: {};
        getMinutes?: {};
        getUTCMinutes?: {};
        getSeconds?: {};
        getUTCSeconds?: {};
        getMilliseconds?: {};
        getUTCMilliseconds?: {};
        getTimezoneOffset?: {};
        setTime?: {};
        setMilliseconds?: {};
        setUTCMilliseconds?: {};
        setSeconds?: {};
        setUTCSeconds?: {};
        setMinutes?: {};
        setUTCMinutes?: {};
        setHours?: {};
        setUTCHours?: {};
        setDate?: {};
        setUTCDate?: {};
        setMonth?: {};
        setUTCMonth?: {};
        setFullYear?: {};
        setUTCFullYear?: {};
        toUTCString?: {};
        toISOString?: {};
        valueOf?: {};
    };
    gender?: unknown;
    address?: unknown;
    familyMedicalHistory?: unknown;
    pastMedicalHistory?: unknown;
    insuranceProvider?: unknown;
    insurancePolicyNumber?: unknown;
    emergencyContactName?: unknown;
    emergencyContactNumber?: unknown;
    notificationPreferences?: {
        push?: unknown;
        email?: unknown;
        sms?: unknown;
    };
    licenseNumber?: unknown;
    yearsOfExperience?: unknown;
    practiceAddress?: unknown;
    practicePhone?: unknown;
    consultationFee?: unknown;
    availableHours?: {
        start?: unknown;
        end?: unknown;
    };
    rating?: unknown;
    totalRatings?: unknown;
    patientCount?: unknown;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    medicalHistory: unknown[];
    allergies: unknown[];
    currentMedications: unknown[];
    preferredDoctors: mongoose.Types.ObjectId[];
    specialization: unknown[];
    education: mongoose.Types.DocumentArray<any, any> | unknown[] | mongoose.Types.DocumentArray<{
        [x: string]: unknown;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        [x: string]: unknown;
    }> & {
        [x: string]: unknown;
    }> | unknown[];
    availableDays: unknown[] | unknown[] | unknown[] | unknown[] | unknown[] | unknown[] | unknown[];
    permissions: unknown[] | unknown[] | unknown[] | unknown[];
    managedUsers: mongoose.Types.ObjectId[];
    systemLogs: mongoose.Types.ObjectId[];
    appointments: mongoose.Types.ObjectId[];
    medicalRecords: mongoose.Types.ObjectId[];
    patients: mongoose.Types.ObjectId[];
    clerkUserId?: unknown;
    name?: unknown;
    email?: unknown;
    role?: unknown;
    status?: unknown;
    profileImage?: unknown;
    phoneNumber?: unknown;
    dateOfBirth?: {
        toJSON?: {};
        [Symbol.toPrimitive]?: {};
        toString?: {};
        toLocaleString?: {};
        toDateString?: {};
        toTimeString?: {};
        toLocaleDateString?: {};
        toLocaleTimeString?: {};
        getTime?: {};
        getFullYear?: {};
        getUTCFullYear?: {};
        getMonth?: {};
        getUTCMonth?: {};
        getDate?: {};
        getUTCDate?: {};
        getDay?: {};
        getUTCDay?: {};
        getHours?: {};
        getUTCHours?: {};
        getMinutes?: {};
        getUTCMinutes?: {};
        getSeconds?: {};
        getUTCSeconds?: {};
        getMilliseconds?: {};
        getUTCMilliseconds?: {};
        getTimezoneOffset?: {};
        setTime?: {};
        setMilliseconds?: {};
        setUTCMilliseconds?: {};
        setSeconds?: {};
        setUTCSeconds?: {};
        setMinutes?: {};
        setUTCMinutes?: {};
        setHours?: {};
        setUTCHours?: {};
        setDate?: {};
        setUTCDate?: {};
        setMonth?: {};
        setUTCMonth?: {};
        setFullYear?: {};
        setUTCFullYear?: {};
        toUTCString?: {};
        toISOString?: {};
        valueOf?: {};
    };
    gender?: unknown;
    address?: unknown;
    familyMedicalHistory?: unknown;
    pastMedicalHistory?: unknown;
    insuranceProvider?: unknown;
    insurancePolicyNumber?: unknown;
    emergencyContactName?: unknown;
    emergencyContactNumber?: unknown;
    notificationPreferences?: {
        push?: unknown;
        email?: unknown;
        sms?: unknown;
    };
    licenseNumber?: unknown;
    yearsOfExperience?: unknown;
    practiceAddress?: unknown;
    practicePhone?: unknown;
    consultationFee?: unknown;
    availableHours?: {
        start?: unknown;
        end?: unknown;
    };
    rating?: unknown;
    totalRatings?: unknown;
    patientCount?: unknown;
}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
        transform: (doc: mongoose.Document<unknown, {}, mongoose.FlatRecord<{
            clerkUserId: string;
            name: string;
            email: string;
            role: UserRole;
            status: UserStatus;
            medicalHistory: string[];
            allergies: string[];
            currentMedications: string[];
            preferredDoctors: mongoose.Types.ObjectId[];
            specialization: string[];
            education: mongoose.Types.DocumentArray<{
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }> & {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }>;
            availableDays: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[];
            rating: number;
            totalRatings: number;
            patientCount: number;
            permissions: ("user_management" | "system_config" | "data_export" | "analytics")[];
            managedUsers: mongoose.Types.ObjectId[];
            systemLogs: mongoose.Types.ObjectId[];
            appointments: mongoose.Types.ObjectId[];
            medicalRecords: mongoose.Types.ObjectId[];
            patients: mongoose.Types.ObjectId[];
            profileImage?: string;
            phoneNumber?: string;
            dateOfBirth?: NativeDate;
            gender?: Gender;
            address?: string;
            familyMedicalHistory?: string;
            pastMedicalHistory?: string;
            insuranceProvider?: string;
            insurancePolicyNumber?: string;
            emergencyContactName?: string;
            emergencyContactNumber?: string;
            notificationPreferences?: {
                push: boolean;
                email: boolean;
                sms: boolean;
            };
            licenseNumber?: string;
            yearsOfExperience?: number;
            practiceAddress?: string;
            practicePhone?: string;
            consultationFee?: number;
            availableHours?: {
                start?: string;
                end?: string;
            };
        }>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
            clerkUserId: string;
            name: string;
            email: string;
            role: UserRole;
            status: UserStatus;
            medicalHistory: string[];
            allergies: string[];
            currentMedications: string[];
            preferredDoctors: mongoose.Types.ObjectId[];
            specialization: string[];
            education: mongoose.Types.DocumentArray<{
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }> & {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }>;
            availableDays: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[];
            rating: number;
            totalRatings: number;
            patientCount: number;
            permissions: ("user_management" | "system_config" | "data_export" | "analytics")[];
            managedUsers: mongoose.Types.ObjectId[];
            systemLogs: mongoose.Types.ObjectId[];
            appointments: mongoose.Types.ObjectId[];
            medicalRecords: mongoose.Types.ObjectId[];
            patients: mongoose.Types.ObjectId[];
            profileImage?: string;
            phoneNumber?: string;
            dateOfBirth?: NativeDate;
            gender?: Gender;
            address?: string;
            familyMedicalHistory?: string;
            pastMedicalHistory?: string;
            insuranceProvider?: string;
            insurancePolicyNumber?: string;
            emergencyContactName?: string;
            emergencyContactNumber?: string;
            notificationPreferences?: {
                push: boolean;
                email: boolean;
                sms: boolean;
            };
            licenseNumber?: string;
            yearsOfExperience?: number;
            practiceAddress?: string;
            practicePhone?: string;
            consultationFee?: number;
            availableHours?: {
                start?: string;
                end?: string;
            };
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }, ret: mongoose.FlatRecord<{
            clerkUserId: string;
            name: string;
            email: string;
            role: UserRole;
            status: UserStatus;
            medicalHistory: string[];
            allergies: string[];
            currentMedications: string[];
            preferredDoctors: mongoose.Types.ObjectId[];
            specialization: string[];
            education: mongoose.Types.DocumentArray<{
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }> & {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }>;
            availableDays: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[];
            rating: number;
            totalRatings: number;
            patientCount: number;
            permissions: ("user_management" | "system_config" | "data_export" | "analytics")[];
            managedUsers: mongoose.Types.ObjectId[];
            systemLogs: mongoose.Types.ObjectId[];
            appointments: mongoose.Types.ObjectId[];
            medicalRecords: mongoose.Types.ObjectId[];
            patients: mongoose.Types.ObjectId[];
            profileImage?: string;
            phoneNumber?: string;
            dateOfBirth?: NativeDate;
            gender?: Gender;
            address?: string;
            familyMedicalHistory?: string;
            pastMedicalHistory?: string;
            insuranceProvider?: string;
            insurancePolicyNumber?: string;
            emergencyContactName?: string;
            emergencyContactNumber?: string;
            notificationPreferences?: {
                push: boolean;
                email: boolean;
                sms: boolean;
            };
            licenseNumber?: string;
            yearsOfExperience?: number;
            practiceAddress?: string;
            practicePhone?: string;
            consultationFee?: number;
            availableHours?: {
                start?: string;
                end?: string;
            };
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }) => mongoose.FlatRecord<{
            clerkUserId: string;
            name: string;
            email: string;
            role: UserRole;
            status: UserStatus;
            medicalHistory: string[];
            allergies: string[];
            currentMedications: string[];
            preferredDoctors: mongoose.Types.ObjectId[];
            specialization: string[];
            education: mongoose.Types.DocumentArray<{
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }> & {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }>;
            availableDays: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[];
            rating: number;
            totalRatings: number;
            patientCount: number;
            permissions: ("user_management" | "system_config" | "data_export" | "analytics")[];
            managedUsers: mongoose.Types.ObjectId[];
            systemLogs: mongoose.Types.ObjectId[];
            appointments: mongoose.Types.ObjectId[];
            medicalRecords: mongoose.Types.ObjectId[];
            patients: mongoose.Types.ObjectId[];
            profileImage?: string;
            phoneNumber?: string;
            dateOfBirth?: NativeDate;
            gender?: Gender;
            address?: string;
            familyMedicalHistory?: string;
            pastMedicalHistory?: string;
            insuranceProvider?: string;
            insurancePolicyNumber?: string;
            emergencyContactName?: string;
            emergencyContactNumber?: string;
            notificationPreferences?: {
                push: boolean;
                email: boolean;
                sms: boolean;
            };
            licenseNumber?: string;
            yearsOfExperience?: number;
            practiceAddress?: string;
            practicePhone?: string;
            consultationFee?: number;
            availableHours?: {
                start?: string;
                end?: string;
            };
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        };
    };
    toObject: {
        virtuals: true;
    };
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    medicalHistory: unknown[];
    allergies: unknown[];
    currentMedications: unknown[];
    preferredDoctors: mongoose.Types.ObjectId[];
    specialization: unknown[];
    education: mongoose.Types.DocumentArray<any, any> | unknown[] | mongoose.Types.DocumentArray<{
        [x: string]: unknown;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        [x: string]: unknown;
    }> & {
        [x: string]: unknown;
    }> | unknown[];
    availableDays: unknown[] | unknown[] | unknown[] | unknown[] | unknown[] | unknown[] | unknown[];
    permissions: unknown[] | unknown[] | unknown[] | unknown[];
    managedUsers: mongoose.Types.ObjectId[];
    systemLogs: mongoose.Types.ObjectId[];
    appointments: mongoose.Types.ObjectId[];
    medicalRecords: mongoose.Types.ObjectId[];
    patients: mongoose.Types.ObjectId[];
    clerkUserId?: unknown;
    name?: unknown;
    email?: unknown;
    role?: unknown;
    status?: unknown;
    profileImage?: unknown;
    phoneNumber?: unknown;
    dateOfBirth?: {
        toJSON?: {};
        [Symbol.toPrimitive]?: {};
        toString?: {};
        toLocaleString?: {};
        toDateString?: {};
        toTimeString?: {};
        toLocaleDateString?: {};
        toLocaleTimeString?: {};
        getTime?: {};
        getFullYear?: {};
        getUTCFullYear?: {};
        getMonth?: {};
        getUTCMonth?: {};
        getDate?: {};
        getUTCDate?: {};
        getDay?: {};
        getUTCDay?: {};
        getHours?: {};
        getUTCHours?: {};
        getMinutes?: {};
        getUTCMinutes?: {};
        getSeconds?: {};
        getUTCSeconds?: {};
        getMilliseconds?: {};
        getUTCMilliseconds?: {};
        getTimezoneOffset?: {};
        setTime?: {};
        setMilliseconds?: {};
        setUTCMilliseconds?: {};
        setSeconds?: {};
        setUTCSeconds?: {};
        setMinutes?: {};
        setUTCMinutes?: {};
        setHours?: {};
        setUTCHours?: {};
        setDate?: {};
        setUTCDate?: {};
        setMonth?: {};
        setUTCMonth?: {};
        setFullYear?: {};
        setUTCFullYear?: {};
        toUTCString?: {};
        toISOString?: {};
        valueOf?: {};
    };
    gender?: unknown;
    address?: unknown;
    familyMedicalHistory?: unknown;
    pastMedicalHistory?: unknown;
    insuranceProvider?: unknown;
    insurancePolicyNumber?: unknown;
    emergencyContactName?: unknown;
    emergencyContactNumber?: unknown;
    notificationPreferences?: {
        push?: unknown;
        email?: unknown;
        sms?: unknown;
    };
    licenseNumber?: unknown;
    yearsOfExperience?: unknown;
    practiceAddress?: unknown;
    practicePhone?: unknown;
    consultationFee?: unknown;
    availableHours?: {
        start?: unknown;
        end?: unknown;
    };
    rating?: unknown;
    totalRatings?: unknown;
    patientCount?: unknown;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
        transform: (doc: mongoose.Document<unknown, {}, mongoose.FlatRecord<{
            clerkUserId: string;
            name: string;
            email: string;
            role: UserRole;
            status: UserStatus;
            medicalHistory: string[];
            allergies: string[];
            currentMedications: string[];
            preferredDoctors: mongoose.Types.ObjectId[];
            specialization: string[];
            education: mongoose.Types.DocumentArray<{
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }> & {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }>;
            availableDays: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[];
            rating: number;
            totalRatings: number;
            patientCount: number;
            permissions: ("user_management" | "system_config" | "data_export" | "analytics")[];
            managedUsers: mongoose.Types.ObjectId[];
            systemLogs: mongoose.Types.ObjectId[];
            appointments: mongoose.Types.ObjectId[];
            medicalRecords: mongoose.Types.ObjectId[];
            patients: mongoose.Types.ObjectId[];
            profileImage?: string;
            phoneNumber?: string;
            dateOfBirth?: NativeDate;
            gender?: Gender;
            address?: string;
            familyMedicalHistory?: string;
            pastMedicalHistory?: string;
            insuranceProvider?: string;
            insurancePolicyNumber?: string;
            emergencyContactName?: string;
            emergencyContactNumber?: string;
            notificationPreferences?: {
                push: boolean;
                email: boolean;
                sms: boolean;
            };
            licenseNumber?: string;
            yearsOfExperience?: number;
            practiceAddress?: string;
            practicePhone?: string;
            consultationFee?: number;
            availableHours?: {
                start?: string;
                end?: string;
            };
        }>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
            clerkUserId: string;
            name: string;
            email: string;
            role: UserRole;
            status: UserStatus;
            medicalHistory: string[];
            allergies: string[];
            currentMedications: string[];
            preferredDoctors: mongoose.Types.ObjectId[];
            specialization: string[];
            education: mongoose.Types.DocumentArray<{
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }> & {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }>;
            availableDays: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[];
            rating: number;
            totalRatings: number;
            patientCount: number;
            permissions: ("user_management" | "system_config" | "data_export" | "analytics")[];
            managedUsers: mongoose.Types.ObjectId[];
            systemLogs: mongoose.Types.ObjectId[];
            appointments: mongoose.Types.ObjectId[];
            medicalRecords: mongoose.Types.ObjectId[];
            patients: mongoose.Types.ObjectId[];
            profileImage?: string;
            phoneNumber?: string;
            dateOfBirth?: NativeDate;
            gender?: Gender;
            address?: string;
            familyMedicalHistory?: string;
            pastMedicalHistory?: string;
            insuranceProvider?: string;
            insurancePolicyNumber?: string;
            emergencyContactName?: string;
            emergencyContactNumber?: string;
            notificationPreferences?: {
                push: boolean;
                email: boolean;
                sms: boolean;
            };
            licenseNumber?: string;
            yearsOfExperience?: number;
            practiceAddress?: string;
            practicePhone?: string;
            consultationFee?: number;
            availableHours?: {
                start?: string;
                end?: string;
            };
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }, ret: mongoose.FlatRecord<{
            clerkUserId: string;
            name: string;
            email: string;
            role: UserRole;
            status: UserStatus;
            medicalHistory: string[];
            allergies: string[];
            currentMedications: string[];
            preferredDoctors: mongoose.Types.ObjectId[];
            specialization: string[];
            education: mongoose.Types.DocumentArray<{
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }> & {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }>;
            availableDays: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[];
            rating: number;
            totalRatings: number;
            patientCount: number;
            permissions: ("user_management" | "system_config" | "data_export" | "analytics")[];
            managedUsers: mongoose.Types.ObjectId[];
            systemLogs: mongoose.Types.ObjectId[];
            appointments: mongoose.Types.ObjectId[];
            medicalRecords: mongoose.Types.ObjectId[];
            patients: mongoose.Types.ObjectId[];
            profileImage?: string;
            phoneNumber?: string;
            dateOfBirth?: NativeDate;
            gender?: Gender;
            address?: string;
            familyMedicalHistory?: string;
            pastMedicalHistory?: string;
            insuranceProvider?: string;
            insurancePolicyNumber?: string;
            emergencyContactName?: string;
            emergencyContactNumber?: string;
            notificationPreferences?: {
                push: boolean;
                email: boolean;
                sms: boolean;
            };
            licenseNumber?: string;
            yearsOfExperience?: number;
            practiceAddress?: string;
            practicePhone?: string;
            consultationFee?: number;
            availableHours?: {
                start?: string;
                end?: string;
            };
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }) => mongoose.FlatRecord<{
            clerkUserId: string;
            name: string;
            email: string;
            role: UserRole;
            status: UserStatus;
            medicalHistory: string[];
            allergies: string[];
            currentMedications: string[];
            preferredDoctors: mongoose.Types.ObjectId[];
            specialization: string[];
            education: mongoose.Types.DocumentArray<{
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }> & {
                degree?: string;
                institution?: string;
                graduationYear?: number;
            }>;
            availableDays: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[];
            rating: number;
            totalRatings: number;
            patientCount: number;
            permissions: ("user_management" | "system_config" | "data_export" | "analytics")[];
            managedUsers: mongoose.Types.ObjectId[];
            systemLogs: mongoose.Types.ObjectId[];
            appointments: mongoose.Types.ObjectId[];
            medicalRecords: mongoose.Types.ObjectId[];
            patients: mongoose.Types.ObjectId[];
            profileImage?: string;
            phoneNumber?: string;
            dateOfBirth?: NativeDate;
            gender?: Gender;
            address?: string;
            familyMedicalHistory?: string;
            pastMedicalHistory?: string;
            insuranceProvider?: string;
            insurancePolicyNumber?: string;
            emergencyContactName?: string;
            emergencyContactNumber?: string;
            notificationPreferences?: {
                push: boolean;
                email: boolean;
                sms: boolean;
            };
            licenseNumber?: string;
            yearsOfExperience?: number;
            practiceAddress?: string;
            practicePhone?: string;
            consultationFee?: number;
            availableHours?: {
                start?: string;
                end?: string;
            };
        }> & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        };
    };
    toObject: {
        virtuals: true;
    };
}, {
    clerkUserId: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    medicalHistory: string[];
    allergies: string[];
    currentMedications: string[];
    preferredDoctors: mongoose.Types.ObjectId[];
    specialization: string[];
    education: mongoose.Types.DocumentArray<{
        degree?: string;
        institution?: string;
        graduationYear?: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        degree?: string;
        institution?: string;
        graduationYear?: number;
    }> & {
        degree?: string;
        institution?: string;
        graduationYear?: number;
    }>;
    availableDays: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[];
    rating: number;
    totalRatings: number;
    patientCount: number;
    permissions: ("user_management" | "system_config" | "data_export" | "analytics")[];
    managedUsers: mongoose.Types.ObjectId[];
    systemLogs: mongoose.Types.ObjectId[];
    appointments: mongoose.Types.ObjectId[];
    medicalRecords: mongoose.Types.ObjectId[];
    patients: mongoose.Types.ObjectId[];
    profileImage?: string;
    phoneNumber?: string;
    dateOfBirth?: NativeDate;
    gender?: Gender;
    address?: string;
    familyMedicalHistory?: string;
    pastMedicalHistory?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    notificationPreferences?: {
        push: boolean;
        email: boolean;
        sms: boolean;
    };
    licenseNumber?: string;
    yearsOfExperience?: number;
    practiceAddress?: string;
    practicePhone?: string;
    consultationFee?: number;
    availableHours?: {
        start?: string;
        end?: string;
    };
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    clerkUserId: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    medicalHistory: string[];
    allergies: string[];
    currentMedications: string[];
    preferredDoctors: mongoose.Types.ObjectId[];
    specialization: string[];
    education: mongoose.Types.DocumentArray<{
        degree?: string;
        institution?: string;
        graduationYear?: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        degree?: string;
        institution?: string;
        graduationYear?: number;
    }> & {
        degree?: string;
        institution?: string;
        graduationYear?: number;
    }>;
    availableDays: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[];
    rating: number;
    totalRatings: number;
    patientCount: number;
    permissions: ("user_management" | "system_config" | "data_export" | "analytics")[];
    managedUsers: mongoose.Types.ObjectId[];
    systemLogs: mongoose.Types.ObjectId[];
    appointments: mongoose.Types.ObjectId[];
    medicalRecords: mongoose.Types.ObjectId[];
    patients: mongoose.Types.ObjectId[];
    profileImage?: string;
    phoneNumber?: string;
    dateOfBirth?: NativeDate;
    gender?: Gender;
    address?: string;
    familyMedicalHistory?: string;
    pastMedicalHistory?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    notificationPreferences?: {
        push: boolean;
        email: boolean;
        sms: boolean;
    };
    licenseNumber?: string;
    yearsOfExperience?: number;
    practiceAddress?: string;
    practicePhone?: string;
    consultationFee?: number;
    availableHours?: {
        start?: string;
        end?: string;
    };
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    clerkUserId: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    medicalHistory: string[];
    allergies: string[];
    currentMedications: string[];
    preferredDoctors: mongoose.Types.ObjectId[];
    specialization: string[];
    education: mongoose.Types.DocumentArray<{
        degree?: string;
        institution?: string;
        graduationYear?: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        degree?: string;
        institution?: string;
        graduationYear?: number;
    }> & {
        degree?: string;
        institution?: string;
        graduationYear?: number;
    }>;
    availableDays: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[];
    rating: number;
    totalRatings: number;
    patientCount: number;
    permissions: ("user_management" | "system_config" | "data_export" | "analytics")[];
    managedUsers: mongoose.Types.ObjectId[];
    systemLogs: mongoose.Types.ObjectId[];
    appointments: mongoose.Types.ObjectId[];
    medicalRecords: mongoose.Types.ObjectId[];
    patients: mongoose.Types.ObjectId[];
    profileImage?: string;
    phoneNumber?: string;
    dateOfBirth?: NativeDate;
    gender?: Gender;
    address?: string;
    familyMedicalHistory?: string;
    pastMedicalHistory?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    notificationPreferences?: {
        push: boolean;
        email: boolean;
        sms: boolean;
    };
    licenseNumber?: string;
    yearsOfExperience?: number;
    practiceAddress?: string;
    practicePhone?: string;
    consultationFee?: number;
    availableHours?: {
        start?: string;
        end?: string;
    };
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export { User };
//# sourceMappingURL=User.model.d.ts.map
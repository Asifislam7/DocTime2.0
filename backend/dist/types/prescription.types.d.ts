export declare enum DocumentType {
    PRESCRIPTION = "prescription",
    LAB_REPORT = "lab_report",
    X_RAY = "x_ray",
    MRI = "mri",
    CT_SCAN = "ct_scan",
    ULTRASOUND = "ultrasound",
    MEDICAL_CERTIFICATE = "medical_certificate",
    DISCHARGE_SUMMARY = "discharge_summary",
    OTHER = "other"
}
export declare enum DocumentStatus {
    PENDING = "pending",
    PROCESSED = "processed",
    FAILED = "failed"
}
export interface IPrescription {
    _id?: string;
    userId: string;
    clerkUserId: string;
    title: string;
    description?: string;
    documentType: DocumentType;
    fileName: string;
    originalFileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    status: DocumentStatus;
    extractedText?: string;
    metadata?: {
        doctorName?: string;
        dateIssued?: Date;
        medicationNames?: string[];
        dosage?: string[];
        instructions?: string[];
        [key: string]: any;
    };
    tags?: string[];
    isPublic: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface CreatePrescriptionRequest {
    title: string;
    description?: string;
    documentType: DocumentType;
    tags?: string[];
    isPublic?: boolean;
}
export interface UpdatePrescriptionRequest {
    title?: string;
    description?: string;
    documentType?: DocumentType;
    tags?: string[];
    isPublic?: boolean;
}
export interface PrescriptionQuery {
    userId?: string;
    documentType?: DocumentType;
    status?: DocumentStatus;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
//# sourceMappingURL=prescription.types.d.ts.map
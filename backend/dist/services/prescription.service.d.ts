import { IPrescription, CreatePrescriptionRequest, UpdatePrescriptionRequest, PrescriptionQuery, DocumentType, DocumentStatus } from '../types/prescription.types';
export declare class PrescriptionService {
    static createPrescription(clerkUserId: string, prescriptionData: CreatePrescriptionRequest, fileInfo: {
        fileName: string;
        originalFileName: string;
        filePath: string;
        fileSize: number;
        mimeType: string;
    }): Promise<IPrescription>;
    static getPrescriptionsByUser(clerkUserId: string, query?: PrescriptionQuery): Promise<{
        prescriptions: IPrescription[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    static getPrescriptionById(prescriptionId: string, clerkUserId: string): Promise<IPrescription | null>;
    static updatePrescription(prescriptionId: string, clerkUserId: string, updateData: UpdatePrescriptionRequest): Promise<IPrescription | null>;
    static deletePrescription(prescriptionId: string, clerkUserId: string): Promise<boolean>;
    static updatePrescriptionStatus(prescriptionId: string, status: DocumentStatus, extractedText?: string, metadata?: any): Promise<IPrescription | null>;
    static getPrescriptionTextContent(prescriptionId: string, clerkUserId: string): Promise<string | null>;
    static getFilePathForDownload(prescriptionId: string, clerkUserId: string): Promise<{
        filePath: string;
        fileName: string;
        mimeType: string;
    } | null>;
    static getPrescriptionStats(clerkUserId: string): Promise<{
        total: number;
        byType: Record<DocumentType, number>;
        byStatus: Record<DocumentStatus, number>;
        totalSize: number;
    }>;
}
//# sourceMappingURL=prescription.service.d.ts.map
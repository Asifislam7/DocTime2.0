import { Request, Response } from 'express';
import multer from 'multer';
export declare const upload: multer.Multer;
export declare class PrescriptionController {
    static uploadPrescription(req: Request, res: Response): Promise<void>;
    static getPrescriptions(req: Request, res: Response): Promise<void>;
    static getPrescription(req: Request, res: Response): Promise<void>;
    static updatePrescription(req: Request, res: Response): Promise<void>;
    static deletePrescription(req: Request, res: Response): Promise<void>;
    static downloadPrescription(req: Request, res: Response): Promise<void>;
    static getPrescriptionStats(req: Request, res: Response): Promise<void>;
    static getPrescriptionSummary(req: Request, res: Response): Promise<void>;
    static updatePrescriptionStatus(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=prescription.controller.d.ts.map
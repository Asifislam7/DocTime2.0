import { Request, Response } from 'express';
export declare class AppointmentController {
    /**
     * Get appointments by patient email
     */
    static getAppointmentsByEmail(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get appointments by patient ID
     */
    static getAppointmentsByPatientId(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Create a new appointment with comprehensive data
     */
    static createAppointment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Create appointment from comprehensive form data
     */
    static createAppointmentFromForm(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update appointment status
     */
    static updateAppointmentStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete appointment
     */
    static deleteAppointment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Reschedule appointment
     */
    static rescheduleAppointment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Cancel appointment
     */
    static cancelAppointment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=appointment.controller.d.ts.map
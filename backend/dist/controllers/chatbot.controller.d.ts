import { Request, Response, NextFunction } from 'express';
export declare class ChatbotController {
    /**
     * Generate AI response using OpenAI
     * POST /api/v1/chatbot/generate
     */
    static generateResponse(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=chatbot.controller.d.ts.map
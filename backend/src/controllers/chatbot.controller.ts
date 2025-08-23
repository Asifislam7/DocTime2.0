import { Request, Response, NextFunction } from 'express';
import { ChatbotService } from '../services/chatbot.service';

export class ChatbotController {
  
  /**
   * Generate AI response using OpenAI
   * POST /api/v1/chatbot/generate
   */
  static async generateResponse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { message, userData, appointments } = req.body;
      
      if (!message) {
        res.status(400).json({
          success: false,
          message: 'Message is required'
        });
        return;
      }

      const response = await ChatbotService.generateAIResponse(message, userData, appointments);
      
      res.status(200).json({
        success: true,
        data: {
          response: response
        },
        message: 'AI response generated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotController = void 0;
const chatbot_service_1 = require("../services/chatbot.service");
class ChatbotController {
    /**
     * Generate AI response using OpenAI
     * POST /api/v1/chatbot/generate
     */
    static async generateResponse(req, res, next) {
        try {
            const { message, userData, appointments } = req.body;
            if (!message) {
                res.status(400).json({
                    success: false,
                    message: 'Message is required'
                });
                return;
            }
            const response = await chatbot_service_1.ChatbotService.generateAIResponse(message, userData, appointments);
            res.status(200).json({
                success: true,
                data: {
                    response: response
                },
                message: 'AI response generated successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ChatbotController = ChatbotController;
//# sourceMappingURL=chatbot.controller.js.map
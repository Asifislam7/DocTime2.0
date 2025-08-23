import express from 'express';
import { ChatbotController } from '../controllers/chatbot.controller';

const router = express.Router();

// Generate AI response
router.post('/generate', ChatbotController.generateResponse);

export default router;

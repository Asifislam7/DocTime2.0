export declare class ChatbotService {
    private static openai;
    /**
     * Initialize OpenAI client
     */
    private static initializeOpenAI;
    /**
     * Generate AI response using OpenAI
     */
    static generateAIResponse(userInput: string, userData: any, appointments: any[]): Promise<string>;
    /**
     * Create context-aware prompt
     */
    private static createPrompt;
    /**
     * Generate fallback response when OpenAI is unavailable
     */
    private static generateFallbackResponse;
    /**
     * Summarize document text (e.g. prescription) in 4-5 brief lines using OpenAI
     */
    static summarizeDocument(documentText: string): Promise<string>;
}
//# sourceMappingURL=chatbot.service.d.ts.map
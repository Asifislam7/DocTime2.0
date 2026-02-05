import OpenAI from 'openai';

export class ChatbotService {
  private static openai: OpenAI;

  /**
   * Initialize OpenAI client
   */
  private static initializeOpenAI(): OpenAI {
    if (!this.openai) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }
      
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
    }
    return this.openai;
  }

  /**
   * Generate AI response using OpenAI
   */
  static async generateAIResponse(
    userInput: string, 
    userData: any, 
    appointments: any[]
  ): Promise<string> {
    try {
      const openai = this.initializeOpenAI();
      
      const prompt = this.createPrompt(userInput, userData, appointments);
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are DocTime Assistant, an AI healthcare companion for the DocTime platform. 
            
IMPORTANT RULES:
1. NEVER provide medical advice, treatment recommendations, or remedies
2. Only share general information that's publicly available
3. For medical questions, always recommend consulting a healthcare professional
4. Focus on DocTime services, appointment management, and general healthcare information
5. Be helpful, friendly, and professional
6. Keep responses concise but informative
7. If asked about medical treatments, symptoms, or specific health advice, redirect to healthcare professionals

Your role is to help users with:
- DocTime platform information and services
- Appointment management and scheduling
- General healthcare information (not medical advice)
- User's personal appointment and medical history data
- Platform navigation and features`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response generated from OpenAI');
      }

      return response;
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      // Return fallback response
      return this.generateFallbackResponse(userInput);
    }
  }

  /**
   * Create context-aware prompt
   */
  private static createPrompt(userInput: string, userData: any, appointments: any[]): string {
    const context = `
You are DocTime Assistant, an AI healthcare companion for the DocTime platform. 

DOC TIME INFORMATION:
- DocTime is a healthcare appointment scheduling platform
- Our mission is to democratize healthcare access through innovative appointment scheduling
- We connect patients with healthcare providers seamlessly
- Available 24/7 for appointment management

USER CONTEXT:
${userData ? `
User: ${userData.name}
Email: ${userData.email}
Medical History: ${userData.medicalHistory?.join(', ') || 'None recorded'}
Allergies: ${userData.allergies?.join(', ') || 'None recorded'}
Current Medications: ${userData.currentMedications?.join(', ') || 'None'}
Insurance: ${userData.insuranceProvider || 'Not specified'}
` : 'User not logged in'}

APPOINTMENTS:
${appointments.length > 0 ? appointments.map(apt => 
  `- ${apt.doctorName} on ${new Date(apt.appointmentDate).toLocaleDateString()} at ${apt.appointmentTime} (${apt.status}) - ${apt.reason}`
).join('\n') : 'No appointments found'}

IMPORTANT RULES:
1. NEVER provide medical advice, treatment recommendations, or remedies
2. Only share general information that's publicly available
3. For medical questions, always recommend consulting a healthcare professional
4. Focus on DocTime services, appointment management, and general healthcare information
5. Be helpful, friendly, and professional

User Question: ${userInput}

Please provide a helpful response following the rules above.`;

    return context;
  }

  /**
   * Generate fallback response when OpenAI is unavailable
   */
  private static generateFallbackResponse(userInput: string): string {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('appointment') || lowerInput.includes('schedule')) {
      return "I can help you with appointment scheduling! You can book appointments through our platform, and I can show you your current appointments. For booking new ones, visit the appointment page.";
    }
    
    if (lowerInput.includes('doctor') || lowerInput.includes('physician')) {
      return "We have a network of qualified healthcare providers across various specialties. I can show you your current appointments, but for specific doctor availability, please visit our appointment booking page.";
    }
    
    if (lowerInput.includes('medical') || lowerInput.includes('health')) {
      return "I can help you manage your healthcare appointments and show you your medical history stored in our system. However, for specific medical questions, please consult with a healthcare professional.";
    }
    
    if (lowerInput.includes('test') || lowerInput.includes('lab')) {
      return "I can help you understand general information about healthcare tests and procedures, but for specific medical advice about tests, please consult with your healthcare provider.";
    }
    
    return "I'm here to help you with DocTime services, your appointments, and general healthcare information. How can I assist you today?";
  }

  /**
   * Summarize document text (e.g. prescription) in 4-5 brief lines using OpenAI
   */
  static async summarizeDocument(documentText: string): Promise<string> {
    try {
      const openai = this.initializeOpenAI();

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a medical document summarizer. Given the text of a prescription or medical document, provide a brief, clear summary in 4-5 short lines. Focus on: document type, key medications or findings (if any), instructions or notes, and date/doctor if mentioned. Use plain language. Do not give medical advice—only summarize what the document says. Output only the summary, no headings or labels.`
          },
          {
            role: 'user',
            content: documentText
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      });

      const summary = completion.choices[0]?.message?.content?.trim();
      if (!summary) {
        throw new Error('No summary generated');
      }
      return summary;
    } catch (error) {
      console.error('OpenAI summarization error:', error);
      throw error;
    }
  }
}

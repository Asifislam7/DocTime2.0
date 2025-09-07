"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Calendar,
  Clock,
  User as UserIcon,
  FileText,
  Heart,
  Shield,
  Zap
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface UserData {
  name: string;
  email: string;
  medicalHistory?: string[];
  allergies?: string[];
  currentMedications?: string[];
  insuranceProvider?: string;
}

interface AppointmentData {
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  reason: string;
}

export default function Chatbot() {
  const { user, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        content: `Hello! I'm DocTime Assistant, your AI healthcare companion. I can help you with:

• Information about DocTime services
• Your appointment details and medical history
• General healthcare information
• Available doctors and specialties

How can I assist you today?`,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch user data and appointments when chatbot opens
  useEffect(() => {
    if (isOpen && isLoaded && user) {
      fetchUserData();
      fetchAppointments();
    }
  }, [isOpen, isLoaded, user]);

  const fetchUserData = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      const response = await fetch(`http://localhost:3001/api/v1/users/email/${encodeURIComponent(email)}`);
      if (response.ok) {
        const userData = await response.json();
        setUserData(userData.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      const response = await fetch(`http://localhost:3001/api/v1/appointments/email/${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await generateAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<string> => {
    const prompt = createPrompt(userInput);
    
    try {
      const response = await fetch('http://localhost:3001/api/v1/chatbot/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          userData,
          appointments
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      return data.data.response;
    } catch (error) {
      // Fallback responses for common queries
      return generateFallbackResponse(userInput);
    }
  };

  const createPrompt = (userInput: string): string => {
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
  };

  const generateFallbackResponse = (userInput: string): string => {
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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#06A3DA] hover:bg-[#057bb5] text-white shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50 p-4">
          <Card className="w-full max-w-md h-[600px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-[#06A3DA] text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <h3 className="font-semibold">DocTime Assistant</h3>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <CardContent className="p-0 h-[480px] overflow-y-auto">
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-[#06A3DA] rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-[#06A3DA] text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-[#06A3DA] rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#06A3DA]" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about DocTime..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-[#06A3DA] hover:bg-[#057bb5] text-white"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

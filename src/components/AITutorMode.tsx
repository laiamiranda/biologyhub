import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Brain, Lightbulb, BookOpen, Target, Zap, X } from 'lucide-react';
import { aiTutor, TutorMessage, TutorContext } from '../lib/aiTutor';
import { NavigationProps } from '../types/navigation';

interface AITutorModeProps extends NavigationProps {
  lessonContent: string;
  lessonTitle: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  onClose?: () => void;
}

export default function AITutorMode({
  onNavigate,
  lessonContent,
  lessonTitle,
  topic,
  difficulty,
  onClose
}: AITutorModeProps) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeTutor();
  }, [lessonContent, lessonTitle, topic, difficulty]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeTutor = async () => {
    const context: TutorContext = {
      lessonContent,
      lessonTitle,
      topic,
      difficulty,
      userLevel: difficulty,
      previousQuestions: [],
      currentFocus: [topic]
    };

    aiTutor.setContext(context);
    setIsInitialized(true);

    // Generate initial welcome message and suggestions
    const welcomeMessage: TutorMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI biology tutor for "${lessonTitle}". I'm here to help you understand ${topic} and answer any questions you have about this lesson. What would you like to know?`,
      timestamp: new Date().toISOString(),
      context: {
        topic,
        difficulty
      }
    };

    setMessages([welcomeMessage]);
    setSuggestedQuestions([
      `What is the main concept of ${topic}?`,
      `Can you explain ${topic} with an example?`,
      `How does ${topic} relate to other biology topics?`,
      `What are the key points I should remember about ${topic}?`,
      `Can you help me understand the difficult parts of ${topic}?`
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading || !isInitialized) return;

    const userMessage: TutorMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
      context: {
        topic,
        difficulty
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await aiTutor.askQuestion(messageText);
      
      const assistantMessage: TutorMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        context: {
          topic,
          difficulty: response.difficulty
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update suggested questions based on response
      if (response.followUpQuestions.length > 0) {
        setSuggestedQuestions(response.followUpQuestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Failed to get tutor response:', error);
      
      const errorMessage: TutorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble processing your question right now. Please try rephrasing it or ask about a specific aspect of the lesson.",
        timestamp: new Date().toISOString(),
        context: {
          topic,
          difficulty
        }
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const clearConversation = () => {
    aiTutor.clearConversation();
    setMessages([]);
    setShowSuggestions(true);
    initializeTutor();
  };

  const formatMessage = (message: TutorMessage) => {
    return message.content.split('\n').map((line, index) => (
      <p key={index} className={index === 0 ? '' : 'mt-2'}>
        {line}
      </p>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="w-8 h-8 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold">AI Biology Tutor</h1>
                  <p className="text-teal-100">{lessonTitle} - {topic}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearConversation}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Clear conversation"
                >
                  <X className="w-4 h-4" />
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start">
                    {message.role === 'assistant' && (
                      <Brain className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                    )}
                    <div className="text-sm">
                      {formatMessage(message)}
                    </div>
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-teal-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg max-w-xs">
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {showSuggestions && suggestedQuestions.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="flex items-center mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Suggested Questions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 bg-white text-gray-700 text-xs rounded-full border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-6 border-t">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about this lesson..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Tutor Features */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold text-gray-800">Lesson Context</span>
            </div>
            <p className="text-sm text-gray-600">I understand the full lesson content and can answer questions about any part of it.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-semibold text-gray-800">Personalized Help</span>
            </div>
            <p className="text-sm text-gray-600">I adapt my explanations to your level and provide examples that make sense to you.</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-semibold text-gray-800">AI-Powered</span>
            </div>
            <p className="text-sm text-gray-600">Powered by advanced AI to provide accurate, helpful explanations and guidance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

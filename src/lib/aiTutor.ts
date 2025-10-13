import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-api-key-here',
  dangerouslyAllowBrowser: true,
});

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: {
    lessonId?: string;
    topic?: string;
    difficulty?: string;
  };
}

export interface TutorContext {
  lessonContent: string;
  lessonTitle: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  previousQuestions: string[];
  currentFocus: string[];
}

export interface TutorResponse {
  message: string;
  suggestions: string[];
  relatedTopics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  confidence: number;
  followUpQuestions: string[];
}

class AITutor {
  private conversationHistory: TutorMessage[] = [];
  private context: TutorContext | null = null;

  setContext(context: TutorContext): void {
    this.context = context;
    this.conversationHistory = [];
  }

  async askQuestion(question: string, lessonId?: string): Promise<TutorResponse> {
    if (!this.context) {
      throw new Error('Tutor context not set. Please set context before asking questions.');
    }

    const userMessage: TutorMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
      context: {
        lessonId,
        topic: this.context.topic,
        difficulty: this.context.difficulty,
      },
    };

    this.conversationHistory.push(userMessage);

    try {
      const response = await this.generateTutorResponse(question);
      
      const assistantMessage: TutorMessage = {
        id: `msg-${Date.now()}-response`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        context: {
          lessonId,
          topic: this.context.topic,
          difficulty: response.difficulty,
        },
      };

      this.conversationHistory.push(assistantMessage);
      
      return response;
    } catch (error) {
      console.error('Failed to generate tutor response:', error);
      return this.getFallbackResponse(question);
    }
  }

  private async generateTutorResponse(question: string): Promise<TutorResponse> {
    const systemPrompt = `You are an expert biology tutor with deep knowledge of ${this.context!.topic}. 
Your role is to help students understand complex biological concepts through clear explanations, examples, and guided learning.

Student Level: ${this.context!.userLevel}
Lesson Topic: ${this.context!.topic}
Lesson Difficulty: ${this.context!.difficulty}

Guidelines:
1. Provide clear, accurate explanations appropriate for the student's level
2. Use analogies and examples to make concepts easier to understand
3. Ask follow-up questions to check understanding
4. Suggest related topics for deeper learning
5. Be encouraging and supportive
6. If you don't know something, say so and suggest where to find the information
7. Break down complex topics into smaller, manageable parts
8. Use visual descriptions when helpful

Current Lesson Content:
${this.context!.lessonContent}

Previous Questions in this session:
${this.context!.previousQuestions.join('\n')}

Respond in a helpful, educational tone. Format your response as JSON with this structure:
{
  "message": "Your main response to the student",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "relatedTopics": ["Related topic 1", "Related topic 2"],
  "difficulty": "beginner|intermediate|advanced",
  "confidence": 0.95,
  "followUpQuestions": ["Question 1", "Question 2"]
}`;

    const userPrompt = `Student Question: "${question}"

Please provide a helpful response that:
1. Directly answers their question
2. Explains the concept clearly for their level
3. Provides examples or analogies if helpful
4. Suggests next steps for learning
5. Asks follow-up questions to check understanding`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response generated');
    }

    try {
      const parsedResponse = JSON.parse(content);
      return {
        message: parsedResponse.message,
        suggestions: parsedResponse.suggestions || [],
        relatedTopics: parsedResponse.relatedTopics || [],
        difficulty: parsedResponse.difficulty || this.context!.userLevel,
        confidence: parsedResponse.confidence || 0.8,
        followUpQuestions: parsedResponse.followUpQuestions || [],
      };
    } catch (parseError) {
      console.error('Failed to parse tutor response:', parseError);
      return this.getFallbackResponse(question);
    }
  }

  private getFallbackResponse(question: string): TutorResponse {
    return {
      message: `I understand you're asking about "${question}". While I'm having trouble processing your question right now, I'd be happy to help you understand this topic. Could you rephrase your question or ask about a specific aspect of ${this.context?.topic || 'biology'}?`,
      suggestions: [
        'Try rephrasing your question',
        'Ask about a specific concept',
        'Request an example or analogy',
        'Ask for a step-by-step explanation'
      ],
      relatedTopics: this.context?.currentFocus || [],
      difficulty: this.context?.userLevel || 'beginner',
      confidence: 0.5,
      followUpQuestions: [
        'Can you explain this in simpler terms?',
        'What is an example of this concept?',
        'How does this relate to what we learned earlier?'
      ],
    };
  }

  async generateStudyPlan(topic: string, userLevel: string, timeAvailable: number): Promise<{
    plan: Array<{
      step: number;
      title: string;
      description: string;
      estimatedTime: number;
      difficulty: string;
      resources: string[];
    }>;
    totalTime: number;
    prerequisites: string[];
    goals: string[];
  }> {
    try {
      const prompt = `Create a personalized study plan for learning "${topic}" in biology.

Student Level: ${userLevel}
Time Available: ${timeAvailable} minutes
Topic: ${topic}

Create a step-by-step study plan that:
1. Builds knowledge progressively
2. Fits within the time constraint
3. Includes practical exercises
4. Has clear learning objectives
5. Suggests specific resources

Format as JSON:
{
  "plan": [
    {
      "step": 1,
      "title": "Step title",
      "description": "What to do",
      "estimatedTime": 15,
      "difficulty": "beginner|intermediate|advanced",
      "resources": ["Resource 1", "Resource 2"]
    }
  ],
  "totalTime": 60,
  "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
  "goals": ["Goal 1", "Goal 2"]
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 2000,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content generated');

      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to generate study plan:', error);
      return this.getFallbackStudyPlan(topic, userLevel, timeAvailable);
    }
  }

  private getFallbackStudyPlan(topic: string, userLevel: string, timeAvailable: number): any {
    return {
      plan: [
        {
          step: 1,
          title: `Introduction to ${topic}`,
          description: `Learn the basic concepts of ${topic}`,
          estimatedTime: Math.min(20, timeAvailable / 3),
          difficulty: userLevel,
          resources: ['Lesson content', 'Textbook chapter', 'Video explanation']
        },
        {
          step: 2,
          title: `Practice with ${topic}`,
          description: `Apply your knowledge through exercises`,
          estimatedTime: Math.min(20, timeAvailable / 3),
          difficulty: userLevel,
          resources: ['Practice questions', 'Interactive exercises', 'Quiz']
        },
        {
          step: 3,
          title: `Review and Master ${topic}`,
          description: `Consolidate your understanding`,
          estimatedTime: Math.min(20, timeAvailable / 3),
          difficulty: userLevel,
          resources: ['Summary notes', 'Final quiz', 'Discussion']
        }
      ],
      totalTime: timeAvailable,
      prerequisites: ['Basic biology knowledge'],
      goals: [`Understand ${topic}`, `Apply ${topic} concepts`, `Master ${topic} fundamentals`]
    };
  }

  async explainConcept(concept: string, context?: string): Promise<{
    explanation: string;
    examples: string[];
    analogies: string[];
    commonMisconceptions: string[];
    keyPoints: string[];
  }> {
    try {
      const prompt = `Explain the biology concept "${concept}" in detail.

${context ? `Context: ${context}` : ''}

Provide:
1. A clear, comprehensive explanation
2. 2-3 real-world examples
3. 1-2 helpful analogies
4. Common misconceptions students have
5. Key points to remember

Format as JSON:
{
  "explanation": "Detailed explanation",
  "examples": ["Example 1", "Example 2"],
  "analogies": ["Analogy 1", "Analogy 2"],
  "commonMisconceptions": ["Misconception 1", "Misconception 2"],
  "keyPoints": ["Point 1", "Point 2", "Point 3"]
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content generated');

      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to explain concept:', error);
      return {
        explanation: `The concept of "${concept}" is an important topic in biology. While I'm having trouble providing a detailed explanation right now, I'd recommend reviewing your lesson materials and asking specific questions about what you'd like to understand better.`,
        examples: ['Check your textbook for examples', 'Look for real-world applications'],
        analogies: ['Think of it like a biological process you already understand'],
        commonMisconceptions: ['Students often confuse this with similar concepts'],
        keyPoints: ['Focus on the main principles', 'Understand the underlying mechanisms']
      };
    }
  }

  getConversationHistory(): TutorMessage[] {
    return [...this.conversationHistory];
  }

  clearConversation(): void {
    this.conversationHistory = [];
  }

  getContext(): TutorContext | null {
    return this.context;
  }
}

export const aiTutor = new AITutor();

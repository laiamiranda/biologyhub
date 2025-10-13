import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-api-key-here',
  dangerouslyAllowBrowser: true,
});

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  reasoning: string;
}

export interface QuizGenerationRequest {
  lessonContent: string;
  lessonTitle: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  questionTypes?: ('multiple_choice' | 'true_false' | 'fill_blank')[];
}

export interface GeneratedQuiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  totalQuestions: number;
  estimatedTime: number; // in minutes
  difficulty: string;
  topic: string;
  generatedAt: string;
}

class AIQuizGenerator {
  private cache = new Map<string, GeneratedQuiz>();

  async generateQuiz(request: QuizGenerationRequest): Promise<GeneratedQuiz> {
    const cacheKey = this.generateCacheKey(request);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const quiz = await this.generateQuizWithGPT(request);
      this.cache.set(cacheKey, quiz);
      return quiz;
    } catch (error) {
      console.error('Failed to generate quiz with AI:', error);
      return this.generateFallbackQuiz(request);
    }
  }

  private generateCacheKey(request: QuizGenerationRequest): string {
    return `${request.lessonTitle}-${request.topic}-${request.difficulty}-${request.questionCount}`;
  }

  private async generateQuizWithGPT(request: QuizGenerationRequest): Promise<GeneratedQuiz> {
    const systemPrompt = `You are an expert biology educator creating quiz questions. Generate high-quality, educational quiz questions based on the provided lesson content.

Requirements:
- Create ${request.questionCount} questions
- Difficulty level: ${request.difficulty}
- Topic: ${request.topic}
- Mix of question types: multiple choice, true/false, and fill-in-the-blank
- Each question should test understanding, not just memorization
- Include clear explanations for each answer
- Ensure questions are accurate and educational

Format your response as a JSON object with the following structure:
{
  "title": "Quiz title based on the lesson",
  "description": "Brief description of what this quiz covers",
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct",
      "difficulty": "easy|medium|hard",
      "topic": "Specific topic within the lesson",
      "reasoning": "What this question tests"
    }
  ],
  "totalQuestions": ${request.questionCount},
  "estimatedTime": 15,
  "difficulty": "${request.difficulty}",
  "topic": "${request.topic}"
}`;

    const userPrompt = `Lesson Title: ${request.lessonTitle}
Topic: ${request.topic}
Difficulty: ${request.difficulty}

Lesson Content:
${request.lessonContent}

Please generate ${request.questionCount} quiz questions based on this content.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content generated');
    }

    try {
      const parsedQuiz = JSON.parse(content);
      return this.formatGeneratedQuiz(parsedQuiz, request);
    } catch (parseError) {
      console.error('Failed to parse GPT response:', parseError);
      throw new Error('Invalid response format from AI');
    }
  }

  private formatGeneratedQuiz(parsedQuiz: any, request: QuizGenerationRequest): GeneratedQuiz {
    const questions: QuizQuestion[] = parsedQuiz.questions.map((q: any, index: number) => ({
      id: `q-${Date.now()}-${index}`,
      question: q.question,
      options: q.options || [],
      correctAnswer: q.correctAnswer || 0,
      explanation: q.explanation || 'No explanation provided',
      difficulty: q.difficulty || request.difficulty,
      topic: q.topic || request.topic,
      reasoning: q.reasoning || 'Tests understanding of key concepts',
    }));

    return {
      id: `quiz-${Date.now()}`,
      title: parsedQuiz.title || `Quiz: ${request.lessonTitle}`,
      description: parsedQuiz.description || `Test your knowledge of ${request.topic}`,
      questions,
      totalQuestions: questions.length,
      estimatedTime: parsedQuiz.estimatedTime || 15,
      difficulty: parsedQuiz.difficulty || request.difficulty,
      topic: parsedQuiz.topic || request.topic,
      generatedAt: new Date().toISOString(),
    };
  }

  private generateFallbackQuiz(request: QuizGenerationRequest): GeneratedQuiz {
    // Generate basic quiz questions as fallback
    const questions: QuizQuestion[] = Array.from({ length: request.questionCount }, (_, index) => ({
      id: `fallback-q-${index}`,
      question: `What is the main concept discussed in ${request.lessonTitle}?`,
      options: [
        'Option A: Basic concept',
        'Option B: Advanced concept', 
        'Option C: Intermediate concept',
        'Option D: Complex concept'
      ],
      correctAnswer: 0,
      explanation: 'This question tests your understanding of the main concepts covered in this lesson.',
      difficulty: request.difficulty,
      topic: request.topic,
      reasoning: 'Tests comprehension of key learning objectives',
    }));

    return {
      id: `fallback-quiz-${Date.now()}`,
      title: `Quiz: ${request.lessonTitle}`,
      description: `Test your knowledge of ${request.topic}`,
      questions,
      totalQuestions: questions.length,
      estimatedTime: 10,
      difficulty: request.difficulty,
      topic: request.topic,
      generatedAt: new Date().toISOString(),
    };
  }

  async generateQuestionVariations(originalQuestion: QuizQuestion): Promise<QuizQuestion[]> {
    try {
      const prompt = `Generate 3 variations of this biology quiz question with different difficulty levels:

Original Question: ${originalQuestion.question}
Options: ${originalQuestion.options.join(', ')}
Correct Answer: ${originalQuestion.options[originalQuestion.correctAnswer]}
Topic: ${originalQuestion.topic}

Create:
1. An easier version (more straightforward)
2. A harder version (more complex)
3. A different format (true/false or fill-in-the-blank)

Return as JSON array with the same structure as the original question.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 2000,
      });

      const content = response.choices[0].message.content;
      if (!content) return [];

      const variations = JSON.parse(content);
      return variations.map((v: any, index: number) => ({
        id: `variation-${Date.now()}-${index}`,
        question: v.question,
        options: v.options || [],
        correctAnswer: v.correctAnswer || 0,
        explanation: v.explanation || 'Generated variation',
        difficulty: v.difficulty || originalQuestion.difficulty,
        topic: v.topic || originalQuestion.topic,
        reasoning: v.reasoning || 'AI-generated variation',
      }));
    } catch (error) {
      console.error('Failed to generate question variations:', error);
      return [];
    }
  }

  async analyzeQuizPerformance(quiz: GeneratedQuiz, userAnswers: number[]): Promise<{
    score: number;
    percentage: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    detailedAnalysis: Array<{
      questionId: string;
      correct: boolean;
      difficulty: string;
      topic: string;
      explanation: string;
    }>;
  }> {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === quiz.questions[index].correctAnswer
    ).length;

    const score = correctAnswers;
    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100);

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    // Analyze by topic
    const topicPerformance = new Map<string, { correct: number; total: number }>();
    quiz.questions.forEach((question, index) => {
      const isCorrect = userAnswers[index] === question.correctAnswer;
      const topic = question.topic;
      
      if (!topicPerformance.has(topic)) {
        topicPerformance.set(topic, { correct: 0, total: 0 });
      }
      
      const perf = topicPerformance.get(topic)!;
      perf.total++;
      if (isCorrect) perf.correct++;
    });

    topicPerformance.forEach((perf, topic) => {
      const topicPercentage = Math.round((perf.correct / perf.total) * 100);
      if (topicPercentage >= 80) {
        strengths.push(`${topic} (${topicPercentage}% correct)`);
      } else if (topicPercentage < 60) {
        weaknesses.push(`${topic} (${topicPercentage}% correct)`);
      }
    });

    // Generate recommendations
    if (percentage >= 90) {
      recommendations.push("Excellent performance! Consider moving to more advanced topics.");
    } else if (percentage >= 70) {
      recommendations.push("Good understanding! Review the topics you missed and practice more.");
    } else {
      recommendations.push("Focus on reviewing the lesson content and understanding key concepts.");
    }

    if (weaknesses.length > 0) {
      recommendations.push(`Pay special attention to: ${weaknesses.join(', ')}`);
    }

    const detailedAnalysis = quiz.questions.map((question, index) => ({
      questionId: question.id,
      correct: userAnswers[index] === question.correctAnswer,
      difficulty: question.difficulty,
      topic: question.topic,
      explanation: question.explanation,
    }));

    return {
      score,
      percentage,
      strengths,
      weaknesses,
      recommendations,
      detailedAnalysis,
    };
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const aiQuizGenerator = new AIQuizGenerator();

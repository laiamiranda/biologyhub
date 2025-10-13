import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-api-key-here',
  dangerouslyAllowBrowser: true,
});

export interface LessonSummary {
  id: string;
  lessonId: string;
  title: string;
  tldr: string; // Very brief summary
  keyTakeaways: string[]; // 3-5 main points
  importantConcepts: string[]; // Key terms and concepts
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number; // in minutes
  generatedAt: string;
  confidence: number; // 0-1
}

export interface DetailedSummary {
  overview: string;
  mainTopics: Array<{
    topic: string;
    description: string;
    importance: 'high' | 'medium' | 'low';
  }>;
  keyTerms: Array<{
    term: string;
    definition: string;
    context: string;
  }>;
  learningObjectives: string[];
  prerequisites: string[];
  nextSteps: string[];
  visualAids: Array<{
    type: 'diagram' | 'chart' | 'image' | 'animation';
    description: string;
    purpose: string;
  }>;
}

class AISummarizer {
  private cache = new Map<string, LessonSummary>();
  private detailedCache = new Map<string, DetailedSummary>();

  async generateSummary(
    lessonContent: string,
    lessonTitle: string,
    lessonId: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<LessonSummary> {
    const cacheKey = `${lessonId}-${difficulty}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const summary = await this.generateSummaryWithGPT(lessonContent, lessonTitle, lessonId, difficulty);
      this.cache.set(cacheKey, summary);
      return summary;
    } catch (error) {
      console.error('Failed to generate summary with AI:', error);
      return this.generateFallbackSummary(lessonContent, lessonTitle, lessonId, difficulty);
    }
  }

  private async generateSummaryWithGPT(
    lessonContent: string,
    lessonTitle: string,
    lessonId: string,
    difficulty: string
  ): Promise<LessonSummary> {
    const systemPrompt = `You are an expert biology educator creating lesson summaries. Create a comprehensive summary that helps students quickly understand the key concepts.

Requirements:
- Create a TL;DR (2-3 sentences maximum)
- Extract 3-5 key takeaways
- Identify important concepts and terms
- Assess difficulty level
- Estimate reading time
- Be accurate and educational

Format as JSON:
{
  "tldr": "Brief 2-3 sentence summary",
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "importantConcepts": ["Concept 1", "Concept 2", "Concept 3"],
  "difficulty": "beginner|intermediate|advanced",
  "estimatedReadTime": 5,
  "confidence": 0.95
}`;

    const userPrompt = `Lesson Title: ${lessonTitle}
Difficulty Level: ${difficulty}

Lesson Content:
${lessonContent}

Please create a comprehensive summary of this biology lesson.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content generated');
    }

    try {
      const parsedSummary = JSON.parse(content);
      return {
        id: `summary-${lessonId}-${Date.now()}`,
        lessonId,
        title: `Summary: ${lessonTitle}`,
        tldr: parsedSummary.tldr,
        keyTakeaways: parsedSummary.keyTakeaways || [],
        importantConcepts: parsedSummary.importantConcepts || [],
        difficulty: parsedSummary.difficulty || difficulty,
        estimatedReadTime: parsedSummary.estimatedReadTime || 5,
        generatedAt: new Date().toISOString(),
        confidence: parsedSummary.confidence || 0.8,
      };
    } catch (parseError) {
      console.error('Failed to parse summary response:', parseError);
      throw new Error('Invalid response format from AI');
    }
  }

  private generateFallbackSummary(
    lessonContent: string,
    lessonTitle: string,
    lessonId: string,
    difficulty: string
  ): LessonSummary {
    // Simple fallback summary
    const words = lessonContent.split(' ').length;
    const estimatedReadTime = Math.max(2, Math.ceil(words / 200));

    return {
      id: `fallback-summary-${lessonId}-${Date.now()}`,
      lessonId,
      title: `Summary: ${lessonTitle}`,
      tldr: `This lesson covers ${lessonTitle}. It provides an introduction to key biological concepts and principles.`,
      keyTakeaways: [
        'Understand the main concepts presented',
        'Learn the key biological principles',
        'Apply knowledge to real-world examples'
      ],
      importantConcepts: ['Biological concepts', 'Scientific principles', 'Key terminology'],
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
      estimatedReadTime,
      generatedAt: new Date().toISOString(),
      confidence: 0.6,
    };
  }

  async generateDetailedSummary(
    lessonContent: string,
    lessonTitle: string,
    lessonId: string
  ): Promise<DetailedSummary> {
    const cacheKey = `detailed-${lessonId}`;
    
    if (this.detailedCache.has(cacheKey)) {
      return this.detailedCache.get(cacheKey)!;
    }

    try {
      const summary = await this.generateDetailedSummaryWithGPT(lessonContent, lessonTitle, lessonId);
      this.detailedCache.set(cacheKey, summary);
      return summary;
    } catch (error) {
      console.error('Failed to generate detailed summary:', error);
      return this.generateFallbackDetailedSummary(lessonContent, lessonTitle, lessonId);
    }
  }

  private async generateDetailedSummaryWithGPT(
    lessonContent: string,
    lessonTitle: string,
    lessonId: string
  ): Promise<DetailedSummary> {
    const systemPrompt = `You are an expert biology educator creating detailed lesson summaries. Create a comprehensive analysis that helps students understand the lesson structure, key concepts, and learning path.

Format as JSON:
{
  "overview": "Comprehensive overview of the lesson",
  "mainTopics": [
    {
      "topic": "Topic name",
      "description": "Description of the topic",
      "importance": "high|medium|low"
    }
  ],
  "keyTerms": [
    {
      "term": "Term name",
      "definition": "Clear definition",
      "context": "How it's used in this lesson"
    }
  ],
  "learningObjectives": ["Objective 1", "Objective 2"],
  "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
  "nextSteps": ["Next step 1", "Next step 2"],
  "visualAids": [
    {
      "type": "diagram|chart|image|animation",
      "description": "What it shows",
      "purpose": "Why it's helpful"
    }
  ]
}`;

    const userPrompt = `Lesson Title: ${lessonTitle}

Lesson Content:
${lessonContent}

Please create a detailed summary that breaks down this biology lesson into its key components.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.4,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content generated');
    }

    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse detailed summary:', parseError);
      throw new Error('Invalid response format from AI');
    }
  }

  private generateFallbackDetailedSummary(
    lessonContent: string,
    lessonTitle: string,
    lessonId: string
  ): DetailedSummary {
    return {
      overview: `This lesson provides an introduction to ${lessonTitle}, covering fundamental biological concepts and their applications.`,
      mainTopics: [
        {
          topic: 'Core Concepts',
          description: 'Fundamental biological principles covered in this lesson',
          importance: 'high'
        },
        {
          topic: 'Applications',
          description: 'Real-world applications of the concepts',
          importance: 'medium'
        }
      ],
      keyTerms: [
        {
          term: 'Key Concept',
          definition: 'Important biological concept',
          context: 'Used throughout the lesson'
        }
      ],
      learningObjectives: [
        'Understand the main concepts',
        'Apply knowledge to examples',
        'Connect to broader biological principles'
      ],
      prerequisites: ['Basic biology knowledge'],
      nextSteps: [
        'Review the lesson content',
        'Practice with exercises',
        'Move to the next lesson'
      ],
      visualAids: [
        {
          type: 'diagram',
          description: 'Conceptual diagram',
          purpose: 'Visualize key relationships'
        }
      ]
    };
  }

  async generateStudyNotes(
    lessonContent: string,
    lessonTitle: string,
    focusAreas?: string[]
  ): Promise<{
    notes: string;
    questions: string[];
    connections: string[];
    practiceSuggestions: string[];
  }> {
    try {
      const prompt = `Create study notes for this biology lesson.

Lesson: ${lessonTitle}
Content: ${lessonContent}
${focusAreas ? `Focus Areas: ${focusAreas.join(', ')}` : ''}

Create:
1. Concise study notes
2. Review questions
3. Connections to other topics
4. Practice suggestions

Format as JSON:
{
  "notes": "Study notes text",
  "questions": ["Question 1", "Question 2"],
  "connections": ["Connection 1", "Connection 2"],
  "practiceSuggestions": ["Suggestion 1", "Suggestion 2"]
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 1500,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content generated');

      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to generate study notes:', error);
      return {
        notes: `Study notes for ${lessonTitle}: Review the main concepts and practice applying them.`,
        questions: [
          'What are the main concepts in this lesson?',
          'How do these concepts relate to each other?',
          'What are some real-world applications?'
        ],
        connections: ['Related to previous lessons', 'Connects to broader biology topics'],
        practiceSuggestions: [
          'Review the lesson content',
          'Practice with exercises',
          'Discuss with study group'
        ]
      };
    }
  }

  clearCache(): void {
    this.cache.clear();
    this.detailedCache.clear();
  }

  getCacheSize(): { summaries: number; detailed: number } {
    return {
      summaries: this.cache.size,
      detailed: this.detailedCache.size,
    };
  }
}

export const aiSummarizer = new AISummarizer();

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-api-key-here',
  dangerouslyAllowBrowser: true,
});

export interface PacingSuggestion {
  id: string;
  title: string;
  description: string;
  type: 'schedule' | 'deadline' | 'break' | 'review' | 'intensive';
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  benefits: string[];
  suggestedDate: string; // YYYY-MM-DD
  confidence: number; // 0-1
}

export interface StudyProfile {
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  availableTimePerWeek: number; // in hours
  preferredStudyTimes: string[]; // ['morning', 'afternoon', 'evening']
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  goals: string[];
  weakAreas: string[];
  strongAreas: string[];
  deadline?: string; // YYYY-MM-DD
}

export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  totalDuration: number; // in weeks
  weeklySchedule: Array<{
    week: number;
    focus: string;
    sessions: Array<{
      day: string;
      time: string;
      duration: number;
      activity: string;
      description: string;
    }>;
  }>;
  milestones: Array<{
    week: number;
    title: string;
    description: string;
    assessment: string;
  }>;
  recommendations: string[];
  estimatedCompletion: string;
}

class AIPacingSuggestions {
  private cache = new Map<string, PacingSuggestion[]>();

  async generatePacingSuggestions(
    profile: StudyProfile,
    tracks: any[],
    completedLessons: any[]
  ): Promise<PacingSuggestion[]> {
    const cacheKey = `${profile.currentLevel}-${profile.availableTimePerWeek}-${tracks.length}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const suggestions = await this.generateSuggestionsWithAI(profile, tracks, completedLessons);
      this.cache.set(cacheKey, suggestions);
      return suggestions;
    } catch (error) {
      console.error('Failed to generate pacing suggestions:', error);
      return this.generateFallbackSuggestions(profile);
    }
  }

  private async generateSuggestionsWithAI(
    profile: StudyProfile,
    tracks: any[],
    completedLessons: any[]
  ): Promise<PacingSuggestion[]> {
    const systemPrompt = `You are an expert biology education advisor. Generate personalized study pacing suggestions based on the user's profile and learning goals.

User Profile:
- Level: ${profile.currentLevel}
- Available time per week: ${profile.availableTimePerWeek} hours
- Preferred study times: ${profile.preferredStudyTimes.join(', ')}
- Learning style: ${profile.learningStyle}
- Goals: ${profile.goals.join(', ')}
- Weak areas: ${profile.weakAreas.join(', ')}
- Strong areas: ${profile.strongAreas.join(', ')}
${profile.deadline ? `- Deadline: ${profile.deadline}` : ''}

Available Tracks: ${tracks.length}
Completed Lessons: ${completedLessons.length}

Generate 5-8 personalized pacing suggestions that help the user:
1. Optimize their study schedule
2. Address weak areas effectively
3. Build on their strengths
4. Meet their learning goals
5. Maintain motivation and avoid burnout

Format as JSON array:
[
  {
    "title": "Suggestion title",
    "description": "Detailed description of the suggestion",
    "type": "schedule|deadline|break|review|intensive",
    "priority": "low|medium|high",
    "estimatedDuration": 60,
    "difficulty": "beginner|intermediate|advanced",
    "prerequisites": ["prerequisite 1", "prerequisite 2"],
    "benefits": ["benefit 1", "benefit 2"],
    "suggestedDate": "2024-01-15",
    "confidence": 0.9
  }
]`;

    const userPrompt = `Please generate personalized study pacing suggestions for this biology student. Consider their current progress, available time, and learning preferences.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content generated');
    }

    try {
      const suggestions = JSON.parse(content);
      return suggestions.map((s: any, index: number) => ({
        id: `suggestion-${Date.now()}-${index}`,
        ...s,
      }));
    } catch (parseError) {
      console.error('Failed to parse pacing suggestions:', parseError);
      throw new Error('Invalid response format from AI');
    }
  }

  private generateFallbackSuggestions(profile: StudyProfile): PacingSuggestion[] {
    const suggestions: PacingSuggestion[] = [
      {
        id: `fallback-1-${Date.now()}`,
        title: 'Daily Study Routine',
        description: `Establish a consistent daily study routine of ${Math.round(profile.availableTimePerWeek * 60 / 7)} minutes per day.`,
        type: 'schedule',
        priority: 'high',
        estimatedDuration: Math.round(profile.availableTimePerWeek * 60 / 7),
        difficulty: profile.currentLevel,
        prerequisites: ['Basic time management skills'],
        benefits: ['Consistent progress', 'Better retention', 'Habit formation'],
        suggestedDate: new Date().toISOString().split('T')[0],
        confidence: 0.8,
      },
      {
        id: `fallback-2-${Date.now()}`,
        title: 'Weekly Review Session',
        description: 'Schedule a weekly review session to consolidate learning and identify areas for improvement.',
        type: 'review',
        priority: 'medium',
        estimatedDuration: 90,
        difficulty: profile.currentLevel,
        prerequisites: ['Completed lessons to review'],
        benefits: ['Better retention', 'Gap identification', 'Confidence building'],
        suggestedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        confidence: 0.7,
      },
      {
        id: `fallback-3-${Date.now()}`,
        title: 'Focus on Weak Areas',
        description: `Dedicate extra time to your weak areas: ${profile.weakAreas.join(', ')}.`,
        type: 'intensive',
        priority: 'high',
        estimatedDuration: 120,
        difficulty: profile.currentLevel,
        prerequisites: profile.weakAreas,
        benefits: ['Improved understanding', 'Better overall performance', 'Confidence building'],
        suggestedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        confidence: 0.9,
      }
    ];

    return suggestions;
  }

  async generateStudyPlan(
    profile: StudyProfile,
    tracks: any[],
    targetCompletionDate?: string
  ): Promise<StudyPlan> {
    try {
      const systemPrompt = `You are an expert biology education planner. Create a comprehensive study plan for a biology student.

User Profile:
- Level: ${profile.currentLevel}
- Available time per week: ${profile.availableTimePerWeek} hours
- Learning style: ${profile.learningStyle}
- Goals: ${profile.goals.join(', ')}
- Weak areas: ${profile.weakAreas.join(', ')}
- Strong areas: ${profile.strongAreas.join(', ')}
${targetCompletionDate ? `- Target completion: ${targetCompletionDate}` : ''}

Available Tracks: ${tracks.length}

Create a detailed study plan with:
1. Weekly schedule breakdown
2. Specific learning activities
3. Milestones and assessments
4. Recommendations for success

Format as JSON:
{
  "title": "Study Plan Title",
  "description": "Plan description",
  "totalDuration": 12,
  "weeklySchedule": [
    {
      "week": 1,
      "focus": "Week focus",
      "sessions": [
        {
          "day": "Monday",
          "time": "09:00",
          "duration": 60,
          "activity": "Activity name",
          "description": "What to do"
        }
      ]
    }
  ],
  "milestones": [
    {
      "week": 4,
      "title": "Milestone title",
      "description": "What to achieve",
      "assessment": "How to assess"
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "estimatedCompletion": "2024-03-15"
}`;

      const userPrompt = `Create a personalized study plan for this biology student.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        max_tokens: 3000,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No content generated');
      }

      const plan = JSON.parse(content);
      return {
        id: `plan-${Date.now()}`,
        ...plan,
      };
    } catch (error) {
      console.error('Failed to generate study plan:', error);
      return this.generateFallbackStudyPlan(profile, tracks);
    }
  }

  private generateFallbackStudyPlan(profile: StudyProfile, tracks: any[]): StudyPlan {
    const totalWeeks = Math.ceil(tracks.length / 2); // 2 tracks per week
    const weeklySchedule = Array.from({ length: totalWeeks }, (_, weekIndex) => ({
      week: weekIndex + 1,
      focus: `Week ${weekIndex + 1}: ${tracks[weekIndex * 2]?.title || 'Biology Concepts'}`,
      sessions: [
        {
          day: 'Monday',
          time: '09:00',
          duration: Math.round(profile.availableTimePerWeek * 60 / 4),
          activity: 'Track Study',
          description: `Study ${tracks[weekIndex * 2]?.title || 'biology concepts'}`
        },
        {
          day: 'Wednesday',
          time: '14:00',
          duration: Math.round(profile.availableTimePerWeek * 60 / 4),
          activity: 'Track Study',
          description: `Continue studying ${tracks[weekIndex * 2]?.title || 'biology concepts'}`
        },
        {
          day: 'Friday',
          time: '10:00',
          duration: Math.round(profile.availableTimePerWeek * 60 / 4),
          activity: 'Review & Practice',
          description: 'Review the week\'s learning and practice with quizzes'
        },
        {
          day: 'Sunday',
          time: '16:00',
          duration: Math.round(profile.availableTimePerWeek * 60 / 4),
          activity: 'Weekly Review',
          description: 'Consolidate learning and plan for next week'
        }
      ]
    }));

    return {
      id: `fallback-plan-${Date.now()}`,
      title: 'Personalized Biology Study Plan',
      description: `A ${totalWeeks}-week study plan tailored to your ${profile.currentLevel} level and ${profile.availableTimePerWeek} hours per week availability.`,
      totalDuration: totalWeeks,
      weeklySchedule,
      milestones: [
        {
          week: Math.ceil(totalWeeks / 4),
          title: 'First Milestone',
          description: 'Complete first quarter of the study plan',
          assessment: 'Take a comprehensive quiz on covered topics'
        },
        {
          week: Math.ceil(totalWeeks / 2),
          title: 'Midpoint Assessment',
          description: 'Reach the halfway point of your study plan',
          assessment: 'Complete a practice exam covering all topics studied so far'
        },
        {
          week: totalWeeks,
          title: 'Final Assessment',
          description: 'Complete the entire study plan',
          assessment: 'Take a final comprehensive exam to test your knowledge'
        }
      ],
      recommendations: [
        'Maintain a consistent study schedule',
        'Take regular breaks to avoid burnout',
        'Review previous lessons regularly',
        'Practice with quizzes and exercises',
        'Seek help when needed'
      ],
      estimatedCompletion: new Date(Date.now() + totalWeeks * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
  }

  async analyzeStudyPatterns(sessions: any[]): Promise<{
    insights: string[];
    recommendations: string[];
    optimalTimes: string[];
    productivityScore: number;
  }> {
    try {
      const prompt = `Analyze these study session patterns and provide insights:

Sessions: ${JSON.stringify(sessions.slice(0, 10))} // Limit to first 10 for token efficiency

Provide insights about:
1. Most productive study times
2. Optimal session duration
3. Study frequency patterns
4. Areas for improvement

Format as JSON:
{
  "insights": ["Insight 1", "Insight 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "optimalTimes": ["09:00", "14:00"],
  "productivityScore": 0.8
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 1000,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content generated');

      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to analyze study patterns:', error);
      return {
        insights: ['Maintain consistent study schedule', 'Take regular breaks'],
        recommendations: ['Study at the same time each day', 'Review material regularly'],
        optimalTimes: ['09:00', '14:00', '19:00'],
        productivityScore: 0.7
      };
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const aiPacingSuggestions = new AIPacingSuggestions();

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-api-key-here',
  dangerouslyAllowBrowser: true, // Only for client-side usage
});

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'track' | 'lesson' | 'glossary' | 'news';
  relevanceScore: number;
  category?: string;
  difficulty?: string;
  description?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  type: 'track' | 'lesson' | 'glossary' | 'news';
  reason: string;
  confidence: number;
  category?: string;
  difficulty?: string;
  description?: string;
}

export interface EmbeddingData {
  id: string;
  title: string;
  content: string;
  type: 'track' | 'lesson' | 'glossary' | 'news';
  embedding: number[];
  category?: string;
  difficulty?: string;
  description?: string;
}

class AISearchService {
  private embeddings: EmbeddingData[] = [];
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Load pre-computed embeddings from localStorage or generate them
      const storedEmbeddings = localStorage.getItem('biology_embeddings');
      if (storedEmbeddings) {
        this.embeddings = JSON.parse(storedEmbeddings);
        this.isInitialized = true;
        return;
      }

      // Generate embeddings for all content
      await this.generateEmbeddings();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize AI search:', error);
      // Fallback to basic search if AI fails
      this.isInitialized = true;
    }
  }

  private async generateEmbeddings() {
    // This would typically be done server-side in production
    // For demo purposes, we'll create mock embeddings
    const mockContent = this.getMockContent();
    
    try {
      // Generate embeddings using OpenAI
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: mockContent.map(item => `${item.title}: ${item.content}`),
      });

      this.embeddings = mockContent.map((item, index) => ({
        ...item,
        embedding: response.data[index].embedding,
      }));

      // Store in localStorage for future use
      localStorage.setItem('biology_embeddings', JSON.stringify(this.embeddings));
    } catch (error) {
      console.error('Failed to generate embeddings:', error);
      // Use mock embeddings as fallback
      this.embeddings = mockContent.map(item => ({
        ...item,
        embedding: this.generateMockEmbedding(item.title + item.content),
      }));
    }
  }

  private getMockContent() {
    return [
      // Tracks
      {
        id: 'track-1',
        title: 'DNA Structure & Function',
        content: 'Master the structure of DNA and its role as genetic material. Learn about double helix, base pairs, and genetic information storage.',
        type: 'track' as const,
        category: 'genetics',
        difficulty: 'intermediate',
        description: 'Understand DNA structure and function in detail',
      },
      {
        id: 'track-2',
        title: 'Gene Regulation',
        content: 'Learn how gene expression is controlled and regulated in cells. Study transcription factors, enhancers, and repressors.',
        type: 'track' as const,
        category: 'genetics',
        difficulty: 'advanced',
        description: 'Control mechanisms of gene expression',
      },
      {
        id: 'track-3',
        title: 'PCR Techniques',
        content: 'Master Polymerase Chain Reaction techniques for DNA amplification. Learn about primers, cycles, and applications.',
        type: 'track' as const,
        category: 'molecular-biology',
        difficulty: 'intermediate',
        description: 'DNA amplification using PCR',
      },
      {
        id: 'track-4',
        title: 'Mutations & DNA Repair',
        content: 'Study genetic mutations, their causes, and cellular repair mechanisms. Learn about point mutations, frameshifts, and repair pathways.',
        type: 'track' as const,
        category: 'genetics',
        difficulty: 'intermediate',
        description: 'Understanding genetic mutations and repair',
      },
      {
        id: 'track-5',
        title: 'Protein Synthesis',
        content: 'Learn about transcription and translation processes. Understand how DNA is converted to proteins through mRNA.',
        type: 'track' as const,
        category: 'molecular-biology',
        difficulty: 'intermediate',
        description: 'From DNA to protein synthesis',
      },
      {
        id: 'track-6',
        title: 'Cell Division',
        content: 'Study mitosis and meiosis processes. Learn about chromosome behavior and cell cycle regulation.',
        type: 'track' as const,
        category: 'cell-biology',
        difficulty: 'beginner',
        description: 'Understanding cell division processes',
      },
      {
        id: 'track-7',
        title: 'Photosynthesis',
        content: 'Master the process of photosynthesis in plants. Learn about light and dark reactions, chloroplasts, and energy conversion.',
        type: 'track' as const,
        category: 'plant-biology',
        difficulty: 'intermediate',
        description: 'How plants convert light to energy',
      },
      {
        id: 'track-8',
        title: 'Cellular Respiration',
        content: 'Study how cells produce ATP through glycolysis, Krebs cycle, and electron transport chain.',
        type: 'track' as const,
        category: 'biochemistry',
        difficulty: 'intermediate',
        description: 'Energy production in cells',
      },
      // Glossary terms
      {
        id: 'glossary-1',
        title: 'DNA',
        content: 'Deoxyribonucleic acid - the molecule that carries genetic information in all living organisms.',
        type: 'glossary' as const,
        category: 'genetics',
        difficulty: 'beginner',
        description: 'Genetic material of living organisms',
      },
      {
        id: 'glossary-2',
        title: 'Gene',
        content: 'A segment of DNA that codes for a specific protein or trait. The basic unit of heredity.',
        type: 'glossary' as const,
        category: 'genetics',
        difficulty: 'beginner',
        description: 'Unit of heredity in DNA',
      },
      {
        id: 'glossary-3',
        title: 'Protein',
        content: 'Large biomolecules made of amino acids that perform various functions in cells.',
        type: 'glossary' as const,
        category: 'biochemistry',
        difficulty: 'beginner',
        description: 'Essential biomolecules in cells',
      },
      // News articles
      {
        id: 'news-1',
        title: 'CRISPR Gene Editing Breakthrough',
        content: 'Scientists develop new CRISPR technique for precise gene editing with reduced off-target effects.',
        type: 'news' as const,
        category: 'genetics',
        difficulty: 'advanced',
        description: 'Latest advances in gene editing technology',
      },
      {
        id: 'news-2',
        title: 'New DNA Repair Mechanism Discovered',
        content: 'Researchers identify novel DNA repair pathway that could lead to new cancer treatments.',
        type: 'news' as const,
        category: 'genetics',
        difficulty: 'advanced',
        description: 'Breakthrough in DNA repair research',
      },
    ];
  }

  private generateMockEmbedding(text: string): number[] {
    // Generate a mock embedding vector (1536 dimensions for text-embedding-3-small)
    const hash = this.simpleHash(text);
    const embedding = new Array(1536).fill(0);
    
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] = Math.sin(hash + i) * 0.1;
    }
    
    return embedding;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async semanticSearch(query: string, limit: number = 10): Promise<SearchResult[]> {
    await this.initialize();
    
    if (!this.isInitialized || this.embeddings.length === 0) {
      return this.fallbackSearch(query, limit);
    }

    try {
      // Generate embedding for the search query
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query,
      });

      const queryEmbedding = response.data[0].embedding;

      // Calculate similarities
      const results = this.embeddings.map(item => ({
        ...item,
        relevanceScore: this.cosineSimilarity(queryEmbedding, item.embedding),
      }));

      // Sort by relevance and return top results
      return results
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit)
        .map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          type: item.type,
          relevanceScore: item.relevanceScore,
          category: item.category,
          difficulty: item.difficulty,
          description: item.description,
        }));
    } catch (error) {
      console.error('Semantic search failed:', error);
      return this.fallbackSearch(query, limit);
    }
  }

  private fallbackSearch(query: string, limit: number): SearchResult[] {
    // Simple text-based search as fallback
    const queryLower = query.toLowerCase();
    
    return this.embeddings
      .filter(item => 
        item.title.toLowerCase().includes(queryLower) ||
        item.content.toLowerCase().includes(queryLower)
      )
      .slice(0, limit)
      .map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        type: item.type,
        relevanceScore: 0.5, // Default score for fallback
        category: item.category,
        difficulty: item.difficulty,
        description: item.description,
      }));
  }

  async getRecommendations(
    completedItemId: string, 
    completedItemType: 'track' | 'lesson' | 'glossary' | 'news',
    limit: number = 5
  ): Promise<Recommendation[]> {
    await this.initialize();
    
    if (!this.isInitialized || this.embeddings.length === 0) {
      return this.getFallbackRecommendations(completedItemId, completedItemType, limit);
    }

    try {
      // Find the completed item
      const completedItem = this.embeddings.find(item => item.id === completedItemId);
      if (!completedItem) {
        return this.getFallbackRecommendations(completedItemId, completedItemType, limit);
      }

      // Generate recommendations based on content similarity
      const recommendations = this.embeddings
        .filter(item => item.id !== completedItemId) // Exclude the completed item
        .map(item => ({
          ...item,
          similarity: this.cosineSimilarity(completedItem.embedding, item.embedding),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
        .map(item => ({
          id: item.id,
          title: item.title,
          type: item.type,
          reason: this.generateRecommendationReason(completedItem, item),
          confidence: item.similarity,
          category: item.category,
          difficulty: item.difficulty,
          description: item.description,
        }));

      return recommendations;
    } catch (error) {
      console.error('Recommendation generation failed:', error);
      return this.getFallbackRecommendations(completedItemId, completedItemType, limit);
    }
  }

  private generateRecommendationReason(completed: EmbeddingData, recommended: EmbeddingData): string {
    const reasons = [
      `Similar to "${completed.title}" in content and concepts`,
      `Builds upon the knowledge from "${completed.title}"`,
      `Related topic that complements "${completed.title}"`,
      `Advanced study following "${completed.title}"`,
      `Practical application of "${completed.title}" concepts`,
    ];
    
    // Use similarity score to determine reason
    if (recommended.similarity > 0.8) {
      return reasons[0];
    } else if (recommended.similarity > 0.6) {
      return reasons[1];
    } else if (recommended.similarity > 0.4) {
      return reasons[2];
    } else {
      return reasons[Math.floor(Math.random() * reasons.length)];
    }
  }

  private getFallbackRecommendations(
    completedItemId: string, 
    completedItemType: string, 
    limit: number
  ): Recommendation[] {
    // Simple fallback recommendations based on category and type
    const completedItem = this.embeddings.find(item => item.id === completedItemId);
    if (!completedItem) return [];

    return this.embeddings
      .filter(item => 
        item.id !== completedItemId &&
        (item.category === completedItem.category || item.type === completedItemType)
      )
      .slice(0, limit)
      .map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        reason: `Related ${item.type} in ${item.category}`,
        confidence: 0.5,
        category: item.category,
        difficulty: item.difficulty,
        description: item.description,
      }));
  }

  async generateSearchSuggestions(query: string): Promise<string[]> {
    // Generate search suggestions based on the query
    const suggestions = [
      'DNA structure and function',
      'Gene regulation mechanisms',
      'Protein synthesis process',
      'Cell division and mitosis',
      'Photosynthesis in plants',
      'Cellular respiration',
      'Genetic mutations',
      'PCR techniques',
      'CRISPR gene editing',
      'Molecular biology basics',
    ];

    return suggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes(suggestion.toLowerCase())
      )
      .slice(0, 5);
  }

  async analyzeSearchQuery(query: string): Promise<{
    intent: 'search' | 'question' | 'exploration';
    suggestedFilters: string[];
    relatedTopics: string[];
  }> {
    // Simple analysis of search intent
    const queryLower = query.toLowerCase();
    
    let intent: 'search' | 'question' | 'exploration' = 'search';
    if (queryLower.includes('what') || queryLower.includes('how') || queryLower.includes('why')) {
      intent = 'question';
    } else if (queryLower.includes('explore') || queryLower.includes('learn') || queryLower.includes('study')) {
      intent = 'exploration';
    }

    const suggestedFilters = [];
    if (queryLower.includes('beginner') || queryLower.includes('basic')) {
      suggestedFilters.push('difficulty:beginner');
    }
    if (queryLower.includes('advanced') || queryLower.includes('complex')) {
      suggestedFilters.push('difficulty:advanced');
    }
    if (queryLower.includes('genetics') || queryLower.includes('dna') || queryLower.includes('gene')) {
      suggestedFilters.push('category:genetics');
    }

    const relatedTopics = [
      'Molecular Biology',
      'Cell Biology',
      'Genetics',
      'Biochemistry',
      'Evolution',
    ];

    return {
      intent,
      suggestedFilters,
      relatedTopics,
    };
  }
}

// Export singleton instance
export const aiSearchService = new AISearchService();

import { useEffect, useState } from 'react';
import { Calendar, Newspaper, TrendingUp, Globe, Microscope, Dna, Heart, Leaf, Zap, Clock, ExternalLink, BookOpen, Sparkles, ArrowLeft } from 'lucide-react';
import { NavigationProps } from '../types/navigation';

interface BioNewsPageProps extends NavigationProps {}

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'discovery' | 'research' | 'health' | 'environment' | 'technology' | 'policy';
  source: string;
  publishedAt: string;
  readTime: number;
  imageUrl?: string;
  tags: string[];
  aiSummary?: string;
  relevanceScore: number;
}

interface WeeklyDigest {
  id: string;
  week: string;
  title: string;
  description: string;
  articles: NewsArticle[];
  topDiscoveries: NewsArticle[];
  trendingTopics: string[];
  publishedAt: string;
}

interface BioBlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  featured: boolean;
}

export default function BioNewsPage({ onNavigate }: BioNewsPageProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [weeklyDigests, setWeeklyDigests] = useState<WeeklyDigest[]>([]);
  const [blogPosts, setBlogPosts] = useState<BioBlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [view, setView] = useState<'overview' | 'digest' | 'blog' | 'article'>('overview');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Generate mock data for demonstration
      const mockArticles = generateMockArticles();
      const mockDigests = generateMockWeeklyDigests(mockArticles);
      const mockBlogPosts = generateMockBlogPosts();

      setArticles(mockArticles);
      setWeeklyDigests(mockDigests);
      setBlogPosts(mockBlogPosts);
    } catch (error) {
      console.error('Failed to load news data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockArticles = (): NewsArticle[] => {
    const categories = ['discovery', 'research', 'health', 'environment', 'technology', 'policy'] as const;
    const sources = ['Nature', 'Science', 'Cell', 'PNAS', 'The Lancet', 'Scientific American', 'BBC Science', 'New Scientist'];
    
    return Array.from({ length: 50 }, (_, i) => {
      const category = categories[i % categories.length];
      const source = sources[i % sources.length];
      const publishedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      return {
        id: `article-${i + 1}`,
        title: generateArticleTitle(category, i),
        summary: generateArticleSummary(category),
        content: generateArticleContent(category),
        category,
        source,
        publishedAt: publishedAt.toISOString(),
        readTime: Math.floor(Math.random() * 8) + 3,
        imageUrl: `https://picsum.photos/400/250?random=${i}`,
        tags: generateTags(category),
        aiSummary: generateAISummary(category),
        relevanceScore: Math.random(),
      };
    }).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  };

  const generateMockWeeklyDigests = (articles: NewsArticle[]): WeeklyDigest[] => {
    const weeks = ['Week of Oct 7-13, 2024', 'Week of Sep 30-Oct 6, 2024', 'Week of Sep 23-29, 2024'];
    
    return weeks.map((week, i) => {
      const weekArticles = articles.slice(i * 15, (i + 1) * 15);
      const topDiscoveries = weekArticles.filter(a => a.category === 'discovery').slice(0, 3);
      const trendingTopics = ['CRISPR', 'Climate Change', 'COVID-19', 'Cancer Research', 'Biodiversity'];
      
      return {
        id: `digest-${i + 1}`,
        week,
        title: `Biology Weekly Digest - ${week}`,
        description: `Top ${weekArticles.length} biology stories and discoveries from this week`,
        articles: weekArticles,
        topDiscoveries,
        trendingTopics: trendingTopics.slice(0, 3),
        publishedAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
    });
  };

  const generateMockBlogPosts = (): BioBlogPost[] => {
    const topics = [
      'The Future of Gene Therapy',
      'Understanding Climate Change Through Biology',
      'CRISPR: Revolution or Risk?',
      'The Human Microbiome and Health',
      'Conservation Biology in the Digital Age',
      'Synthetic Biology: Building Life from Scratch',
      'The Science of Aging',
      'Biodiversity Loss: A Silent Crisis',
    ];

    return topics.map((topic, i) => ({
      id: `blog-${i + 1}`,
      title: topic,
      excerpt: `An in-depth exploration of ${topic.toLowerCase()} and its implications for modern biology.`,
      content: `This is a comprehensive blog post about ${topic.toLowerCase()}. It covers the latest research, implications, and future directions in this fascinating field of biology.`,
      author: 'Dr. Sarah Chen',
      publishedAt: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString(),
      readTime: Math.floor(Math.random() * 10) + 5,
      category: ['Research', 'Opinion', 'Analysis', 'News'][i % 4],
      tags: ['biology', 'research', 'science', 'innovation'],
      featured: i < 3,
    }));
  };

  const generateArticleTitle = (category: string, index: number): string => {
    const titles = {
      discovery: [
        'New Species of Deep-Sea Bacteria Discovered',
        'Breakthrough in Understanding Protein Folding',
        'Ancient DNA Reveals Human Migration Patterns',
        'Novel Enzyme Could Revolutionize Drug Development',
        'Scientists Find New Way to Regenerate Damaged Tissues',
      ],
      research: [
        'Study Shows Link Between Gut Microbiome and Mental Health',
        'New Research Sheds Light on Cancer Cell Metabolism',
        'Breakthrough in Stem Cell Research',
        'Scientists Develop New Method for Gene Editing',
        'Research Reveals Secrets of Plant Communication',
      ],
      health: [
        'New Treatment Shows Promise for Alzheimer\'s Disease',
        'Breakthrough in Cancer Immunotherapy',
        'Study Links Air Pollution to Increased Disease Risk',
        'New Vaccine Technology Could Prevent Multiple Diseases',
        'Research Identifies New Biomarkers for Early Disease Detection',
      ],
      environment: [
        'Climate Change Threatens Coral Reef Ecosystems',
        'New Study Shows Impact of Deforestation on Biodiversity',
        'Scientists Develop Carbon Capture Technology',
        'Research Reveals Ocean Acidification Effects',
        'New Method Could Help Restore Damaged Ecosystems',
      ],
      technology: [
        'AI Helps Scientists Discover New Drug Compounds',
        'New Imaging Technology Reveals Cellular Structures',
        'Robotic Surgery Advances in Precision Medicine',
        'Machine Learning Predicts Protein Structures',
        'New Lab-on-a-Chip Technology for Rapid Testing',
      ],
      policy: [
        'New Regulations for Gene Editing Research',
        'Government Invests in Biotechnology Research',
        'Ethical Guidelines Updated for AI in Biology',
        'International Agreement on Biodiversity Protection',
        'New Standards for Clinical Trial Transparency',
      ],
    };

    const categoryTitles = titles[category as keyof typeof titles] || titles.discovery;
    return categoryTitles[index % categoryTitles.length];
  };

  const generateArticleSummary = (category: string): string => {
    const summaries = {
      discovery: 'A groundbreaking discovery that could revolutionize our understanding of biological processes.',
      research: 'New research findings that advance our knowledge in this important field of study.',
      health: 'Important health-related findings that could impact medical treatments and patient care.',
      environment: 'Environmental research that highlights the impact of human activities on ecosystems.',
      technology: 'Cutting-edge technology that could transform how we study and understand biology.',
      policy: 'Policy developments that affect the future of biological research and applications.',
    };
    return summaries[category as keyof typeof summaries] || summaries.discovery;
  };

  const generateArticleContent = (category: string): string => {
    return `This is a detailed article about recent developments in ${category}. The research shows significant implications for the field and could lead to important breakthroughs in our understanding of biological processes. Scientists are excited about the potential applications and are planning follow-up studies to further explore these findings.`;
  };

  const generateTags = (category: string): string[] => {
    const tagMap = {
      discovery: ['discovery', 'research', 'breakthrough'],
      research: ['research', 'study', 'findings'],
      health: ['health', 'medicine', 'treatment'],
      environment: ['environment', 'climate', 'conservation'],
      technology: ['technology', 'AI', 'innovation'],
      policy: ['policy', 'regulation', 'ethics'],
    };
    return tagMap[category as keyof typeof tagMap] || ['biology', 'science'];
  };

  const generateAISummary = (category: string): string => {
    return `AI Summary: This article discusses recent advances in ${category} research. Key findings suggest significant potential for future applications in medicine, technology, and environmental science. The research methodology was rigorous and the results are promising for the field.`;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      discovery: Microscope,
      research: BookOpen,
      health: Heart,
      environment: Leaf,
      technology: Zap,
      policy: Globe,
    };
    const IconComponent = icons[category as keyof typeof icons] || BookOpen;
    return <IconComponent className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      discovery: 'bg-purple-100 text-purple-700 border-purple-200',
      research: 'bg-blue-100 text-blue-700 border-blue-200',
      health: 'bg-red-100 text-red-700 border-red-200',
      environment: 'bg-green-100 text-green-700 border-green-200',
      technology: 'bg-orange-100 text-orange-700 border-orange-200',
      policy: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (view === 'article' && selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setView('overview')}
                className="flex items-center text-teal-600 hover:text-teal-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to News
              </button>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {selectedArticle.readTime} min read
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(selectedArticle.category)}`}>
                  {getCategoryIcon(selectedArticle.category)}
                  <span className="ml-1 capitalize">{selectedArticle.category}</span>
                </span>
                <span className="text-sm text-gray-500">{selectedArticle.source}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{formatDate(selectedArticle.publishedAt)}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{selectedArticle.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{selectedArticle.summary}</p>
            </div>

            {selectedArticle.imageUrl && (
              <div className="mb-8">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="prose max-w-none mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">{selectedArticle.content}</p>
            </div>

            {selectedArticle.aiSummary && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-8">
                <div className="flex items-center mb-3">
                  <Sparkles className="w-5 h-5 text-teal-600 mr-2" />
                  <h3 className="font-semibold text-teal-800">AI Summary</h3>
                </div>
                <p className="text-teal-700">{selectedArticle.aiSummary}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
              {selectedArticle.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <ExternalLink className="w-4 h-4 mr-1" />
                <span>Read full article on {selectedArticle.source}</span>
              </div>
              <button
                onClick={() => window.open(`https://${selectedArticle.source.toLowerCase().replace(' ', '')}.com`, '_blank')}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Visit Source
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Current Events & Bio News</h1>
            <p className="text-xl text-teal-100 mb-8">
              Stay updated with the latest biology discoveries, research breakthroughs, and scientific news.
              AI-powered summaries help you understand complex topics quickly.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Weekly Digest</h3>
            <p className="text-gray-600">Curated selection of the most important biology news</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Newspaper className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Biology Blog</h3>
            <p className="text-gray-600">In-depth analysis and commentary on biological topics</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI Summaries</h3>
            <p className="text-gray-600">Complex research made simple with AI-generated summaries</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Latest News</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Newspaper className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Categories</option>
                <option value="discovery">Discoveries</option>
                <option value="research">Research</option>
                <option value="health">Health</option>
                <option value="environment">Environment</option>
                <option value="technology">Technology</option>
                <option value="policy">Policy</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.slice(0, 12).map((article) => (
              <div
                key={article.id}
                onClick={() => {
                  setSelectedArticle(article);
                  setView('article');
                }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden cursor-pointer group"
              >
                {article.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(article.category)}`}>
                      {getCategoryIcon(article.category)}
                      <span className="ml-1 capitalize">{article.category}</span>
                    </span>
                    <span className="text-sm text-gray-500">{article.source}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.summary}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{article.readTime} min read</span>
                    </div>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  {article.aiSummary && (
                    <div className="mt-3 flex items-center text-xs text-teal-600">
                      <Sparkles className="w-3 h-3 mr-1" />
                      <span>AI Summary Available</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Weekly Digests</h3>
              <button
                onClick={() => setView('digest')}
                className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {weeklyDigests.slice(0, 3).map((digest) => (
                <div
                  key={digest.id}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <h4 className="font-semibold text-gray-800 mb-2">{digest.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{digest.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{digest.articles.length} articles</span>
                    <span>{formatDate(digest.publishedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Biology Blog</h3>
              <button
                onClick={() => setView('blog')}
                className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {blogPosts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{post.title}</h4>
                    {post.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {post.author}</span>
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Calendar, Newspaper, TrendingUp, Globe, Microscope, Dna, Heart, Leaf, Zap, Clock, ExternalLink, BookOpen, Sparkles, ArrowLeft, Search, Filter, Star, Users, Award, ArrowRight } from 'lucide-react';
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
                <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${getCategoryColor(selectedArticle.category)}`}>
                  {getCategoryIcon(selectedArticle.category)}
                  <span className="ml-2 capitalize">{selectedArticle.category}</span>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Modern Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-teal-100 mb-6">
              <Newspaper className="w-4 h-4 mr-2" />
              Bio News & Events
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Current Events & Bio News
            </h1>
            
            <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
              Stay updated with the latest biology discoveries, research breakthroughs, and scientific news.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Modern Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-teal-100 to-teal-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Weekly Digest</h3>
            <p className="text-gray-600 leading-relaxed">Curated selection of the most important biology news and discoveries from around the world.</p>
          </div>
          <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Newspaper className="w-8 h-8 text-cyan-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Biology Blog</h3>
            <p className="text-gray-600 leading-relaxed">In-depth analysis and commentary on biological topics by expert researchers and educators.</p>
          </div>
          <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">AI Summaries</h3>
            <p className="text-gray-600 leading-relaxed">Complex research made simple with AI-generated summaries that break down scientific jargon.</p>
          </div>
        </div>

        {/* Modern Search and Filter Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg transition-all duration-300 hover:border-gray-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-12 pr-10 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white text-lg transition-all duration-300 hover:border-gray-300 min-w-[200px]"
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
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Latest News</h2>
            <p className="text-gray-600">
              {searchQuery && `Searching for "${searchQuery}"`}
              {selectedCategory !== 'all' && ` in ${selectedCategory} category`}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Newspaper className="w-4 h-4 mr-2" />
                <span>{filteredArticles.length} articles found</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                <span>Expert curated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.slice(0, 12).map((article, index) => (
              <div
                key={article.id}
                onClick={() => {
                  setSelectedArticle(article);
                  setView('article');
                }}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {article.imageUrl && (
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4 right-4">
                      <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold backdrop-blur-sm bg-white/90 ${getCategoryColor(article.category)}`}>
                        {getCategoryIcon(article.category)}
                        <span className="ml-2 capitalize">{article.category}</span>
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2 text-teal-500" />
                      <span className="font-medium">{article.readTime} min read</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Newspaper className="w-4 h-4 mr-2 text-cyan-500" />
                      <span className="font-medium">{article.source}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors line-clamp-2 leading-tight">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors">
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatDate(article.publishedAt)}
                    </div>
                  </div>
                  
                  {article.aiSummary && (
                    <div className="mt-4 flex items-center text-sm text-teal-600 bg-teal-50 px-3 py-2 rounded-lg">
                      <Sparkles className="w-4 h-4 mr-2" />
                      <span className="font-medium">AI Summary Available</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No articles found</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? `No articles match "${searchQuery}". Try adjusting your search terms.`
                : 'No articles match your current filters. Try changing your search criteria.'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition-colors font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Modern Weekly Digests and Blog Section */}
        <div className="grid md:grid-cols-2 gap-12 mt-16">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-teal-100 to-teal-200 w-12 h-12 rounded-2xl flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Weekly Digests</h3>
                  <p className="text-gray-600">Curated biology news</p>
                </div>
              </div>
              <button
                onClick={() => setView('digest')}
                className="group flex items-center text-teal-600 font-semibold hover:text-teal-700 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="space-y-6">
              {weeklyDigests.slice(0, 3).map((digest, index) => (
                <div
                  key={digest.id}
                  className="group bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h4 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">{digest.title}</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">{digest.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Newspaper className="w-4 h-4 mr-2 text-teal-500" />
                      <span className="font-medium">{digest.articles.length} articles</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatDate(digest.publishedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 w-12 h-12 rounded-2xl flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Biology Blog</h3>
                  <p className="text-gray-600">Expert insights & analysis</p>
                </div>
              </div>
              <button
                onClick={() => setView('blog')}
                className="group flex items-center text-cyan-600 font-semibold hover:text-cyan-700 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="space-y-6">
              {blogPosts.slice(0, 3).map((post, index) => (
                <div
                  key={post.id}
                  className="group bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-gray-800 group-hover:text-cyan-600 transition-colors">{post.title}</h4>
                    {post.featured && (
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 text-xs rounded-full font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2 text-cyan-500" />
                      <span className="font-medium">By {post.author}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {post.readTime} min read
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

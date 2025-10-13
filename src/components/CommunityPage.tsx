import { useState, useEffect } from 'react';
import { MessageCircle, Plus, Search, Filter, ThumbsUp, Reply, BookOpen, Users, TrendingUp, Clock, Award, Star, Heart, Share2, Flag, Edit3, Trash2, X } from 'lucide-react';
import { NavigationProps } from '../types/navigation';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    badges: string[];
  };
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  views: number;
  isPinned: boolean;
  isSolved: boolean;
  createdAt: string;
  updatedAt: string;
  lastReplyAt?: string;
}

interface Reply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    badges: string[];
  };
  likes: number;
  isAccepted: boolean;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  postCount: number;
  lastPost?: {
    title: string;
    author: string;
    createdAt: string;
  };
}

export default function CommunityPage({ onNavigate }: NavigationProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = () => {
    // Mock data for demonstration
    const mockCategories: Category[] = [
      {
        id: 'general',
        name: 'General Discussion',
        description: 'General biology questions and discussions',
        icon: '💬',
        color: 'bg-blue-100 text-blue-700',
        postCount: 0, // Will be calculated dynamically
        lastPost: {
          title: 'What is the difference between mitosis and meiosis?',
          author: 'BiologyStudent123',
          createdAt: '2 hours ago'
        }
      },
      {
        id: 'genetics',
        name: 'Genetics & Molecular Biology',
        description: 'DNA, inheritance, and genetic engineering discussions',
        icon: '🧪',
        color: 'bg-purple-100 text-purple-700',
        postCount: 0, // Will be calculated dynamically
        lastPost: {
          title: 'CRISPR gene editing applications',
          author: 'GeneExpert',
          createdAt: '4 hours ago'
        }
      },
      {
        id: 'anatomy',
        name: 'Human Anatomy & Physiology',
        description: 'Body systems and their functions',
        icon: '🧠',
        color: 'bg-green-100 text-green-700',
        postCount: 0, // Will be calculated dynamically
        lastPost: {
          title: 'Cardiovascular system questions',
          author: 'MedStudent',
          createdAt: '6 hours ago'
        }
      },
      {
        id: 'microbiology',
        name: 'Microbiology & Virology',
        description: 'Bacteria, viruses, and microorganisms',
        icon: '🧫',
        color: 'bg-orange-100 text-orange-700',
        postCount: 0, // Will be calculated dynamically
        lastPost: {
          title: 'Antibiotic resistance mechanisms',
          author: 'Microbiologist',
          createdAt: '1 day ago'
        }
      },
      {
        id: 'study-help',
        name: 'Study Help & Tips',
        description: 'Study strategies and learning tips',
        icon: '📚',
        color: 'bg-yellow-100 text-yellow-700',
        postCount: 0, // Will be calculated dynamically
        lastPost: {
          title: 'Best way to memorize biochemical pathways?',
          author: 'StudyBuddy',
          createdAt: '3 hours ago'
        }
      },
      {
        id: 'career',
        name: 'Career & Education',
        description: 'Biology careers and educational paths',
        icon: '🎓',
        color: 'bg-indigo-100 text-indigo-700',
        postCount: 0, // Will be calculated dynamically
        lastPost: {
          title: 'Research opportunities for undergraduates',
          author: 'FutureScientist',
          createdAt: '5 hours ago'
        }
      }
    ];

    const mockPosts: Post[] = [
      {
        id: '1',
        title: 'What is the difference between mitosis and meiosis?',
        content: 'I\'m studying cell division and I\'m having trouble understanding the key differences between mitosis and meiosis. Can someone explain the main differences and when each process occurs?',
        author: {
          id: 'user1',
          name: 'BiologyStudent123',
          avatar: '👨‍🎓',
          level: 'beginner',
          badges: ['New Member', 'Helpful']
        },
        category: 'general',
        tags: ['cell-division', 'mitosis', 'meiosis', 'genetics'],
        likes: 12,
        replies: 5,
        views: 89,
        isPinned: false,
        isSolved: true,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        lastReplyAt: '2024-01-15T14:20:00Z'
      },
      {
        id: '2',
        title: 'CRISPR gene editing applications in medicine',
        content: 'I\'ve been reading about CRISPR and its potential applications in medicine. What are some of the most promising current and future applications? Are there any ethical concerns we should be aware of?',
        author: {
          id: 'user2',
          name: 'GeneExpert',
          avatar: '👩‍🔬',
          level: 'advanced',
          badges: ['Expert', 'Verified', 'Top Contributor']
        },
        category: 'genetics',
        tags: ['crispr', 'gene-editing', 'medicine', 'ethics'],
        likes: 28,
        replies: 12,
        views: 156,
        isPinned: true,
        isSolved: false,
        createdAt: '2024-01-14T16:45:00Z',
        updatedAt: '2024-01-14T16:45:00Z',
        lastReplyAt: '2024-01-15T09:15:00Z'
      },
      {
        id: '3',
        title: 'Best way to memorize biochemical pathways?',
        content: 'I\'m struggling to memorize all the biochemical pathways for my biochemistry exam. Does anyone have any effective memorization techniques or study strategies?',
        author: {
          id: 'user3',
          name: 'StudyBuddy',
          avatar: '👨‍💻',
          level: 'intermediate',
          badges: ['Study Helper', 'Active Member']
        },
        category: 'study-help',
        tags: ['biochemistry', 'study-tips', 'memorization', 'pathways'],
        likes: 18,
        replies: 8,
        views: 124,
        isPinned: false,
        isSolved: false,
        createdAt: '2024-01-15T08:20:00Z',
        updatedAt: '2024-01-15T08:20:00Z',
        lastReplyAt: '2024-01-15T11:30:00Z'
      },
      {
        id: '4',
        title: 'Understanding the cardiovascular system',
        content: 'Can someone explain how blood flows through the heart and the role of each chamber? I\'m particularly confused about the pulmonary and systemic circuits.',
        author: {
          id: 'user4',
          name: 'MedStudent',
          avatar: '👩‍⚕️',
          level: 'intermediate',
          badges: ['Medical Student', 'Helpful']
        },
        category: 'anatomy',
        tags: ['cardiovascular', 'heart', 'blood-flow', 'anatomy'],
        likes: 15,
        replies: 6,
        views: 98,
        isPinned: false,
        isSolved: true,
        createdAt: '2024-01-14T20:10:00Z',
        updatedAt: '2024-01-14T20:10:00Z',
        lastReplyAt: '2024-01-15T07:45:00Z'
      },
      {
        id: '5',
        title: 'Antibiotic resistance mechanisms',
        content: 'I\'m researching antibiotic resistance for a project. What are the main mechanisms by which bacteria develop resistance to antibiotics?',
        author: {
          id: 'user5',
          name: 'Microbiologist',
          avatar: '👨‍🔬',
          level: 'advanced',
          badges: ['Expert', 'Researcher', 'Top Contributor']
        },
        category: 'microbiology',
        tags: ['antibiotics', 'resistance', 'bacteria', 'mechanisms'],
        likes: 22,
        replies: 9,
        views: 145,
        isPinned: false,
        isSolved: false,
        createdAt: '2024-01-13T14:30:00Z',
        updatedAt: '2024-01-13T14:30:00Z',
        lastReplyAt: '2024-01-14T16:20:00Z'
      }
    ];

    const mockReplies: Reply[] = [
      {
        id: 'reply1',
        content: 'Great question! The main differences are:\n\n**Mitosis:**\n- Produces 2 identical diploid cells\n- Occurs in somatic cells\n- Used for growth and repair\n- Single division\n\n**Meiosis:**\n- Produces 4 genetically different haploid cells\n- Occurs in germ cells\n- Used for sexual reproduction\n- Two divisions (meiosis I and II)\n\nThe key is that mitosis maintains chromosome number while meiosis reduces it by half.',
        author: {
          id: 'user6',
          name: 'CellBiologyExpert',
          avatar: '👩‍🔬',
          level: 'advanced',
          badges: ['Expert', 'Verified']
        },
        likes: 8,
        isAccepted: true,
        createdAt: '2024-01-15T11:15:00Z'
      },
      {
        id: 'reply2',
        content: 'I found this diagram really helpful when I was learning about it. The main thing to remember is that mitosis = identical cells, meiosis = genetic diversity!',
        author: {
          id: 'user7',
          name: 'BioStudent2024',
          avatar: '👨‍🎓',
          level: 'beginner',
          badges: ['New Member']
        },
        likes: 3,
        isAccepted: false,
        createdAt: '2024-01-15T14:20:00Z'
      }
    ];

    // Calculate actual post counts for each category
    const categoriesWithCounts = mockCategories.map(category => ({
      ...category,
      postCount: mockPosts.filter(post => post.category === category.id).length
    }));

    setCategories(categoriesWithCounts);
    setPosts(mockPosts);
    setReplies(mockReplies);
    setLoading(false);
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.likes - a.likes;
      case 'trending':
        return (b.likes + b.replies + b.views) - (a.likes + a.replies + a.views);
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <button
            onClick={() => setSelectedPost(null)}
            className="text-teal-600 hover:text-teal-700 font-semibold mb-6 flex items-center"
          >
            ← Back to Community
          </button>

          {/* Post Detail */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {selectedPost.isPinned && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">
                      📌 Pinned
                    </span>
                  )}
                  {selectedPost.isSolved && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                      ✅ Solved
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(selectedPost.author.level)}`}>
                    {selectedPost.author.level}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">{selectedPost.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedPost.author.avatar}</span>
                    <span className="font-medium">{selectedPost.author.name}</span>
                    <div className="flex gap-1">
                      {selectedPost.author.badges.map((badge, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 text-xs px-1 py-0.5 rounded">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span>•</span>
                  <span>{formatTimeAgo(selectedPost.createdAt)}</span>
                  <span>•</span>
                  <span>{selectedPost.views} views</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedPost.content}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{selectedPost.likes}</span>
                </button>
                <div className="flex gap-2">
                  {selectedPost.tags.map((tag, index) => (
                    <span key={index} className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Replies */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
            </h2>
            
            <div className="space-y-6">
              {replies.map((reply) => (
                <div key={reply.id} className="border-l-4 border-teal-500 pl-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{reply.author.avatar}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">{reply.author.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(reply.author.level)}`}>
                            {reply.author.level}
                          </span>
                          {reply.isAccepted && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                              ✅ Accepted Answer
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {reply.author.badges.map((badge, index) => (
                            <span key={index} className="bg-blue-100 text-blue-700 text-xs px-1 py-0.5 rounded">
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{formatTimeAgo(reply.createdAt)}</span>
                  </div>
                  
                  <div className="prose max-w-none mb-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{reply.content}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{reply.likes}</span>
                    </button>
                    <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Post a Reply</h3>
              <div className="space-y-4">
                <textarea
                  placeholder="Share your thoughts and help the community..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Post Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <MessageCircle className="w-8 h-8 text-teal-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Biology Community</h1>
                <p className="text-gray-600">Connect, learn, and share with fellow biology enthusiasts</p>
              </div>
            </div>
            <button
              onClick={() => setShowNewPost(true)}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search discussions, questions, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Categories</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-teal-100 text-teal-700 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>All Discussions</span>
                    <span className="text-sm text-gray-500">{posts.length}</span>
                  </div>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-teal-100 text-teal-700 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{category.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.postCount} posts</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {sortedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {post.isPinned && (
                          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">
                            📌 Pinned
                          </span>
                        )}
                        {post.isSolved && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            ✅ Solved
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(post.author.level)}`}>
                          {post.author.level}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-teal-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{post.author.avatar}</span>
                          <span className="font-medium">{post.author.name}</span>
                        </div>
                        <span>•</span>
                        <span>{formatTimeAgo(post.createdAt)}</span>
                        <span>•</span>
                        <span>{post.views} views</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Reply className="w-4 h-4" />
                        <span>{post.replies}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                      )}
                    </div>
                    {post.lastReplyAt && (
                      <div className="text-xs text-gray-500">
                        Last reply {formatTimeAgo(post.lastReplyAt)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {sortedPosts.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No discussions found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery ? 'Try adjusting your search terms' : 'Be the first to start a discussion in this category'}
                </p>
                <button
                  onClick={() => setShowNewPost(true)}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Start a Discussion
                </button>
              </div>
            )}
          </div>
        </div>

        {/* New Post Modal */}
        {showNewPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Create New Post</h2>
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      placeholder="What's your question or topic?"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea
                      placeholder="Provide details, ask your question, or share your thoughts..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                      rows={6}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g., genetics, cell-biology, study-help"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowNewPost(false)}
                      className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Post Discussion
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

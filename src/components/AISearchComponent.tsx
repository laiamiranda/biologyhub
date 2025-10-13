import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, TrendingUp, Clock, BookOpen, Brain, Zap } from 'lucide-react';
import { aiSearchService, SearchResult, Recommendation } from '../lib/aiSearch';
import { NavigationProps } from '../types/navigation';

interface AISearchComponentProps extends NavigationProps {
  onClose?: () => void;
  placeholder?: string;
  showRecommendations?: boolean;
}

export default function AISearchComponent({ 
  onNavigate, 
  onClose, 
  placeholder = "Search with AI...",
  showRecommendations = true 
}: AISearchComponentProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchAnalysis, setSearchAnalysis] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const stored = localStorage.getItem('recent_searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }

    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Load recommendations when component mounts
    if (showRecommendations) {
      loadRecommendations();
    }
  }, [showRecommendations]);

  useEffect(() => {
    // Handle clicks outside to close suggestions
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadRecommendations = async () => {
    try {
      // Get recommendations based on a completed track (for demo)
      const recs = await aiSearchService.getRecommendations('track-1', 'track', 6);
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSuggestions(false);

    try {
      // Add to recent searches
      const newRecentSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recent_searches', JSON.stringify(newRecentSearches));

      // Perform AI search
      const searchResults = await aiSearchService.semanticSearch(searchQuery, 10);
      
      // Filter results based on selected filters
      let filteredResults = searchResults;
      
      if (selectedCategory !== 'all') {
        filteredResults = filteredResults.filter(r => r.category === selectedCategory);
      }
      
      if (selectedType !== 'all') {
        filteredResults = filteredResults.filter(r => r.type === selectedType);
      }

      setResults(filteredResults);

      // Analyze search query
      const analysis = await aiSearchService.analyzeSearchQuery(searchQuery);
      setSearchAnalysis(analysis);

    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = async (value: string) => {
    setQuery(value);
    
    if (value.length > 2) {
      try {
        const suggestions = await aiSearchService.generateSearchSuggestions(value);
        setSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Failed to generate suggestions:', error);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleResultClick = (result: SearchResult) => {
    // Navigate based on result type
    switch (result.type) {
      case 'track':
        onNavigate('track', { id: result.id });
        break;
      case 'lesson':
        onNavigate('lesson', { id: result.id });
        break;
      case 'glossary':
        onNavigate('glossary');
        break;
      case 'news':
        onNavigate('news');
        break;
    }
    
    if (onClose) onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'track': return <BookOpen className="w-4 h-4" />;
      case 'lesson': return <Brain className="w-4 h-4" />;
      case 'glossary': return <Search className="w-4 h-4" />;
      case 'news': return <TrendingUp className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'track': return 'bg-blue-100 text-blue-700';
      case 'lesson': return 'bg-green-100 text-green-700';
      case 'glossary': return 'bg-purple-100 text-purple-700';
      case 'news': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            } else if (e.key === 'Escape') {
              setShowSuggestions(false);
              if (onClose) onClose();
            }
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-16 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-lg"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {isSearching ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
          ) : (
            <button
              onClick={() => handleSearch()}
              className="p-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
            >
              <Sparkles className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
          {suggestions.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Suggestions
              </h3>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {recentSearches.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Recent Searches
              </h3>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          {/* Search Analysis */}
          {searchAnalysis && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Brain className="w-5 h-5 text-teal-600 mr-2" />
                <h3 className="font-semibold text-teal-800">Search Analysis</h3>
              </div>
              <p className="text-sm text-teal-700 mb-2">
                Intent: <span className="capitalize">{searchAnalysis.intent}</span>
              </p>
              {searchAnalysis.suggestedFilters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-teal-700">Suggested filters:</span>
                  {searchAnalysis.suggestedFilters.map((filter: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full"
                    >
                      {filter}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Categories</option>
              <option value="genetics">Genetics</option>
              <option value="cell-biology">Cell Biology</option>
              <option value="molecular-biology">Molecular Biology</option>
              <option value="biochemistry">Biochemistry</option>
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Types</option>
              <option value="track">Tracks</option>
              <option value="lesson">Lessons</option>
              <option value="glossary">Glossary</option>
              <option value="news">News</option>
            </select>
          </div>

          {/* Results List */}
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-teal-300 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`p-1 rounded ${getTypeColor(result.type)}`}>
                      {getTypeIcon(result.type)}
                    </span>
                    <h3 className="font-semibold text-gray-800">{result.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {result.difficulty && (
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(result.difficulty)}`}>
                        {result.difficulty}
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {Math.round(result.relevanceScore * 100)}% match
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{result.content}</p>
                {result.description && (
                  <p className="text-xs text-gray-500">{result.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {showRecommendations && recommendations.length > 0 && results.length === 0 && (
        <div className="mt-6">
          <div className="flex items-center mb-4">
            <Zap className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">AI Recommendations</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                onClick={() => handleResultClick({
                  id: rec.id,
                  title: rec.title,
                  content: rec.reason,
                  type: rec.type,
                  category: rec.category || 'general',
                  relevanceScore: rec.confidence,
                  difficulty: rec.difficulty,
                  description: rec.description
                })}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`p-1 rounded ${getTypeColor(rec.type)}`}>
                    {getTypeIcon(rec.type)}
                  </span>
                  <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-600">
                    {Math.round(rec.confidence * 100)}% confidence
                  </span>
                  {rec.difficulty && (
                    <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(rec.difficulty)}`}>
                      {rec.difficulty}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {results.length === 0 && query && !isSearching && (
        <div className="mt-6 text-center py-8">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No results found</h3>
          <p className="text-gray-500 mb-4">Try different keywords or check your spelling</p>
          <button
            onClick={() => setQuery('')}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}

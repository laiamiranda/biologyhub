import { useEffect, useState } from 'react';
import { Track, Category, getTracks, getCategories } from '../lib/api';
import { Clock, Search, Filter, BookOpen, ArrowRight, Star, Users, Award } from 'lucide-react';
import { NavigationProps } from '../types/navigation';

interface TracksPageProps extends NavigationProps {
  selectedCategory?: Category;
}

export default function TracksPage({ onNavigate, selectedCategory }: TracksPageProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    selectedCategory?.id || null
  );
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedCategoryId, difficultyFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('Loading tracks data...');
      const [tracksData, categoriesData] = await Promise.all([
        getTracks({
          category_id: selectedCategoryId || undefined,
          difficulty: difficultyFilter || undefined,
        }),
        getCategories(),
      ]);

      console.log('Tracks loaded:', tracksData.length, 'tracks');
      console.log('Categories loaded:', categoriesData.length, 'categories');
      
      setTracks(tracksData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTracks = tracks.filter((track) => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategoryId || track.category_id === selectedCategoryId;
    const matchesDifficulty = !difficultyFilter || track.difficulty_level === difficultyFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500 text-white';
      case 'intermediate':
        return 'bg-yellow-500 text-white';
      case 'advanced':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

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
              <BookOpen className="w-4 h-4 mr-2" />
              Learning Tracks
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              {selectedCategory ? selectedCategory.name : 'All Learning Tracks'}
            </h1>
            
            <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
              {selectedCategory
                ? selectedCategory.description
                : 'Explore comprehensive biology courses organized by topic.'}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-7xl">

        {/* Modern Search and Filter Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tracks, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg transition-all duration-300 hover:border-gray-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategoryId || ''}
                  onChange={(e) => setSelectedCategoryId(e.target.value || null)}
                  className="pl-12 pr-10 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white text-lg transition-all duration-300 hover:border-gray-300 min-w-[200px]"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={difficultyFilter || ''}
                onChange={(e) => setDifficultyFilter(e.target.value || null)}
                className="px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white text-lg transition-all duration-300 hover:border-gray-300 min-w-[150px]"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading tracks...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {filteredTracks.length} Track{filteredTracks.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-gray-600">
                  {searchQuery && `Searching for "${searchQuery}"`}
                  {selectedCategoryId && ` in ${categories.find(c => c.id === selectedCategoryId)?.name}`}
                  {difficultyFilter && ` at ${difficultyFilter} level`}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{tracks.length} total tracks</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    <span>Expert curated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Tracks Grid */}
            {filteredTracks.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredTracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => onNavigate('track', track)}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer border border-gray-100"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Track Header */}
                  <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 p-6 text-white relative overflow-hidden h-[160px] flex flex-col justify-between">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <div className="relative flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-2xl flex items-center justify-center">
                          <span className="text-lg font-bold">#{track.track_number}</span>
                        </div>
                        <span
                          className={`text-xs px-4 py-2 rounded-full font-semibold ${getDifficultyColor(track.difficulty_level)}`}
                        >
                          {track.difficulty_level}
                        </span>
                      </div>
                      <div className="flex-1 flex items-center">
                        <h3 className="text-xl font-bold group-hover:text-cyan-100 transition-colors line-clamp-2">
                          {track.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Track Content */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {track.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2 text-teal-500" />
                        <span className="font-medium">{track.estimated_hours} hours</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2 text-cyan-500" />
                        <span className="font-medium">Self-paced</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors">
                        <span>Start Learning</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No tracks found</h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  {searchQuery 
                    ? `No tracks match "${searchQuery}". Try adjusting your search terms.`
                    : 'No tracks match your current filters. Try changing your search criteria.'
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategoryId(null);
                    setDifficultyFilter(null);
                  }}
                  className="px-6 py-3 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition-colors font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/index.ts';
import type { PromptFilters } from '@/types/prompt.types.ts';
import { PromptCard } from './components/PromptCard.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Search, Plus, Filter } from 'lucide-react';

export const PromptBrowsePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState<PromptFilters>({
    search: '',
    category: 'all',
    sortBy: 'newest',
    page: 0,
    size: 12,
  });

  const [searchInput, setSearchInput] = useState('');

  // Fetch prompts
  const { data, isLoading, error } = useQuery({
    queryKey: ['prompts', filters],
    queryFn: () => api.prompts.getPrompts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.getCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: (promptId: string) => api.prompts.toggleLike(promptId),
    onSuccess: () => {
      // Refetch prompts to get updated like counts
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });

  const handleLike = (promptId: string) => {
    likeMutation.mutate(promptId);
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchInput, page: 0 }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category, page: 0 }));
  };

  const handleSortChange = (sortBy: PromptFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Community Hero Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-10 shadow-lg">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Community Prompts
            </h1>
            <p className="text-blue-100 text-base">
              Discover, share, and collaborate on AI prompts with our creative community
            </p>
          </div>
          <Button
            onClick={() => navigate('/prompts/create')}
            size="lg"
            className="bg-white text-blue-700 hover:bg-blue-50 shadow-md font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Share Your Prompt
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-5">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search prompts by title, description, or tags..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 h-11 px-6">
            Search
          </Button>
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Filter className="w-4 h-4" />
            <span>Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filters.category === 'all' ? 'default' : 'outline'}
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                filters.category === 'all'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 bg-white'
              }`}
              onClick={() => handleCategoryChange('all')}
            >
              All Categories
            </Badge>
            {categories?.map((category) => (
              <Badge
                key={category.id}
                variant={filters.category === category.name ? 'default' : 'outline'}
                className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                  filters.category === category.name
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 bg-white'
                }`}
                onClick={() => handleCategoryChange(category.name)}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-75">({category.promptCount})</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-3 text-sm flex-wrap">
          <span className="text-gray-700 font-semibold">Sort by:</span>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'newest', label: 'Newest First' },
              { value: 'popular', label: 'Most Popular' },
              { value: 'top-rated', label: 'Top Rated' },
              { value: 'most-used', label: 'Most Used' },
            ].map((option) => (
              <Button
                key={option.value}
                variant={filters.sortBy === option.value ? 'default' : 'outline'}
                size="sm"
                className={filters.sortBy === option.value
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600'
                  : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 bg-white'
                }
                onClick={() => handleSortChange(option.value as PromptFilters['sortBy'])}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      {data && (
        <div className="text-sm text-muted-foreground">
          Showing {data.content.length} of {data.totalElements} prompts
        </div>
      )}

      {/* Prompts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">Error loading prompts. Please try again.</p>
        </div>
      ) : data && data.content.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No prompts found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filters
          </p>
          <Button onClick={() => setFilters({ search: '', category: 'all', sortBy: 'newest', page: 0, size: 12 })}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.content.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} onLike={handleLike} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            disabled={filters.page === 0}
            onClick={() => handlePageChange(filters.page! - 1)}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            {[...Array(data.totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={filters.page === i ? 'default' : 'outline'}
                onClick={() => handlePageChange(i)}
                className="w-10"
              >
                {i + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            disabled={filters.page === data.totalPages - 1}
            onClick={() => handlePageChange(filters.page! + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};


import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Crown, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Card } from '@/components/ui/card.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { api } from '@/api/index.ts';
import { MarketplaceCard } from './components/MarketplaceCard.tsx';
import type { MarketplaceFilters } from '@/types/marketplace.types.ts';

export const MarketplaceBrowsePage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<MarketplaceFilters>({
    sortBy: 'newest',
    category: 'all',
  });
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);

  // Fetch marketplace listings
  const { data, isLoading, error } = useQuery({
    queryKey: ['marketplace', 'listings', filters, page],
    queryFn: () => api.marketplace.getMarketplaceListings(filters, page, 12),
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.getCategories(),
  });

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchInput }));
    setPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category: category === 'all' ? undefined : category }));
    setPage(1);
  };

  const handleSortChange = (sortBy: MarketplaceFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
    setPage(1);
  };

  const handlePriceRangeChange = (min?: number, max?: number) => {
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
    setPage(1);
  };

  const handlePurchase = (listingId: string) => {
    navigate(`/marketplace/${listingId}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Marketplace Header - Optional Feature */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 p-8 md:p-10 shadow-lg">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Premium Marketplace
            </h1>
            <p className="text-green-100 text-base">
              Optional: Purchase premium prompts or monetize your best creations
            </p>
          </div>
          <Button
            onClick={() => navigate('/prompts')}
            size="lg"
            variant="outline"
            className="bg-white text-green-700 hover:bg-green-50 shadow-md font-semibold border-2 border-white"
          >
            Back to Community
          </Button>
        </div>
      </div>

      {/* Quick Links to Advanced Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/marketplace/subscriptions')}>
          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Premium Subscriptions</h3>
              <p className="text-sm text-gray-600">Get unlimited access with exclusive benefits and discounts</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={(e) => { e.stopPropagation(); navigate('/marketplace/subscriptions'); }}>
              View Plans
            </Button>
          </div>
        </Card>

        <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/marketplace/affiliates')}>
          <div className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center flex-shrink-0">
              <Link2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Affiliate Program</h3>
              <p className="text-sm text-gray-600">Earn commission by referring new users and sales</p>
            </div>
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={(e) => { e.stopPropagation(); navigate('/marketplace/affiliates'); }}>
              Start Earning
            </Button>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-5">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search premium prompts..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 h-11 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
            />
          </div>
          <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700 h-11 px-6">
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
              variant={filters.category === 'all' || !filters.category ? 'default' : 'outline'}
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                filters.category === 'all' || !filters.category
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                  : 'border-gray-300 hover:border-green-500 hover:bg-green-50 bg-white'
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
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                    : 'border-gray-300 hover:border-green-500 hover:bg-green-50 bg-white'
                }`}
                onClick={() => handleCategoryChange(category.name)}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-75">({category.promptCount})</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Sort and Price Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort Options */}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-700 font-semibold">Sort by:</span>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'newest', label: 'Newest First' },
                { value: 'popular', label: 'Most Popular' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'top-rated', label: 'Top Rated' },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={filters.sortBy === option.value ? 'default' : 'outline'}
                  size="sm"
                  className={filters.sortBy === option.value
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                    : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 bg-white'
                  }
                  onClick={() => handleSortChange(option.value as MarketplaceFilters['sortBy'])}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Range Quick Filters */}
          <div className="flex items-center gap-3 text-sm ml-auto">
            <span className="text-gray-700 font-semibold">Price Range:</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 hover:border-green-500 hover:bg-green-50"
                onClick={() => handlePriceRangeChange(undefined, 20)}
              >
                Under $20
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 hover:border-green-500 hover:bg-green-50"
                onClick={() => handlePriceRangeChange(20, 50)}
              >
                $20 - $50
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 hover:border-green-500 hover:bg-green-50"
                onClick={() => handlePriceRangeChange(50, undefined)}
              >
                Over $50
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 hover:border-gray-400"
                onClick={() => handlePriceRangeChange(undefined, undefined)}
              >
                All Prices
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {data && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{data.listings.length}</span> of{' '}
            <span className="font-semibold">{data.total}</span> premium prompts
          </p>
        </div>
      )}

      {/* Listings Grid */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600 font-medium">Failed to load marketplace listings</p>
          <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !error && data && (
        <>
          {data.listings.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
              <Button onClick={() => {
                setFilters({ sortBy: 'newest', category: 'all' });
                setSearchInput('');
                setPage(1);
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.listings.map((listing) => (
                <MarketplaceCard
                  key={listing.id}
                  listing={listing}
                  onPurchase={() => handlePurchase(listing.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {[...Array(data.totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Show first, last, current, and pages around current
                  if (
                    pageNum === 1 ||
                    pageNum === data.totalPages ||
                    (pageNum >= page - 1 && pageNum <= page + 1)
                  ) {
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        className={page === pageNum ? 'bg-green-600 hover:bg-green-700' : ''}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  } else if (pageNum === page - 2 || pageNum === page + 2) {
                    return <span key={pageNum} className="px-2">...</span>;
                  }
                  return null;
                })}
              </div>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === data.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};


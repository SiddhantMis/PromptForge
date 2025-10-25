import { Star, TrendingUp, Eye, ShoppingCart, Crown } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import type { MarketplaceListing } from '@/types/marketplace.types.ts';

interface MarketplaceCardProps {
  listing: MarketplaceListing;
  onPurchase: () => void;
}

export const MarketplaceCard = ({ listing, onPurchase }: MarketplaceCardProps) => {
  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return String(count);
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-gray-200 bg-white">
      {/* Professional top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 to-emerald-600"></div>

      {/* Premium Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-md">
          <Crown className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      </div>

      <CardHeader className="pb-3 pt-5">
        {/* Category Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 border border-green-200">
            {listing.prompt.category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors">
          {listing.prompt.title}
        </h3>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {listing.prompt.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{formatCount(listing.prompt.viewsCount)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-gray-700">{listing.prompt.averageRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-green-600" />
            <span className="font-medium text-gray-700">{formatCount(listing.salesCount)} sales</span>
          </div>
        </div>

        {/* Seller */}
        <div className="flex items-center gap-2 text-sm text-gray-600 pb-3 border-b border-gray-100">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
            {listing.seller.firstName.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">
            by <span className="text-gray-900">{listing.seller.firstName} {listing.seller.lastName}</span>
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4">
        {/* Price */}
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-green-600">
            ${listing.price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">One-time purchase</span>
        </div>

        {/* Purchase Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onPurchase();
          }}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};


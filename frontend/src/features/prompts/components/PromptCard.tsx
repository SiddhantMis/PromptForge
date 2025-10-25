import { useNavigate } from 'react-router-dom';
import type { Prompt } from '@/types/prompt.types.ts';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Heart, Eye, Star, TrendingUp, Crown } from 'lucide-react';
import { cn } from '@/utils/cn.ts';

interface PromptCardProps {
  prompt: Prompt;
  onLike?: (promptId: string) => void;
}

export const PromptCard = ({ prompt, onLike }: PromptCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/prompts/${prompt.id}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(prompt.id);
  };

  // Format numbers (1000 -> 1K, 1000000 -> 1M)
  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return String(count);
  };

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-gray-200 bg-white hover:border-blue-300"
      onClick={handleCardClick}
    >
      {/* Professional top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

      {/* Premium Badge */}
      {prompt.isPremium && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-md">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3 pt-5">
        {/* Category Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 border border-blue-200">
            {prompt.category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {prompt.title}
        </h3>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {prompt.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200"
            >
              {tag}
            </span>
          ))}
          {prompt.tags.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
              +{prompt.tags.length - 3}
            </span>
          )}
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
            {prompt.authorName.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{prompt.authorName}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/50 flex items-center justify-between">
        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {/* Likes */}
          <button
            onClick={handleLikeClick}
            className={cn(
              "flex items-center gap-1 transition-colors hover:text-red-500",
              prompt.userHasLiked && "text-red-500"
            )}
          >
            <Heart
              className={cn(
                "w-4 h-4",
                prompt.userHasLiked && "fill-current"
              )}
            />
            <span className="font-medium">{formatCount(prompt.likesCount)}</span>
          </button>

          {/* Views */}
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{formatCount(prompt.viewsCount)}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-foreground font-medium">
              {prompt.averageRating.toFixed(1)}
            </span>
          </div>

          {/* Usage */}
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{formatCount(prompt.usageCount)}</span>
          </div>
        </div>

        {/* Price (if premium) */}
        {prompt.isPremium && prompt.price && (
          <div className="text-sm font-bold text-primary">
            ${prompt.price.toFixed(2)}
          </div>
        )}
      </CardFooter>

    </Card>
  );
};


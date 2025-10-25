import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/index.ts';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Heart, Eye, Star, TrendingUp, Copy, Edit, ArrowLeft, Crown, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn.ts';
import { StarRating } from '@/components/ui/star-rating.tsx';
import { CommentsSection } from '@/features/social/components/CommentsSection.tsx';

export const PromptDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [userRating, setUserRating] = useState(0);

  // Fetch prompt details
  const { data: prompt, isLoading, error } = useQuery({
    queryKey: ['prompt', id],
    queryFn: () => api.prompts.getPromptById(id!),
    enabled: !!id,
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: () => api.prompts.toggleLike(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompt', id] });
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });

  const handleCopy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    // TODO: Send rating to backend
    console.log('User rated:', rating);
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return String(count);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Prompt Not Found</h2>
        <p className="text-muted-foreground mb-6">The prompt you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/prompts')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/prompts" className="hover:text-foreground transition-colors">
          Prompts
        </Link>
        <span>/</span>
        <span className="text-foreground">{prompt.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold">{prompt.title}</h1>
            {prompt.isPremium && (
              <Badge className="bg-amber-500 text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">{prompt.description}</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleLike} variant={prompt.userHasLiked ? 'default' : 'outline'}>
            <Heart className={cn("w-4 h-4 mr-2", prompt.userHasLiked && "fill-current")} />
            {formatCount(prompt.likesCount)}
          </Button>
          
          <Button onClick={handleCopy} variant="outline">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
          
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-lg text-gray-900">{formatCount(prompt.viewsCount)}</span>
          <span className="text-sm text-gray-600">views</span>
        </div>
        
        <Separator orientation="vertical" className="h-8 bg-gray-200" />
        
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-current" />
          <span className="font-semibold text-lg text-gray-900">{prompt.averageRating.toFixed(1)}</span>
          <span className="text-sm text-gray-600">({prompt.ratingsCount} ratings)</span>
        </div>
        
        <Separator orientation="vertical" className="h-8 bg-gray-200" />
        
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-lg text-gray-900">{formatCount(prompt.usageCount)}</span>
          <span className="text-sm text-gray-600">uses</span>
        </div>
        
        <Separator orientation="vertical" className="h-8 bg-gray-200" />
        
        <Badge className="bg-blue-100 text-blue-700 font-medium px-4 py-2 border border-blue-200">{prompt.category}</Badge>
        
        <div className="ml-auto text-sm text-gray-600">
          Updated {formatDate(prompt.updatedAt)}
        </div>
      </div>

      {/* Rating Section */}
      <Card className="bg-blue-50 border border-blue-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Rate this prompt</h3>
              <p className="text-sm text-gray-600">Help others by sharing your experience</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StarRating
                rating={userRating}
                onRatingChange={handleRating}
                size="lg"
              />
              {userRating > 0 && (
                <span className="text-sm font-medium text-blue-700">
                  You rated: {userRating} {userRating === 1 ? 'star' : 'stars'}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prompt Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Prompt Content</h2>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap">
                {prompt.content}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {prompt.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author Card */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Author</h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
                  {prompt.authorName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{prompt.authorName}</p>
                  <p className="text-sm text-muted-foreground">@{prompt.authorUsername}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Details</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={prompt.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                  {prompt.status}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Visibility</span>
                <span className="font-medium">{prompt.visibility}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{formatDate(prompt.createdAt)}</span>
              </div>
              {prompt.isPremium && prompt.price && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-bold text-primary">${prompt.price.toFixed(2)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CTA Card */}
          {prompt.isPremium && (
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-primary/20">
              <CardContent className="p-6 text-center">
                <Crown className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                <h3 className="font-bold mb-2">Premium Prompt</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get full access to this premium prompt
                </p>
                <Button className="w-full">
                  Purchase for ${prompt.price?.toFixed(2)}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <CommentsSection promptId={id!} />
    </div>
  );
};


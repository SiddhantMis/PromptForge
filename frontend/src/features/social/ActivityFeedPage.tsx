import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Activity as ActivityIcon, Heart, MessageSquare, FileText, UserPlus, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { api } from '@/api/index.ts';
import type { Activity } from '@/types/social.types.ts';

export const ActivityFeedPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['activityFeed', page],
    queryFn: () => api.social.getActivityFeed(page, 20),
  });

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'prompt_created':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'prompt_liked':
        return <Heart className="w-5 h-5 text-red-600" />;
      case 'comment_added':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-purple-600" />;
      case 'prompt_purchased':
        return <ShoppingBag className="w-5 h-5 text-amber-600" />;
      default:
        return <ActivityIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleActivityClick = (activity: Activity) => {
    if (activity.targetType === 'prompt' && activity.targetId) {
      navigate(`/prompts/${activity.targetId}`);
    } else if (activity.type === 'follow' && activity.userId) {
      navigate(`/profile/${activity.userId}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 p-8 md:p-10 shadow-lg">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <ActivityIcon className="w-8 h-8" />
            Activity Feed
          </h1>
          <p className="text-purple-100 text-base">
            See what people you follow are doing
          </p>
        </div>
      </div>

      {/* Activity List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data && data.activities.length > 0 ? (
        <div className="space-y-4">
          {data.activities.map((activity) => (
            <Card
              key={activity.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleActivityClick(activity)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                      {activity.user.firstName.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getActivityIcon(activity.type)}
                        <span className="font-semibold text-gray-900">
                          {activity.user.firstName} {activity.user.lastName}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatDate(activity.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{activity.message}</p>

                    {/* Related Prompt */}
                    {activity.prompt && (
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {activity.prompt.title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {activity.prompt.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {data.total > 20 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 px-4">
                Page {page} of {Math.ceil(data.total / 20)}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(data.total / 20)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
          <ActivityIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No activity yet</h3>
          <p className="text-gray-600 mb-6">
            Follow other users to see their activity here
          </p>
          <Button onClick={() => navigate('/prompts')}>
            Browse Prompts
          </Button>
        </div>
      )}
    </div>
  );
};


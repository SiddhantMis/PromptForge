import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Heart, TrendingUp, FileText, Users, DollarSign, UserPlus, UserMinus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { api } from '@/api/index.ts';

export const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => api.social.getUserProfile(userId!),
    enabled: !!userId,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (profile?.isFollowing) {
        await api.social.unfollowUser(userId!);
      } else {
        await api.social.followUser(userId!);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
        <p className="text-gray-600">The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-l-4 border-l-blue-600">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0 shadow-lg">
              {profile.user.firstName.charAt(0).toUpperCase()}
              {profile.user.lastName.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.user.firstName} {profile.user.lastName}
              </h1>
              <p className="text-gray-600 mb-1">@{profile.user.username}</p>
              <p className="text-sm text-gray-500">{profile.user.email}</p>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 mt-4">
                <div>
                  <span className="font-bold text-gray-900">{profile.stats.promptsCount}</span>
                  <span className="text-sm text-gray-600 ml-1">prompts</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div>
                  <span className="font-bold text-gray-900">{profile.stats.followersCount}</span>
                  <span className="text-sm text-gray-600 ml-1">followers</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div>
                  <span className="font-bold text-gray-900">{profile.stats.followingCount}</span>
                  <span className="text-sm text-gray-600 ml-1">following</span>
                </div>
              </div>
            </div>

            {/* Follow Button */}
            {userId !== '1' && (
              <Button
                onClick={() => followMutation.mutate()}
                disabled={followMutation.isPending}
                className={
                  profile.isFollowing
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    : 'bg-blue-600 hover:bg-blue-700'
                }
              >
                {profile.isFollowing ? (
                  <>
                    <UserMinus className="w-4 h-4 mr-2" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Prompts Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{profile.stats.promptsCount}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-pink-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Total Likes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-pink-600">{profile.stats.likesReceived}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Followers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{profile.stats.followersCount}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{profile.stats.totalSales}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">
              ${profile.stats.totalEarnings.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Following
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-600">{profile.stats.followingCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Prompts */}
      {profile.recentPrompts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.recentPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => (window.location.href = `/prompts/${prompt.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{prompt.title}</h3>
                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                      {prompt.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{prompt.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {prompt.likesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {prompt.usageCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {profile.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


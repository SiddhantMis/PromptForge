import { useAuthStore } from '@/stores/auth.store.ts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/index.ts';
import { Button } from '@/components/ui/button.tsx';
import { DollarSign, Zap, Activity, Crown, MessageCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Fetch wallet data
  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => api.marketplace.getWallet(),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
        {/* Professional Hero Header */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-8 shadow-lg">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, {user?.firstName}
            </h1>
            <p className="text-blue-100 text-base">
              Join the community, share prompts, and connect with creators
            </p>
          </div>
        </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-blue-700">Total Prompts</CardTitle>
            <CardDescription>Your created prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">0</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-green-700">Total Earnings</CardTitle>
            <CardDescription>Lifetime marketplace revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">
              {wallet ? formatCurrency(wallet.totalEarnings) : '$0'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-amber-700">Wallet Balance</CardTitle>
            <CardDescription>Available to withdraw</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-amber-600">
              {wallet ? formatCurrency(wallet.balance) : '$0'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-indigo-700">Total Spent</CardTitle>
            <CardDescription>Purchases made</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-indigo-600">
              {wallet ? formatCurrency(wallet.totalSpent) : '$0'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Marketplace Quick Actions - Optional/Secondary */}
      {wallet && (wallet.totalEarnings > 0 || wallet.totalSpent > 0) && (
        <Card className="border border-green-200 shadow-sm bg-gradient-to-br from-white to-green-50">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Marketplace Activity
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Optional: Monetize your prompts or purchase premium content
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => navigate('/marketplace')}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Browse
                  </Button>
                  <Button
                    onClick={() => navigate('/marketplace/transactions')}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Transactions
                  </Button>
                </div>
              </div>
              {wallet.balance > 0 && (
                <div className="bg-white rounded-lg border border-green-300 px-4 py-2 text-center">
                  <p className="text-xs text-gray-600">Balance</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(wallet.balance)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Cards Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the Community</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Activity Feed - PRIMARY */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1" onClick={() => navigate('/feed')}>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Activity Feed</h3>
              <p className="text-sm text-gray-600 mb-4">See what the community is creating and get inspired</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                View Feed
              </Button>
            </CardContent>
          </Card>

          {/* Browse Community Prompts */}
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1" onClick={() => navigate('/prompts')}>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Explore Prompts</h3>
              <p className="text-sm text-gray-600 mb-4">Discover prompts, leave comments, and connect with creators</p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Browse Community
              </Button>
            </CardContent>
          </Card>

          {/* My Profile */}
          <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-white hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1" onClick={() => navigate(`/profile/${user?.id}`)}>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">My Profile</h3>
              <p className="text-sm text-gray-600 mb-4">View your prompts, followers, and manage your profile</p>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                View Profile
              </Button>
            </CardContent>
          </Card>

          {/* AI Testing Lab */}
          <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1" onClick={() => navigate('/ai-lab')}>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Testing Lab</h3>
              <p className="text-sm text-gray-600 mb-4">Test your prompts with 5 different AI models</p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Start Testing
              </Button>
            </CardContent>
          </Card>

          {/* Marketplace - OPTIONAL */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1" onClick={() => navigate('/marketplace')}>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Marketplace</h3>
              <p className="text-sm text-gray-600 mb-4">Buy premium prompts or monetize your creations</p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Browse Marketplace
              </Button>
            </CardContent>
          </Card>

          {/* Premium Upgrades - OPTIONAL */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1" onClick={() => navigate('/marketplace/subscriptions')}>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Premium</h3>
              <p className="text-sm text-gray-600 mb-4">Unlock unlimited features with a premium membership</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};


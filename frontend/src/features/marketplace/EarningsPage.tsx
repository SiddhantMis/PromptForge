import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, ShoppingBag, Clock, Crown, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Button } from '@/components/ui/button.tsx';
import { api } from '@/api/index.ts';
import { Separator } from '@/components/ui/separator.tsx';

export const EarningsPage = () => {
  const navigate = useNavigate();
  const { data: earnings, isLoading, error } = useQuery({
    queryKey: ['earnings'],
    queryFn: () => api.marketplace.getEarningsSummary(),
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !earnings) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 font-medium">Failed to load earnings data</p>
        <Button onClick={() => navigate(0)} className="mt-4" variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Professional Hero Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 p-8 md:p-10 shadow-lg">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <DollarSign className="w-8 h-8" />
            Earnings Dashboard
          </h1>
          <p className="text-green-100 text-base">
            Track your sales performance and revenue
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card className="border-l-4 border-l-green-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(earnings.totalRevenue)}
            </p>
            <p className="text-xs text-gray-500 mt-1">All-time earnings</p>
          </CardContent>
        </Card>

        {/* Total Sales */}
        <Card className="border-l-4 border-l-blue-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {earnings.totalSales}
            </p>
            <p className="text-xs text-gray-500 mt-1">Prompts sold</p>
          </CardContent>
        </Card>

        {/* Average Sale */}
        <Card className="border-l-4 border-l-indigo-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              Average Sale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-600">
              {formatCurrency(earnings.averageSalePrice)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Per transaction</p>
          </CardContent>
        </Card>

        {/* Available Balance */}
        <Card className="border-l-4 border-l-amber-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">
              {formatCurrency(wallet?.balance || 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Ready to withdraw</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Prompts */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="w-5 h-5 text-amber-500" />
              Top Selling Prompts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {earnings.topSellingPrompts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No sales yet</p>
                <p className="text-sm mt-1">Start selling your prompts to see them here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {earnings.topSellingPrompts.map((item, index) => (
                  <div key={item.prompt.id}>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 font-bold text-sm flex-shrink-0">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {item.prompt.title}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {item.prompt.category}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3" />
                            {item.salesCount} sales
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {formatCurrency(item.revenue)}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200 font-semibold">
                        {formatCurrency(item.prompt.price || 0)}
                      </Badge>
                    </div>
                    {index < earnings.topSellingPrompts.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {earnings.recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No transactions yet</p>
                <p className="text-sm mt-1">Your sales will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {earnings.recentTransactions.map((transaction, index) => (
                  <div key={transaction.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {transaction.prompt.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Sold to {transaction.buyer.firstName} {transaction.buyer.lastName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(transaction.transactionDate)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-green-600">
                          +{formatCurrency(transaction.amount)}
                        </p>
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs mt-1">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                    {index < earnings.recentTransactions.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card className="border border-blue-200 shadow-md bg-gradient-to-br from-white to-blue-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Ready to withdraw your earnings?
              </h3>
              <p className="text-sm text-gray-600">
                Available balance: <span className="font-bold text-green-600">{formatCurrency(wallet?.balance || 0)}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/marketplace/transactions')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View All Transactions
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => alert('Withdraw functionality would be implemented here')}
                disabled={(wallet?.balance || 0) < 10}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Withdraw Funds
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Receipt, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { api } from '@/api/index.ts';
import type { Transaction } from '@/types/marketplace.types.ts';

export const TransactionHistoryPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions', page],
    queryFn: () => api.marketplace.getTransactions(page, 20),
  });

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
      case 'refunded':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const styles = {
      completed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
      refunded: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    return (
      <Badge className={`${styles[status]} border font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      {/* Professional Hero Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-10 shadow-lg">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Receipt className="w-8 h-8" />
            Transaction History
          </h1>
          <p className="text-blue-100 text-base">
            View your purchase and sales history
          </p>
        </div>
      </div>

      {/* Transactions List */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600 font-medium">Failed to load transactions</p>
          <Button onClick={() => navigate(0)} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !error && data && (
        <>
          {data.transactions.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
              <Receipt className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-600 mb-6">
                Your purchase and sales history will appear here
              </p>
              <Button onClick={() => navigate('/marketplace')}>
                Browse Marketplace
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {data.transactions.map((transaction) => (
                <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Transaction Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(transaction.status)}
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {transaction.prompt.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {transaction.prompt.category}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(transaction.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                          {/* Buyer/Seller */}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">From</p>
                            <p className="text-sm font-medium text-gray-900">
                              {transaction.seller.firstName} {transaction.seller.lastName}
                            </p>
                            <p className="text-xs text-gray-600">@{transaction.seller.username}</p>
                          </div>

                          {/* Date */}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Date</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(transaction.transactionDate)}
                            </p>
                          </div>

                          {/* Payment Method */}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {transaction.paymentMethod.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Amount & Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            ${transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">{transaction.currency}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/prompts/${transaction.promptId}`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Mock download receipt
                              alert('Receipt download would happen here');
                            }}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Receipt
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination (if needed) */}
          {data.total > 20 && (
            <div className="flex items-center justify-center gap-2 mt-8">
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
        </>
      )}
    </div>
  );
};


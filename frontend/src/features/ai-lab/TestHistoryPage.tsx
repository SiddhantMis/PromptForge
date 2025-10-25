import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, Trash2, Bookmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { api } from '@/api/index.ts';

export const TestHistoryPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['testHistory', page],
    queryFn: () => api.aiLab.getTestHistory(page, 20),
  });

  const { data: stats } = useQuery({
    queryKey: ['testStatistics'],
    queryFn: () => api.aiLab.getTestStatistics(),
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-purple-700 p-8 md:p-10 shadow-lg">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <History className="w-8 h-8" />
            Test History
          </h1>
          <p className="text-indigo-100 text-base">
            Review your past AI model tests and results
          </p>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-600">
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-1">Total Tests</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalTests}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-600">
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-1">Tokens Used</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalTokensUsed.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-600">
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-1">Total Cost</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalCost.toFixed(4)}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-600">
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-1">Saved Tests</p>
              <p className="text-2xl font-bold text-amber-600">{stats.savedTests}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Test History List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data && data.tests.length > 0 ? (
        <div className="space-y-4">
          {data.tests.map((test) => (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                        {test.modelName}
                      </Badge>
                      {test.isSaved && (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                          <Bookmark className="w-3 h-3 mr-1 fill-current" />
                          Saved
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">{formatDate(test.createdAt)}</span>
                    </div>

                    <p className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {test.promptText}
                    </p>

                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">{test.response}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{test.tokensUsed} tokens</span>
                      <span>•</span>
                      <span>${test.cost.toFixed(4)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
          <History className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No test history yet</h3>
          <p className="text-gray-600 mb-6">
            Start testing prompts to see your history here
          </p>
          <Button onClick={() => (window.location.href = '/ai-lab')}>
            Start Testing
          </Button>
        </div>
      )}
    </div>
  );
};


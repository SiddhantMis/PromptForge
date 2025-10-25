import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { api } from '@/api/index.ts';

export const AffiliatesDashboard = () => {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState('');

  const { data: stats } = useQuery({
    queryKey: ['affiliateStats'],
    queryFn: () => api.advancedMarketplace.getAffiliateStats(),
  });

  const { data: links } = useQuery({
    queryKey: ['affiliateLinks'],
    queryFn: () => api.advancedMarketplace.getAffiliateLinks(),
  });

  const generateLinkMutation = useMutation({
    mutationFn: () => api.advancedMarketplace.generateAffiliateLink(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliateLinks'] });
      queryClient.invalidateQueries({ queryKey: ['affiliateStats'] });
    },
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-pink-600 to-purple-700 p-8 md:p-10 shadow-lg">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Link2 className="w-8 h-8" />
            Affiliate Program
          </h1>
          <p className="text-pink-100 text-base">
            Earn commission by referring new users and prompt sales
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-600">
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-1">Total Clicks</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalClicks}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-600">
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-1">Conversions</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalConversions}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-600">
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-purple-600">{stats.conversionRate.toFixed(1)}%</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-600">
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-amber-600">${stats.totalEarnings.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generate Link */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Affiliate Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              onClick={() => generateLinkMutation.mutate()}
              disabled={generateLinkMutation.isPending}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {generateLinkMutation.isPending ? 'Generating...' : 'Generate New Link'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Links List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Affiliate Links</CardTitle>
        </CardHeader>
        <CardContent>
          {links && links.length > 0 ? (
            <div className="space-y-3">
              {links.map((link: any) => (
                <div key={link.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-sm font-mono bg-white px-2 py-1 rounded border border-gray-300">
                        {link.code}
                      </code>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-600">{link.clicks} clicks</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-600">{link.conversions} conversions</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs font-semibold text-green-600">${link.earnings.toFixed(2)}</span>
                    </div>
                    <Input
                      value={link.url}
                      readOnly
                      className="text-sm font-mono"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(link.url, link.id)}
                  >
                    {copied === link.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Link2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm">No affiliate links yet</p>
              <p className="text-xs mt-1">Generate your first link to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


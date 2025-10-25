import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Crown, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { api } from '@/api/index.ts';

export const SubscriptionsPage = () => {
  const queryClient = useQueryClient();

  const { data: plans, isLoading } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: () => api.advancedMarketplace.getSubscriptionPlans(),
  });

  const { data: currentSubscription } = useQuery({
    queryKey: ['userSubscription'],
    queryFn: () => api.advancedMarketplace.getUserSubscription(),
  });

  const subscribeMutation = useMutation({
    mutationFn: (planId: string) => api.advancedMarketplace.subscribe(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
    },
  });

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 p-8 md:p-10 shadow-lg">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10 text-center">
          <Crown className="w-12 h-12 mx-auto text-white mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Choose Your Plan
          </h1>
          <p className="text-purple-100 text-base">
            Unlock premium prompts and exclusive features
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-8">
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans?.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.isPopular
                  ? 'border-2 border-purple-600 shadow-xl'
                  : 'border border-gray-200'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <p className="text-gray-600 text-sm">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.billingCycle}</span>
                </div>
                {plan.discountPercentage > 0 && (
                  <Badge className="mt-2 bg-green-100 text-green-700 border-green-200">
                    Save {plan.discountPercentage}% on marketplace
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => subscribeMutation.mutate(plan.id)}
                  disabled={
                    subscribeMutation.isPending ||
                    currentSubscription?.planId === plan.id
                  }
                  className={`w-full h-12 font-semibold ${
                    plan.isPopular
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {currentSubscription?.planId === plan.id
                    ? 'Current Plan'
                    : 'Subscribe Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};


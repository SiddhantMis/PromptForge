import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Wallet, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { api } from '@/api/index.ts';
import type { MarketplaceListing, PurchaseRequest } from '@/types/marketplace.types.ts';
import { useNavigate } from 'react-router-dom';

interface PurchaseModalProps {
  listing: MarketplaceListing;
  open: boolean;
  onClose: () => void;
}

export const PurchaseModal = ({ listing, open, onClose }: PurchaseModalProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PurchaseRequest['paymentMethod']>('credit_card');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const purchaseMutation = useMutation({
    mutationFn: (request: PurchaseRequest) => api.marketplace.purchasePrompt(request),
    onSuccess: () => {
      setPurchaseSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        handleClose();
        navigate('/marketplace/transactions');
      }, 2000);
    },
  });

  const handlePurchase = () => {
    purchaseMutation.mutate({
      promptId: listing.promptId,
      paymentMethod: selectedPaymentMethod,
    });
  };

  const handleClose = () => {
    setPurchaseSuccess(false);
    purchaseMutation.reset();
    onClose();
  };

  if (purchaseSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Purchase Successful!</h3>
            <p className="text-gray-600 mb-6">
              You now have access to this premium prompt
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to your transactions...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Complete Purchase</DialogTitle>
          <DialogDescription>
            You're purchasing a premium prompt from {listing.seller.firstName} {listing.seller.lastName}
          </DialogDescription>
        </DialogHeader>

        {/* Prompt Details */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="font-semibold text-gray-900 flex-1">{listing.prompt.title}</h4>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              {listing.prompt.category}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {listing.prompt.description}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-600">Price:</span>
            <span className="text-2xl font-bold text-green-600">
              ${listing.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-900">Select Payment Method</label>
          
          <div className="space-y-2">
            {/* Credit Card Option */}
            <button
              onClick={() => setSelectedPaymentMethod('credit_card')}
              className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                selectedPaymentMethod === 'credit_card'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPaymentMethod === 'credit_card'
                  ? 'border-green-600'
                  : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'credit_card' && (
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                )}
              </div>
              <CreditCard className="w-5 h-5 text-gray-700" />
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Credit Card</p>
                <p className="text-xs text-gray-500">Pay with Visa, Mastercard, or Amex</p>
              </div>
            </button>

            {/* PayPal Option */}
            <button
              onClick={() => setSelectedPaymentMethod('paypal')}
              className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                selectedPaymentMethod === 'paypal'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPaymentMethod === 'paypal'
                  ? 'border-green-600'
                  : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'paypal' && (
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                )}
              </div>
              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                P
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">PayPal</p>
                <p className="text-xs text-gray-500">Fast and secure payment</p>
              </div>
            </button>

            {/* Wallet Option */}
            <button
              onClick={() => setSelectedPaymentMethod('wallet')}
              className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                selectedPaymentMethod === 'wallet'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPaymentMethod === 'wallet'
                  ? 'border-green-600'
                  : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'wallet' && (
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                )}
              </div>
              <Wallet className="w-5 h-5 text-gray-700" />
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Wallet Balance</p>
                <p className="text-xs text-gray-500">Use your account balance</p>
              </div>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {purchaseMutation.isError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
            <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Purchase Failed</p>
              <p className="text-xs text-red-700 mt-1">
                {(purchaseMutation.error as any)?.message || 'An error occurred. Please try again.'}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={purchaseMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={purchaseMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {purchaseMutation.isPending ? 'Processing...' : `Pay $${listing.price.toFixed(2)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


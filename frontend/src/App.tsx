import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/auth.store.ts';
import { LoginPage } from './features/auth/LoginPage.tsx';
import { RegisterPage } from './features/auth/RegisterPage.tsx';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage.tsx';
import { DashboardPage } from './features/dashboard/DashboardPage.tsx';
import { PromptBrowsePage } from './features/prompts/PromptBrowsePage.tsx';
import { PromptDetailPage } from './features/prompts/PromptDetailPage.tsx';
import { CreatePromptPage } from './features/prompts/CreatePromptPage.tsx';
import { MarketplaceBrowsePage } from './features/marketplace/MarketplaceBrowsePage.tsx';
import { TransactionHistoryPage } from './features/marketplace/TransactionHistoryPage.tsx';
import { EarningsPage } from './features/marketplace/EarningsPage.tsx';
import { UserProfilePage } from './features/social/UserProfilePage.tsx';
import { ActivityFeedPage } from './features/social/ActivityFeedPage.tsx';
import { AITestPage } from './features/ai-lab/AITestPage.tsx';
import { TestHistoryPage } from './features/ai-lab/TestHistoryPage.tsx';
import { SubscriptionsPage } from './features/marketplace/SubscriptionsPage.tsx';
import { AffiliatesDashboard } from './features/marketplace/AffiliatesDashboard.tsx';
import { Layout } from './components/layout/Layout.tsx';
import { ProtectedRoute } from './routes/ProtectedRoute.tsx';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { loadUser, isAuthenticated } = useAuthStore();

  // Load user from localStorage on app init
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/prompts"
            element={
              <ProtectedRoute>
                <Layout>
                  <PromptBrowsePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/prompts/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreatePromptPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/prompts/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <PromptDetailPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <Layout>
                  <MarketplaceBrowsePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/marketplace/transactions"
            element={
              <ProtectedRoute>
                <Layout>
                  <TransactionHistoryPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/marketplace/earnings"
            element={
              <ProtectedRoute>
                <Layout>
                  <EarningsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Layout>
                  <ActivityFeedPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/ai-lab"
            element={
              <ProtectedRoute>
                <Layout>
                  <AITestPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/ai-lab/history"
            element={
              <ProtectedRoute>
                <Layout>
                  <TestHistoryPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/marketplace/subscriptions"
            element={
              <ProtectedRoute>
                <Layout>
                  <SubscriptionsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/marketplace/affiliates"
            element={
              <ProtectedRoute>
                <Layout>
                  <AffiliatesDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Root redirect */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;


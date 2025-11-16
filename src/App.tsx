import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import { Toaster } from './components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './components/layout/MainLayout';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Store from './pages/Store';
import NFTGallery from './pages/NFTGallery';
import JestCoin from './pages/JestCoin';
import NotFound from './pages/NotFound';
import { ensureAudioBucketExists } from './lib/supabase/storage';
import DemoSubmission from './pages/DemoSubmission';
import Analytics from './pages/Analytics';
import PageViewsTracker from '@/components/analytics/PageViewsTracker';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import ErrorPage from '@/pages/ErrorPage';
import AdminDashboard from '@/pages/AdminDashboard';
import StoreCheckout from '@/pages/StoreCheckout';
import CareerDashboard from '@/pages/CareerDashboard';
import CareerCanvas from '@/pages/CareerCanvas';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// Initialize Supabase storage buckets
ensureAudioBucketExists().catch(console.error);

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Toaster />
        <AuthProvider>
          <WalletProvider>
            <QueryClientProvider client={queryClient}>
              <Router>
                <PageViewsTracker />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ErrorBoundary>
                        <MainLayout><Community /></MainLayout>
                      </ErrorBoundary>
                    }
                    errorElement={<ErrorPage />}
                  />
                  <Route
                    path="/profile/:id"
                    element={
                      <ErrorBoundary>
                        <MainLayout><Profile /></MainLayout>
                      </ErrorBoundary>
                    }
                    errorElement={<ErrorPage />}
                  />
                  <Route
                    path="/profile"
                    element={
                      <ErrorBoundary>
                        <MainLayout><Profile /></MainLayout>
                      </ErrorBoundary>
                    }
                    errorElement={<ErrorPage />}
                  />
                  <Route
                    path="/community"
                    element={
                      <ErrorBoundary>
                        <MainLayout><Community /></MainLayout>
                      </ErrorBoundary>
                    }
                    errorElement={<ErrorPage />}
                  />
                  <Route
                    path="/store"
                    element={
                      <ErrorBoundary>
                        <MainLayout><Store /></MainLayout>
                      </ErrorBoundary>
                    }
                    errorElement={<ErrorPage />}
                  />
                  <Route
                    path="/store/checkout"
                    element={
                      <ErrorBoundary>
                        <MainLayout><StoreCheckout /></MainLayout>
                      </ErrorBoundary>
                    }
                    errorElement={<ErrorPage />}
                  />
                  <Route
                    path="/nft-gallery"
                    element={
                      <ErrorBoundary>
                        <MainLayout><NFTGallery /></MainLayout>
                      </ErrorBoundary>
                    }
                    errorElement={<ErrorPage />}
                  />
                  <Route
                    path="/jestcoin"
                    element={
                      <ErrorBoundary>
                        <MainLayout><JestCoin /></MainLayout>
                      </ErrorBoundary>
                    }
                    errorElement={<ErrorPage />}
                  />
                  <Route
                    path="/demo-submission"
                    element={
                      <ErrorBoundary>
                        <MainLayout><DemoSubmission /></MainLayout>
                      </ErrorBoundary>
                    }
                    errorElement={<ErrorPage />}
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ErrorBoundary>
                        <MainLayout><Analytics /></MainLayout>
                      </ErrorBoundary>
                    }
                    errorElement={<ErrorPage />}
                  />
                  <Route
                    path="/admin/*"
                    element={
                      <ErrorBoundary>
                        <AdminDashboard />
                      </ErrorBoundary>
                    }
                    errorElement={<ErrorPage />}
                  />
                  <Route
                    path="/login"
                    element={
                      <ErrorBoundary>
                        <MainLayout hideHeader={true}>
                          <Login />
                        </MainLayout>
                      </ErrorBoundary>
                    }
                    errorElement={<ErrorPage />}
                  />
                  <Route
                    path="/register"
                    element={
                      <ErrorBoundary>
                        <MainLayout hideHeader={true}>
                          <Register />
                        </MainLayout>
                      </ErrorBoundary>
                    }
                    errorElement={<ErrorPage />}
                  />
                  <Route
                    path="/career"
                    element={
                      <ErrorBoundary>
                        <MainLayout><CareerDashboard /></MainLayout>
                      </ErrorBoundary>
                    }
                    errorElement={<ErrorPage />}
                  />
                  <Route
                    path="/canvas/:projectId"
                    element={
                      <ErrorBoundary>
                        <MainLayout><CareerCanvas /></MainLayout>
                      </ErrorBoundary>
                    }
                    errorElement={<ErrorPage />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </QueryClientProvider>
          </WalletProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;

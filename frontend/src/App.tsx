import React, { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import Sidebar from '@/components/ui/Sidebar';
import Dashboard from '@components/Dashboard';
import Templates from '@components/Templates';
import Listings from '@components/Listings';
import Inventory from '@components/Inventory';
import Marketplaces from '@components/Marketplaces';
import PricingPage from '@pages/users/pricing/PricingPage';
import LoginPage from '@components/auth/LoginPage';
import SignupPage from '@components/auth/SignupPage';
import SuccessPage from '@components/SuccessPage';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { useAdmin } from '@hooks/useAdmin';
import { mockStats, mockTemplates, mockListings, mockInventory, mockMarketplaces } from '@data/mockData';
import { LogOut, User, Shield } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { user, loading: authLoading, signOut } = useAuth();
  const { getCurrentPlan, loading: subscriptionLoading } = useSubscription();
  const { isAdmin, isSuperAdmin, role } = useAdmin();

  return (
    <RouterProvider router={router} />
  )

  // Check URL for success parameter
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setShowSuccess(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleAuthSuccess = () => {
    setActiveTab('dashboard');
  };

  const handleSuccessContinue = () => {
    setShowSuccess(false);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={mockStats} />;
      case 'templates':
        return (
          <Templates
            templates={mockTemplates}
          />
        );
      case 'listings':
        return (
          <Listings
            listings={mockListings}
          />
        );
      case 'inventory':
        return (
          <Inventory
            inventory={mockInventory}
          />
        );
      case 'marketplaces':
        return (
          <Marketplaces
            marketplaces={mockMarketplaces}
          />
        );
      case 'pricing':
        return <PricingPage currentPlan={getCurrentPlan()?.toLowerCase()} />;
      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-2">Coming soon - Advanced analytics and reporting features.</p>
            </div>
            <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Comprehensive analytics and insights will be available here.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Configure your account and application preferences.</p>
            </div>
            <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings Panel</h3>
              <p className="text-gray-600">Account settings and preferences will be available here.</p>
            </div>
          </div>
        );
      default:
        return <Dashboard stats={mockStats} />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (authMode === 'login') {
      return (
        <LoginPage
          onSuccess={handleAuthSuccess}
          onSwitchToSignup={() => setAuthMode('signup')}
        />
      );
    } else {
      return (
        <SignupPage
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    }
  }

  if (showSuccess) {
    return <SuccessPage onContinue={handleSuccessContinue} />;
  }

  const currentPlan = getCurrentPlan();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>{isSuperAdmin ? 'Super Admin' : 'Admin'}</span>
                </div>
              )}
              {currentPlan && !isAdmin && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {currentPlan} Plan
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
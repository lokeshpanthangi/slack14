
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';
import WorkspacesPage from './WorkspacesPage';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

type AuthStep = 'login' | 'signup';

const Index: React.FC = () => {
  const { isAuthenticated, isLoading, workspace } = useAuth();
  const [authStep, setAuthStep] = useState<AuthStep>('login');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slack-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slack-aubergine rounded-slack-xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slack-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and has selected a workspace, show dashboard
  if (isAuthenticated && workspace) {
    return <DashboardLayout />;
  }

  // If user is authenticated but no workspace selected, show workspaces page
  if (isAuthenticated && !workspace) {
    return <WorkspacesPage />;
  }

  const handleSwitchToSignUp = () => {
    setAuthStep('signup');
  };

  const handleSwitchToLogin = () => {
    setAuthStep('login');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password flow');
    // Implement forgot password flow
  };

  // Show authentication forms for non-authenticated users
  switch (authStep) {
    case 'login':
      return (
        <LoginForm
          workspaceUrl=""
          onBack={() => {}} // Not needed in new flow
          onForgotPassword={handleForgotPassword}
          onSignUp={handleSwitchToSignUp}
        />
      );

    case 'signup':
      return (
        <SignUpForm
          onBack={handleSwitchToLogin}
          onSignIn={handleSwitchToLogin}
          isCreatingWorkspace={false}
        />
      );

    default:
      return (
        <LoginForm
          workspaceUrl=""
          onBack={() => {}}
          onForgotPassword={handleForgotPassword}
          onSignUp={handleSwitchToSignUp}
        />
      );
  }
};

export default Index;

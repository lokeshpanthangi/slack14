
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WorkspaceSelector from '@/components/auth/WorkspaceSelector';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

type AuthStep = 'workspace' | 'login' | 'signup' | 'create-workspace';

const Index: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [authStep, setAuthStep] = useState<AuthStep>('workspace');
  const [selectedWorkspace, setSelectedWorkspace] = useState('');

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

  if (isAuthenticated) {
    return <DashboardLayout />;
  }

  const handleWorkspaceSelect = (workspaceUrl: string) => {
    setSelectedWorkspace(workspaceUrl);
    setAuthStep('login');
  };

  const handleCreateWorkspace = () => {
    setAuthStep('create-workspace');
  };

  const handleBackToWorkspace = () => {
    setAuthStep('workspace');
    setSelectedWorkspace('');
  };

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

  switch (authStep) {
    case 'workspace':
      return (
        <WorkspaceSelector
          onWorkspaceSelect={handleWorkspaceSelect}
          onCreateWorkspace={handleCreateWorkspace}
        />
      );

    case 'login':
      return (
        <LoginForm
          workspaceUrl={selectedWorkspace}
          onBack={handleBackToWorkspace}
          onForgotPassword={handleForgotPassword}
          onSignUp={handleSwitchToSignUp}
        />
      );

    case 'signup':
      return (
        <SignUpForm
          onBack={handleBackToWorkspace}
          onSignIn={handleSwitchToLogin}
          isCreatingWorkspace={false}
        />
      );

    case 'create-workspace':
      return (
        <SignUpForm
          onBack={handleBackToWorkspace}
          onSignIn={handleSwitchToLogin}
          isCreatingWorkspace={true}
        />
      );

    default:
      return (
        <WorkspaceSelector
          onWorkspaceSelect={handleWorkspaceSelect}
          onCreateWorkspace={handleCreateWorkspace}
        />
      );
  }
};

export default Index;

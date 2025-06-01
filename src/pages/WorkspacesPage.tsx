
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Users, Search, LogOut } from 'lucide-react';

interface MockWorkspace {
  id: string;
  name: string;
  memberCount: number;
  avatar: string;
  isOwner: boolean;
}

const WorkspacesPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [joinWorkspaceUrl, setJoinWorkspaceUrl] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  // Mock workspaces data - in real app this would come from API
  const userWorkspaces: MockWorkspace[] = [
    {
      id: '1',
      name: 'MisogiAI',
      memberCount: 83,
      avatar: '🤖',
      isOwner: true
    },
    {
      id: '2', 
      name: 'Design Team',
      memberCount: 12,
      avatar: '🎨',
      isOwner: false
    }
  ];

  const handleLaunchWorkspace = (workspaceId: string) => {
    console.log('Launching workspace:', workspaceId);
    // This would typically navigate to the workspace dashboard
    // For now, we'll use the existing dashboard
    window.location.reload();
  };

  const handleCreateWorkspace = () => {
    console.log('Creating new workspace');
    // This would open a create workspace modal or navigate to creation flow
  };

  const handleJoinWorkspace = () => {
    if (joinWorkspaceUrl.trim()) {
      console.log('Joining workspace:', joinWorkspaceUrl);
      // This would handle joining the workspace
      setJoinWorkspaceUrl('');
      setShowJoinForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slack-aubergine via-purple-700 to-slack-dark-aubergine">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-slack-aubergine font-bold text-lg">S</span>
                </div>
                <span className="text-white font-bold text-xl">slack</span>
                <span className="text-white/60 text-sm">from Salesforce</span>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-white/80 hover:text-white text-sm">Features</a>
                <a href="#" className="text-white/80 hover:text-white text-sm">Solutions</a>
                <a href="#" className="text-white/80 hover:text-white text-sm">Enterprise</a>
                <a href="#" className="text-white/80 hover:text-white text-sm">Resources</a>
                <a href="#" className="text-white/80 hover:text-white text-sm">Pricing</a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Talk to Sales
              </Button>
              <Button
                variant="ghost"
                onClick={logout}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <span className="text-6xl mr-4">👋</span>
            <h1 className="text-5xl font-bold text-white">Welcome back</h1>
          </div>
        </div>

        {/* User Workspaces Section */}
        <div className="mb-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-slack-text-primary mb-6">
              Workspaces for {user?.email}
            </h2>
            
            <div className="space-y-4">
              {userWorkspaces.map((workspace) => (
                <div key={workspace.id} className="flex items-center justify-between p-4 border border-slack-border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slack-aubergine rounded-lg flex items-center justify-center text-white text-xl">
                      {workspace.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slack-text-primary">{workspace.name}</h3>
                      <div className="flex items-center text-sm text-slack-text-secondary">
                        <Users className="w-4 h-4 mr-1" />
                        {workspace.memberCount} members
                        {workspace.isOwner && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            Owner
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleLaunchWorkspace(workspace.id)}
                    className="bg-slack-aubergine hover:bg-slack-aubergine/90 text-white"
                  >
                    LAUNCH SLACK
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create New Workspace Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-orange-100 to-pink-100 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👩‍💻</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slack-text-primary text-lg">
                      Want to use Slack with a different team?
                    </h3>
                  </div>
                </div>
                <Button
                  onClick={handleCreateWorkspace}
                  variant="outline"
                  className="border-slack-aubergine text-slack-aubergine hover:bg-slack-aubergine hover:text-white"
                >
                  CREATE A NEW WORKSPACE
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Join Workspace Section */}
        <div className="text-center">
          {!showJoinForm ? (
            <div>
              <p className="text-white/80 mb-4">
                Not seeing your workspace?{' '}
                <button 
                  onClick={() => setShowJoinForm(true)}
                  className="text-blue-300 hover:text-blue-200 underline"
                >
                  Try using a different email address →
                </button>
              </p>
              <Button
                onClick={() => setShowJoinForm(true)}
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Join a workspace
              </Button>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-slack-text-primary mb-4">Join a workspace</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Enter workspace URL, code, or invite link"
                  value={joinWorkspaceUrl}
                  onChange={(e) => setJoinWorkspaceUrl(e.target.value)}
                  className="text-15 border-slack rounded-slack-md"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={handleJoinWorkspace}
                    className="bg-slack-aubergine hover:bg-slack-aubergine/90 text-white flex-1"
                    disabled={!joinWorkspaceUrl.trim()}
                  >
                    Join Workspace
                  </Button>
                  <Button
                    onClick={() => {
                      setShowJoinForm(false);
                      setJoinWorkspaceUrl('');
                    }}
                    variant="outline"
                    className="border-slack text-slack-text-secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkspacesPage;

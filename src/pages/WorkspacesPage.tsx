
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Users, LogOut, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface UserWorkspace {
  id: string;
  name: string;
  memberCount: number;
  avatar: string;
  isOwner: boolean;
  slug: string;
  url: string;
}

const WorkspacesPage: React.FC = () => {
  const { user, logout, setWorkspace } = useAuth();
  const navigate = useNavigate();
  const [joinWorkspaceUrl, setJoinWorkspaceUrl] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [createWorkspaceData, setCreateWorkspaceData] = useState({
    name: '',
    description: '',
    slug: ''
  });
  const [userWorkspaces, setUserWorkspaces] = useState<UserWorkspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserWorkspaces();
    }
  }, [user]);

  const fetchUserWorkspaces = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data: workspaceMemberships, error } = await supabase
        .from('workspace_members')
        .select(`
          role,
          workspaces (
            id,
            name,
            slug,
            icon,
            created_by
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching workspaces:', error);
        return;
      }

      const workspaces: UserWorkspace[] = [];
      
      for (const membership of workspaceMemberships || []) {
        const workspace = membership.workspaces as any;
        
        // Get member count
        const { count: memberCount } = await supabase
          .from('workspace_members')
          .select('*', { count: 'exact', head: true })
          .eq('workspace_id', workspace.id);

        workspaces.push({
          id: workspace.id,
          name: workspace.name,
          memberCount: memberCount || 0,
          avatar: workspace.icon || workspace.name.charAt(0).toUpperCase(),
          isOwner: membership.role === 'admin',
          slug: workspace.slug,
          url: `${workspace.slug}.slack.com`
        });
      }

      setUserWorkspaces(workspaces);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchWorkspace = async (workspaceId: string) => {
    console.log('Launching workspace:', workspaceId);
    const selectedWorkspace = userWorkspaces.find(ws => ws.id === workspaceId);
    if (selectedWorkspace) {
      await setWorkspace({
        id: selectedWorkspace.id,
        name: selectedWorkspace.name,
        url: selectedWorkspace.url,
        slug: selectedWorkspace.slug,
        isAdmin: selectedWorkspace.isOwner
      });
      navigate('/', { replace: true });
    }
  };

  const handleCreateWorkspace = async () => {
    if (!createWorkspaceData.name.trim() || !user) return;

    try {
      const slug = createWorkspaceData.slug || createWorkspaceData.name.toLowerCase().replace(/\s+/g, '-');
      
      const { data: newWorkspace, error } = await supabase
        .from('workspaces')
        .insert({
          name: createWorkspaceData.name,
          slug,
          description: createWorkspaceData.description,
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating workspace:', error);
        return;
      }

      setShowCreateWorkspace(false);
      setCreateWorkspaceData({ name: '', description: '', slug: '' });
      
      // Refresh workspaces and redirect to new workspace
      await fetchUserWorkspaces();
      handleLaunchWorkspace(newWorkspace.id);
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  const handleJoinWorkspace = () => {
    if (joinWorkspaceUrl.trim()) {
      // TODO: Implement workspace joining by URL/invite
      console.log('Join workspace:', joinWorkspaceUrl);
      setJoinWorkspaceUrl('');
      setShowJoinForm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slack-aubergine via-purple-700 to-slack-dark-aubergine flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-slack-aubergine border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-white">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slack-aubergine via-purple-700 to-slack-dark-aubergine">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-slack-aubergine font-bold text-lg">S</span>
              </div>
              <span className="text-white font-bold text-xl">slack</span>
              <span className="text-white/60 text-sm">from Salesforce</span>
            </div>

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
            
            {userWorkspaces.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slack-text-secondary mb-4">
                  You're not a member of any workspaces yet.
                </p>
                <Button
                  onClick={() => setShowCreateWorkspace(true)}
                  className="bg-slack-aubergine hover:bg-slack-aubergine/90 text-white"
                >
                  Create Your First Workspace
                </Button>
              </div>
            ) : (
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
                        <div className="text-xs text-slack-text-secondary mt-1">
                          {workspace.url}
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
            )}
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
                  onClick={() => setShowCreateWorkspace(true)}
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
                  className="text-15"
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

      {/* Create Workspace Modal */}
      <Dialog open={showCreateWorkspace} onOpenChange={setShowCreateWorkspace}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a new workspace</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Workspace name</label>
              <Input
                placeholder="e.g. My Company"
                value={createWorkspaceData.name}
                onChange={(e) => setCreateWorkspaceData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description (optional)</label>
              <Input
                placeholder="What's this workspace for?"
                value={createWorkspaceData.description}
                onChange={(e) => setCreateWorkspaceData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Workspace URL</label>
              <div className="flex items-center">
                <Input
                  placeholder="my-company"
                  value={createWorkspaceData.slug}
                  onChange={(e) => setCreateWorkspaceData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                  className="rounded-r-none"
                />
                <span className="bg-gray-100 border border-l-0 px-3 py-2 text-sm text-gray-600 rounded-r-md">
                  .slack.com
                </span>
              </div>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button
                onClick={handleCreateWorkspace}
                disabled={!createWorkspaceData.name.trim()}
                className="flex-1"
              >
                Create Workspace
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateWorkspace(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkspacesPage;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Plus, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  created_at: string;
}

const WorkspacesPage: React.FC = () => {
  const { user, setWorkspace } = useAuth();
  const { toast } = useToast();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  
  // Create workspace form
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  
  // Join workspace form
  const [workspaceSlug, setWorkspaceSlug] = useState('');

  useEffect(() => {
    fetchWorkspaces();
  }, [user]);

  const fetchWorkspaces = async () => {
    if (!user) return;
    
    try {
      // Fetch workspaces where user is a member
      const { data: workspaceMembers, error: membersError } = await supabase
        .from('workspace_members')
        .select(`
          workspace_id,
          workspaces (
            id,
            name,
            slug,
            icon,
            description,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (membersError) {
        console.error('Error fetching workspaces:', membersError);
        toast({
          title: "Error",
          description: "Failed to load workspaces. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const workspaceList = workspaceMembers
        ?.map(member => member.workspaces)
        .filter(Boolean) as Workspace[];

      setWorkspaces(workspaceList || []);
    } catch (error) {
      console.error('Error in fetchWorkspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !workspaceName.trim()) return;

    setCreateLoading(true);
    try {
      // Generate slug from workspace name
      const slug = workspaceName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Create workspace
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          name: workspaceName.trim(),
          slug: slug,
          description: workspaceDescription.trim() || null,
          created_by: user.id
        })
        .select()
        .single();

      if (workspaceError) {
        console.error('Error creating workspace:', workspaceError);
        toast({
          title: "Error",
          description: "Failed to create workspace. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Set the new workspace as current
      await setWorkspace({
        id: workspace.id,
        name: workspace.name,
        url: `${workspace.slug}.slack.com`,
        icon: workspace.icon || undefined,
        isAdmin: true,
        slug: workspace.slug
      });

      toast({
        title: "Success",
        description: `Workspace "${workspaceName}" created successfully!`,
      });

      // Reset form
      setWorkspaceName('');
      setWorkspaceDescription('');
      
      // Refresh workspaces list
      fetchWorkspaces();
    } catch (error) {
      console.error('Error in createWorkspace:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreateLoading(false);
    }
  };

  const joinWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !workspaceSlug.trim()) return;

    setJoinLoading(true);
    try {
      // Find workspace by slug
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('slug', workspaceSlug.trim().toLowerCase())
        .single();

      if (workspaceError || !workspace) {
        toast({
          title: "Error",
          description: "Workspace not found. Please check the workspace URL.",
          variant: "destructive",
        });
        return;
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('workspace_members')
        .select('id')
        .eq('workspace_id', workspace.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        toast({
          title: "Info",
          description: "You are already a member of this workspace.",
        });
        return;
      }

      // Add user as member
      const { error: memberError } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspace.id,
          user_id: user.id,
          role: 'member'
        });

      if (memberError) {
        console.error('Error joining workspace:', memberError);
        toast({
          title: "Error",
          description: "Failed to join workspace. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Set the workspace as current
      await setWorkspace({
        id: workspace.id,
        name: workspace.name,
        url: `${workspace.slug}.slack.com`,
        icon: workspace.icon || undefined,
        isAdmin: false,
        slug: workspace.slug
      });

      toast({
        title: "Success",
        description: `Successfully joined "${workspace.name}"!`,
      });

      // Reset form
      setWorkspaceSlug('');
      
      // Refresh workspaces list
      fetchWorkspaces();
    } catch (error) {
      console.error('Error in joinWorkspace:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setJoinLoading(false);
    }
  };

  const selectWorkspace = async (workspace: Workspace) => {
    try {
      // Check if user is admin of this workspace
      const { data: membership } = await supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspace.id)
        .eq('user_id', user?.id)
        .single();

      await setWorkspace({
        id: workspace.id,
        name: workspace.name,
        url: `${workspace.slug}.slack.com`,
        icon: workspace.icon || undefined,
        isAdmin: membership?.role === 'admin',
        slug: workspace.slug
      });
    } catch (error) {
      console.error('Error selecting workspace:', error);
      toast({
        title: "Error",
        description: "Failed to select workspace. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slack-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slack-aubergine rounded-slack-xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slack-text-secondary">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slack-light-gray p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slack-text-primary mb-2">
            Welcome to Slack
          </h1>
          <p className="text-slack-text-secondary">
            Choose a workspace to get started, or create a new one
          </p>
        </div>

        {workspaces.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slack-text-primary mb-4">
              Your Workspaces
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.map((workspace) => (
                <Card
                  key={workspace.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => selectWorkspace(workspace)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slack-aubergine rounded-slack-md flex items-center justify-center">
                        {workspace.icon ? (
                          <img src={workspace.icon} alt="" className="w-6 h-6" />
                        ) : (
                          <Building2 className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{workspace.name}</CardTitle>
                        <p className="text-sm text-slack-text-secondary">
                          {workspace.slug}.slack.com
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  {workspace.description && (
                    <CardContent>
                      <p className="text-sm text-slack-text-secondary">
                        {workspace.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Get Started</span>
            </CardTitle>
            <CardDescription>
              Create a new workspace or join an existing one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create Workspace</TabsTrigger>
                <TabsTrigger value="join">Join Workspace</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create">
                <form onSubmit={createWorkspace} className="space-y-4">
                  <div>
                    <Label htmlFor="workspace-name">Workspace Name</Label>
                    <Input
                      id="workspace-name"
                      type="text"
                      placeholder="My Company"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="workspace-description">Description (Optional)</Label>
                    <Input
                      id="workspace-description"
                      type="text"
                      placeholder="What's this workspace for?"
                      value={workspaceDescription}
                      onChange={(e) => setWorkspaceDescription(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createLoading || !workspaceName.trim()}
                  >
                    {createLoading ? 'Creating...' : 'Create Workspace'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="join">
                <form onSubmit={joinWorkspace} className="space-y-4">
                  <div>
                    <Label htmlFor="workspace-url">Workspace URL</Label>
                    <div className="flex items-center">
                      <Input
                        id="workspace-url"
                        type="text"
                        placeholder="workspace-name"
                        value={workspaceSlug}
                        onChange={(e) => setWorkspaceSlug(e.target.value)}
                        required
                      />
                      <span className="ml-2 text-slack-text-secondary">.slack.com</span>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={joinLoading || !workspaceSlug.trim()}
                  >
                    {joinLoading ? 'Joining...' : 'Join Workspace'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkspacesPage;

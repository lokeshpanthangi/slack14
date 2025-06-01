
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Workspace = Database['public']['Tables']['workspaces']['Row'];

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  status: {
    text: string;
    emoji: string;
    expiration?: Date;
  };
  presence: 'active' | 'away' | 'offline' | 'dnd';
  timezone: string;
  role: string;
  workspaceId: string;
}

export interface Workspace {
  id: string;
  name: string;
  url: string;
  icon?: string;
  isAdmin: boolean;
  slug?: string;
}

interface AuthContextType {
  user: User | null;
  workspace: Workspace | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, workspaceUrl?: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string, workspaceName?: string) => Promise<void>;
  logout: () => void;
  updateUserStatus: (status: { text: string; emoji: string; expiration?: Date }) => void;
  updateUserPresence: (presence: 'active' | 'away' | 'offline' | 'dnd') => void;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  setWorkspace: (workspace: Workspace) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspaceState] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const isAuthenticated = !!session && !!user;

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const userData: User = {
              id: profile.id,
              email: session.user.email || '',
              displayName: profile.display_name,
              avatar: profile.avatar_url || undefined,
              status: {
                text: profile.status_text || '',
                emoji: profile.status_emoji || '',
                expiration: profile.status_expiration ? new Date(profile.status_expiration) : undefined
              },
              presence: profile.presence || 'offline',
              timezone: profile.timezone || 'UTC',
              role: 'Member',
              workspaceId: ''
            };
            setUser(userData);

            // Check for current workspace session
            const { data: userSession } = await supabase
              .from('user_sessions')
              .select(`
                current_workspace_id,
                workspaces:current_workspace_id (
                  id,
                  name,
                  slug,
                  icon
                )
              `)
              .eq('user_id', session.user.id)
              .single();

            if (userSession?.workspaces) {
              const ws = userSession.workspaces as any;
              // Check if user is admin of this workspace
              const { data: membership } = await supabase
                .from('workspace_members')
                .select('role')
                .eq('workspace_id', ws.id)
                .eq('user_id', session.user.id)
                .single();

              const workspaceData: Workspace = {
                id: ws.id,
                name: ws.name,
                url: `${ws.slug}.slack.com`,
                icon: ws.icon || undefined,
                isAdmin: membership?.role === 'admin',
                slug: ws.slug
              };
              setWorkspaceState(workspaceData);
            }
          }
        } else {
          setUser(null);
          setWorkspaceState(null);
        }
        setIsLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, workspaceUrl?: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Login failed');
    }
  };

  const signup = async (email: string, password: string, displayName: string, workspaceName?: string) => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName
          }
        }
      });

      if (error) throw error;

      // If creating a workspace, we'll handle that after email confirmation
      if (workspaceName) {
        localStorage.setItem('pending_workspace', workspaceName);
      }
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Signup failed');
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    setUser(null);
    setWorkspaceState(null);
    setSession(null);
  };

  const updateUserStatus = async (status: { text: string; emoji: string; expiration?: Date }) => {
    if (user && session) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            status_text: status.text,
            status_emoji: status.emoji,
            status_expiration: status.expiration?.toISOString()
          })
          .eq('id', user.id);

        if (!error) {
          setUser({ ...user, status });
        }
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  const updateUserPresence = async (presence: 'active' | 'away' | 'offline' | 'dnd') => {
    if (user && session) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ presence })
          .eq('id', user.id);

        if (!error) {
          setUser({ ...user, presence });
        }
      } catch (error) {
        console.error('Error updating presence:', error);
      }
    }
  };

  const switchWorkspace = async (workspaceId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update user session
      await supabase
        .from('user_sessions')
        .upsert({
          user_id: user.id,
          current_workspace_id: workspaceId
        });

      // Fetch workspace details
      const { data: workspaceData } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();

      if (workspaceData) {
        // Check if user is admin
        const { data: membership } = await supabase
          .from('workspace_members')
          .select('role')
          .eq('workspace_id', workspaceId)
          .eq('user_id', user.id)
          .single();

        const workspace: Workspace = {
          id: workspaceData.id,
          name: workspaceData.name,
          url: `${workspaceData.slug}.slack.com`,
          icon: workspaceData.icon || undefined,
          isAdmin: membership?.role === 'admin',
          slug: workspaceData.slug
        };
        setWorkspaceState(workspace);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setWorkspace = async (newWorkspace: Workspace) => {
    if (user) {
      // Update user session in database
      await supabase
        .from('user_sessions')
        .upsert({
          user_id: user.id,
          current_workspace_id: newWorkspace.id
        });
    }
    setWorkspaceState(newWorkspace);
  };

  const value: AuthContextType = {
    user,
    workspace,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateUserStatus,
    updateUserPresence,
    switchWorkspace,
    setWorkspace
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

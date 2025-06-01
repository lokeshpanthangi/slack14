
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!workspace;

  useEffect(() => {
    // Simulate checking for existing session
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const savedUser = localStorage.getItem('slack_user');
        const savedWorkspace = localStorage.getItem('slack_workspace');
        
        if (savedUser && savedWorkspace) {
          setUser(JSON.parse(savedUser));
          setWorkspace(JSON.parse(savedWorkspace));
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string, workspaceUrl?: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        displayName: email.split('@')[0],
        status: { text: '', emoji: '' },
        presence: 'active',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        role: 'Member',
        workspaceId: '1'
      };

      const mockWorkspace: Workspace = {
        id: '1',
        name: workspaceUrl || 'My Workspace',
        url: workspaceUrl || 'my-workspace',
        isAdmin: false
      };

      setUser(mockUser);
      setWorkspace(mockWorkspace);
      
      localStorage.setItem('slack_user', JSON.stringify(mockUser));
      localStorage.setItem('slack_workspace', JSON.stringify(mockWorkspace));
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName: string, workspaceName?: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        displayName,
        status: { text: '', emoji: '' },
        presence: 'active',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        role: workspaceName ? 'Admin' : 'Member',
        workspaceId: '1'
      };

      const mockWorkspace: Workspace = {
        id: '1',
        name: workspaceName || 'My Workspace',
        url: workspaceName?.toLowerCase().replace(/\s+/g, '-') || 'my-workspace',
        isAdmin: !!workspaceName
      };

      setUser(mockUser);
      setWorkspace(mockWorkspace);
      
      localStorage.setItem('slack_user', JSON.stringify(mockUser));
      localStorage.setItem('slack_workspace', JSON.stringify(mockWorkspace));
    } catch (error) {
      throw new Error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setWorkspace(null);
    localStorage.removeItem('slack_user');
    localStorage.removeItem('slack_workspace');
  };

  const updateUserStatus = (status: { text: string; emoji: string; expiration?: Date }) => {
    if (user) {
      const updatedUser = { ...user, status };
      setUser(updatedUser);
      localStorage.setItem('slack_user', JSON.stringify(updatedUser));
    }
  };

  const updateUserPresence = (presence: 'active' | 'away' | 'offline' | 'dnd') => {
    if (user) {
      const updatedUser = { ...user, presence };
      setUser(updatedUser);
      localStorage.setItem('slack_user', JSON.stringify(updatedUser));
    }
  };

  const switchWorkspace = async (workspaceId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call to switch workspace
      await new Promise(resolve => setTimeout(resolve, 500));
      // Implementation would update workspace context
    } finally {
      setIsLoading(false);
    }
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
    switchWorkspace
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

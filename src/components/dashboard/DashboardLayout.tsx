
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import UserProfile from './UserProfile';

const DashboardLayout: React.FC = () => {
  const { user, workspace } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [showUserProfile, setShowUserProfile] = useState(false);

  return (
    <div className="flex h-screen bg-slack-white">
      <Sidebar 
        user={user}
        workspace={workspace}
        selectedChannel={selectedChannel}
        onChannelSelect={setSelectedChannel}
        onUserProfileClick={() => setShowUserProfile(true)}
      />
      
      <div className="flex-1 flex flex-col">
        <ChatArea 
          channel={selectedChannel}
          user={user}
        />
      </div>

      {showUserProfile && (
        <UserProfile 
          user={user}
          onClose={() => setShowUserProfile(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;

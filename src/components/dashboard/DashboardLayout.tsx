
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MessageProvider } from '@/contexts/MessageContext';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import ThreadSidebar from './ThreadSidebar';
import UserProfile from './UserProfile';
import CreateChannelModal from './CreateChannelModal';

const DashboardLayout: React.FC = () => {
  const { user, workspace } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [channels, setChannels] = useState([
    { id: 'general', name: 'general', isPrivate: false },
    { id: 'random', name: 'random', isPrivate: false },
    { id: 'design', name: 'design', isPrivate: true },
    { id: 'development', name: 'development', isPrivate: false },
  ]);

  const handleCreateChannel = (channelData: { name: string; description: string; isPrivate: boolean }) => {
    const newChannel = {
      id: channelData.name,
      name: channelData.name,
      isPrivate: channelData.isPrivate
    };
    setChannels(prev => [...prev, newChannel]);
    setSelectedChannel(newChannel.id);
  };

  return (
    <MessageProvider>
      <div className="flex h-screen bg-slack-white">
        <Sidebar 
          user={user}
          workspace={workspace}
          selectedChannel={selectedChannel}
          onChannelSelect={setSelectedChannel}
          onUserProfileClick={() => setShowUserProfile(true)}
          onCreateChannel={() => setShowCreateChannel(true)}
        />
        
        <div className="flex-1 flex">
          <ChatArea 
            channel={selectedChannel}
            user={user}
          />
          <ThreadSidebar />
        </div>

        {showUserProfile && (
          <UserProfile 
            user={user}
            onClose={() => setShowUserProfile(false)}
          />
        )}

        <CreateChannelModal
          isOpen={showCreateChannel}
          onClose={() => setShowCreateChannel(false)}
          onCreateChannel={handleCreateChannel}
        />
      </div>
    </MessageProvider>
  );
};

export default DashboardLayout;

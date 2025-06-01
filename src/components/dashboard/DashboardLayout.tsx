
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MessageProvider, useMessages } from '@/contexts/MessageContext';
import NavigationSidebar from './NavigationSidebar';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import ThreadSidebar from './ThreadSidebar';
import UserProfile from './UserProfile';
import CreateChannelModal from './CreateChannelModal';

const DashboardContent: React.FC = () => {
  const { user, workspace } = useAuth();
  const { selectedThread } = useMessages();
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
    setShowCreateChannel(false);
  };

  return (
    <div className="flex h-screen bg-slack-white overflow-hidden">
      <NavigationSidebar />
      
      <Sidebar 
        user={user}
        workspace={workspace}
        selectedChannel={selectedChannel}
        onChannelSelect={setSelectedChannel}
        onUserProfileClick={() => setShowUserProfile(true)}
        onCreateChannel={() => setShowCreateChannel(true)}
        channels={channels}
      />
      
      <div className="flex flex-1 relative">
        <div 
          className={`flex-1 transition-all duration-300 ease-in-out ${
            selectedThread ? 'mr-96' : ''
          }`}
        >
          <ChatArea 
            channel={selectedChannel}
            user={user}
          />
        </div>
        
        {selectedThread && (
          <div className="absolute right-0 top-0 h-full w-96 transition-all duration-300 ease-in-out">
            <ThreadSidebar />
          </div>
        )}
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
  );
};

const DashboardLayout: React.FC = () => {
  return (
    <MessageProvider>
      <DashboardContent />
    </MessageProvider>
  );
};

export default DashboardLayout;

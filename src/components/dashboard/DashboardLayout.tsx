
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MessageProvider, useMessages } from '@/contexts/MessageContext';
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
  };

  return (
    <div className="flex h-screen bg-slack-white overflow-hidden">
      <Sidebar 
        user={user}
        workspace={workspace}
        selectedChannel={selectedChannel}
        onChannelSelect={setSelectedChannel}
        onUserProfileClick={() => setShowUserProfile(true)}
        onCreateChannel={() => setShowCreateChannel(true)}
      />
      
      <div className="flex flex-1 relative">
        <div 
          className={`flex-1 transition-all duration-300 ease-in-out ${
            selectedThread ? 'w-[calc(100%-320px)]' : 'w-full'
          }`}
        >
          <ChatArea 
            channel={selectedChannel}
            user={user}
          />
        </div>
        
        <div 
          className={`absolute right-0 top-0 h-full transition-all duration-300 ease-in-out transform ${
            selectedThread 
              ? 'translate-x-0 opacity-100 w-80' 
              : 'translate-x-full opacity-0 w-0'
          }`}
        >
          <ThreadSidebar />
        </div>
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



import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MessageProvider, useMessages } from '@/contexts/MessageContext';
import NavigationSidebar from './NavigationSidebar';
import Sidebar from './Sidebar';
import DMSidebar from './DMSidebar';
import ChatArea from './ChatArea';
import ThreadSidebar from './ThreadSidebar';
import UserProfile from './UserProfile';
import CreateChannelModal from './CreateChannelModal';
import SearchModal from './SearchModal';
import WorkspaceSettings from './WorkspaceSettings';

const DashboardContent: React.FC = () => {
  const { user, workspace } = useAuth();
  const { selectedThread, setSelectedThread } = useMessages();
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showDMSidebar, setShowDMSidebar] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showWorkspaceSettings, setShowWorkspaceSettings] = useState(false);
  const [favoriteChannel, setFavoriteChannel] = useState('general');

  const handleCreateChannel = (channelData: { name: string; description: string; isPrivate: boolean }) => {
    const newChannel = {
      id: channelData.name,
      name: channelData.name,
      isPrivate: channelData.isPrivate
    };
    setSelectedChannel(newChannel.id);
    setShowCreateChannel(false);
  };

  const handleHomeClick = () => {
    setSelectedChannel(favoriteChannel);
    setSelectedThread(null);
    setShowDMSidebar(false);
  };

  const handleDMClick = () => {
    setShowDMSidebar(true);
    setSelectedThread(null);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedChannel(userId);
    setShowDMSidebar(false);
  };

  const handleBackToBrowse = () => {
    setShowDMSidebar(false);
    setSelectedChannel(favoriteChannel);
  };

  const handleSearchClick = () => {
    setShowSearchModal(true);
  };

  const handleSettingsClick = () => {
    setShowWorkspaceSettings(true);
  };

  const handleInviteTeammates = () => {
    console.log('Invite teammates clicked');
    // TODO: Implement invite teammates functionality
  };

  return (
    <div className="flex h-screen bg-chat-dark overflow-hidden">
      <NavigationSidebar 
        onHomeClick={handleHomeClick}
        onDMClick={handleDMClick}
        onSearchClick={handleSearchClick}
        onSettingsClick={handleSettingsClick}
      />
      
      {showDMSidebar ? (
        <DMSidebar
          user={user}
          workspace={workspace}
          selectedDM={selectedChannel}
          onUserSelect={handleUserSelect}
          onBackClick={handleBackToBrowse}
        />
      ) : (
        <Sidebar 
          user={user}
          workspace={workspace}
          currentChannel={selectedChannel}
          onChannelSelect={setSelectedChannel}
          onProfileClick={() => setShowUserProfile(true)}
          onCreateChannel={() => setShowCreateChannel(true)}
          onInviteTeammates={handleInviteTeammates}
        />
      )}
      
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

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />

      <WorkspaceSettings
        isOpen={showWorkspaceSettings}
        onClose={() => setShowWorkspaceSettings(false)}
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



import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChevronDown,
  ChevronRight,
  Hash,
  Lock,
  Plus,
  Search,
  MoreVertical,
  UserPlus
} from 'lucide-react';
import { User, Workspace } from '@/contexts/AuthContext';
import { useMessages } from '@/contexts/MessageContext';

interface SidebarProps {
  user: User | null;
  workspace: Workspace | null;
  currentChannel: string;
  onChannelSelect: (channel: string) => void;
  onCreateChannel: () => void;
  onInviteTeammates: () => void;
  onProfileClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  workspace,
  currentChannel,
  onChannelSelect,
  onCreateChannel,
  onInviteTeammates,
  onProfileClick
}) => {
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [directMessagesExpanded, setDirectMessagesExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { messages } = useMessages();

  const channels = [
    { id: 'general', name: 'general', isPrivate: false, unreadCount: 2 },
    { id: 'random', name: 'random', isPrivate: false, unreadCount: 0 },
    { id: 'development', name: 'development', isPrivate: false, unreadCount: 5 },
    { id: 'design', name: 'design', isPrivate: true, unreadCount: 1 },
    { id: 'marketing', name: 'marketing', isPrivate: false, unreadCount: 0 },
  ];

  const directMessages = [
    { id: 'dm-1', name: 'Sarah Wilson', presence: 'active', unreadCount: 1 },
    { id: 'dm-2', name: 'Mike Chen', presence: 'away', unreadCount: 0 },
    { id: 'dm-3', name: 'Emma Davis', presence: 'offline', unreadCount: 0 },
    { id: 'dm-4', name: 'John Smith', presence: 'active', unreadCount: 3 },
    { id: 'dm-5', name: 'Lisa Brown', presence: 'dnd', unreadCount: 0 },
  ];

  const getPresenceColor = (presence: string) => {
    switch (presence) {
      case 'active': return 'bg-green-500';
      case 'away': return 'border-2 border-green-500 bg-transparent';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getUnreadCount = (channelId: string) => {
    const channelMessages = messages[channelId] || [];
    // Mock unread count calculation - in a real app, this would be based on last read timestamp
    return Math.floor(Math.random() * 10);
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDirectMessages = directMessages.filter(dm =>
    dm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-64 bg-slack-dark-aubergine text-white flex flex-col">
      {/* Workspace Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-18 truncate">{workspace?.name}</h1>
          </div>
        </div>
        
        <div className="flex items-center mt-1">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="ml-2 text-13 opacity-80">{user?.displayName}</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
          <Input
            type="text"
            placeholder="Search channels"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-md h-8 text-13"
          />
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* Channels Section */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setChannelsExpanded(!channelsExpanded)}
            className="flex items-center justify-between w-full text-white hover:bg-white/10 mb-2 h-7 px-0"
          >
            <div className="flex items-center text-13 font-semibold text-white/70">
              {channelsExpanded ? (
                <ChevronDown className="w-3 h-3 mr-1" />
              ) : (
                <ChevronRight className="w-3 h-3 mr-1" />
              )}
              Channels
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCreateChannel();
              }}
              className="hover:bg-white/20 h-6 w-6 p-0"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </Button>
          
          {channelsExpanded && (
            <div className="space-y-1">
              {filteredChannels.map((channel) => {
                const unreadCount = getUnreadCount(channel.id);
                return (
                  <Button
                    key={channel.id}
                    variant="ghost"
                    onClick={() => onChannelSelect(channel.id)}
                    className={`w-full justify-start text-white hover:bg-white/10 h-7 text-13 font-normal px-2 ${
                      currentChannel === channel.id ? 'bg-white/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center min-w-0">
                        {channel.isPrivate ? (
                          <Lock className="w-4 h-4 mr-2 text-white/60 flex-shrink-0" />
                        ) : (
                          <Hash className="w-4 h-4 mr-2 text-white/60 flex-shrink-0" />
                        )}
                        <span className="truncate">{channel.name}</span>
                      </div>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center ml-2">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {/* Direct Messages Section */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setDirectMessagesExpanded(!directMessagesExpanded)}
            className="flex items-center justify-between w-full text-white hover:bg-white/10 mb-2 h-7 px-0"
          >
            <div className="flex items-center text-13 font-semibold text-white/70">
              {directMessagesExpanded ? (
                <ChevronDown className="w-3 h-3 mr-1" />
              ) : (
                <ChevronRight className="w-3 h-3 mr-1" />
              )}
              Direct messages
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onInviteTeammates();
              }}
              className="hover:bg-white/20 h-6 w-6 p-0"
            >
              <UserPlus className="w-3 h-3" />
            </Button>
          </Button>
          
          {directMessagesExpanded && (
            <div className="space-y-1">
              {filteredDirectMessages.map((dm) => {
                const unreadCount = getUnreadCount(dm.id);
                return (
                  <Button
                    key={dm.id}
                    variant="ghost"
                    onClick={() => onChannelSelect(dm.id)}
                    className={`w-full justify-start text-white hover:bg-white/10 h-7 text-13 font-normal px-2 ${
                      currentChannel === dm.id ? 'bg-white/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center min-w-0">
                        <div className="relative mr-2 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-white/20" />
                          <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${getPresenceColor(dm.presence)}`} />
                        </div>
                        <span className="truncate">{dm.name}</span>
                      </div>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center ml-2">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          onClick={onProfileClick}
          className="w-full justify-start text-white hover:bg-white/10 h-10 px-2"
        >
          <div className="flex items-center">
            <div className="relative mr-3">
              <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-11">
                  {user?.displayName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-medium text-13 truncate">
                {user?.displayName}
              </div>
              <div className="text-white/60 text-11">
                {user?.status.emoji} {user?.status.text || 'Active'}
              </div>
            </div>
            <MoreVertical className="w-4 h-4 text-white/60" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

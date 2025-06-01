
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Hash, 
  Lock, 
  Users, 
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Settings,
  Bell,
  BellOff
} from 'lucide-react';
import { User, Workspace } from '@/contexts/AuthContext';
import InviteTeammatesModal from './InviteTeammatesModal';

interface SidebarProps {
  user: User | null;
  workspace: Workspace | null;
  selectedChannel: string;
  onChannelSelect: (channel: string) => void;
  onUserProfileClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  workspace,
  selectedChannel,
  onChannelSelect,
  onUserProfileClick
}) => {
  const [showChannels, setShowChannels] = useState(true);
  const [showDirectMessages, setShowDirectMessages] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const channels = [
    { id: 'general', name: 'general', isPrivate: false, unread: 0 },
    { id: 'random', name: 'random', isPrivate: false, unread: 3 },
    { id: 'design', name: 'design', isPrivate: true, unread: 1 },
    { id: 'development', name: 'development', isPrivate: false, unread: 0 },
  ];

  const directMessages = [
    { id: 'dm-1', name: 'Sarah Wilson', presence: 'active', unread: 2 },
    { id: 'dm-2', name: 'Mike Chen', presence: 'away', unread: 0 },
    { id: 'dm-3', name: 'Emma Davis', presence: 'offline', unread: 1 },
  ];

  const getPresenceColor = (presence: string) => {
    switch (presence) {
      case 'active': return 'bg-slack-green';
      case 'away': return 'border-2 border-slack-green bg-transparent';
      case 'dnd': return 'bg-slack-red';
      default: return 'bg-gray-400';
    }
  };

  const getPresenceIcon = () => {
    if (!user) return null;
    switch (user.presence) {
      case 'active': return <div className="w-3 h-3 bg-slack-green rounded-full" />;
      case 'away': return <div className="w-3 h-3 border-2 border-slack-green rounded-full" />;
      case 'dnd': return <div className="w-3 h-3 bg-slack-red rounded-full flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-white rounded" />
      </div>;
      default: return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <>
      <div className="w-64 bg-slack-aubergine text-white flex flex-col">
        {/* Workspace Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-18 truncate">{workspace?.name}</h1>
              <div className="flex items-center mt-1">
                {getPresenceIcon()}
                <span className="ml-2 text-13 opacity-80">{user?.displayName}</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10 p-1"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-slack-md h-8 text-13"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          {/* Quick Actions */}
          <div className="px-4 mb-4">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10 h-8 text-13 font-normal"
              >
                <Bell className="mr-3 w-4 h-4" />
                All unreads
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10 h-8 text-13 font-normal"
              >
                <MessageSquare className="mr-3 w-4 h-4" />
                Threads
              </Button>
            </div>
          </div>

          {/* Channels */}
          <div className="px-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => setShowChannels(!showChannels)}
              className="w-full justify-start text-white hover:bg-white/10 h-6 text-13 font-normal p-0"
            >
              {showChannels ? (
                <ChevronDown className="mr-2 w-3 h-3" />
              ) : (
                <ChevronRight className="mr-2 w-3 h-3" />
              )}
              Channels
            </Button>
            {showChannels && (
              <div className="mt-2 space-y-1">
                {channels.map((channel) => (
                  <Button
                    key={channel.id}
                    variant="ghost"
                    onClick={() => onChannelSelect(channel.id)}
                    className={`w-full justify-start text-white hover:bg-white/10 h-6 text-13 font-normal pl-6 ${
                      selectedChannel === channel.id ? 'bg-white/20' : ''
                    }`}
                  >
                    {channel.isPrivate ? (
                      <Lock className="mr-2 w-3 h-3" />
                    ) : (
                      <Hash className="mr-2 w-3 h-3" />
                    )}
                    <span className="truncate">{channel.name}</span>
                    {channel.unread > 0 && (
                      <span className="ml-auto bg-slack-red text-white text-11 px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {channel.unread}
                      </span>
                    )}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:bg-white/10 hover:text-white h-6 text-13 font-normal pl-6"
                >
                  <Plus className="mr-2 w-3 h-3" />
                  Add channels
                </Button>
              </div>
            )}
          </div>

          {/* Direct Messages */}
          <div className="px-4">
            <Button
              variant="ghost"
              onClick={() => setShowDirectMessages(!showDirectMessages)}
              className="w-full justify-start text-white hover:bg-white/10 h-6 text-13 font-normal p-0"
            >
              {showDirectMessages ? (
                <ChevronDown className="mr-2 w-3 h-3" />
              ) : (
                <ChevronRight className="mr-2 w-3 h-3" />
              )}
              Direct messages
            </Button>
            {showDirectMessages && (
              <div className="mt-2 space-y-1">
                {directMessages.map((dm) => (
                  <Button
                    key={dm.id}
                    variant="ghost"
                    onClick={() => onChannelSelect(dm.id)}
                    className={`w-full justify-start text-white hover:bg-white/10 h-6 text-13 font-normal pl-6 ${
                      selectedChannel === dm.id ? 'bg-white/20' : ''
                    }`}
                  >
                    <div className={`mr-2 w-3 h-3 rounded-full ${getPresenceColor(dm.presence)}`} />
                    <span className="truncate">{dm.name}</span>
                    {dm.unread > 0 && (
                      <span className="ml-auto bg-slack-red text-white text-11 px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {dm.unread}
                      </span>
                    )}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  onClick={() => setShowInviteModal(true)}
                  className="w-full justify-start text-white/70 hover:bg-white/10 hover:text-white h-6 text-13 font-normal pl-6"
                >
                  <Plus className="mr-2 w-3 h-3" />
                  Add teammates
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={onUserProfileClick}
            className="w-full justify-start text-white hover:bg-white/10 h-10 text-13 font-normal p-0"
          >
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className="w-8 h-8 bg-white/20 rounded-slack-md flex items-center justify-center">
                  <span className="text-white font-bold text-13">
                    {user?.displayName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1">
                  {getPresenceIcon()}
                </div>
              </div>
              <div className="text-left">
                <div className="font-bold">{user?.displayName}</div>
                <div className="text-11 opacity-70">
                  {user?.status.text || user?.status.emoji || 'Set a status'}
                </div>
              </div>
            </div>
          </Button>
        </div>
      </div>

      <InviteTeammatesModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </>
  );
};

export default Sidebar;

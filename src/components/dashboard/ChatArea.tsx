
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Hash, 
  Users, 
  Star, 
  Phone, 
  Video, 
  Info, 
  Search,
  X
} from 'lucide-react';
import { User } from '@/contexts/AuthContext';
import { useMessages } from '@/contexts/MessageContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ChatAreaProps {
  channel: string;
  user: User | null;
}

const ChatArea: React.FC<ChatAreaProps> = ({ channel, user }) => {
  const { messages } = useMessages();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelMessages = messages[channel] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [channelMessages]);

  const getChannelIcon = () => {
    if (channel.startsWith('dm-')) {
      return <Users className="w-5 h-5" />;
    }
    return <Hash className="w-5 h-5" />;
  };

  const getChannelName = () => {
    if (channel.startsWith('dm-')) {
      const dmNames = {
        'dm-1': 'Sarah Wilson',
        'dm-2': 'Mike Chen',
        'dm-3': 'Emma Davis',
        'dm-4': 'John Smith',
        'dm-5': 'Lisa Brown'
      };
      return dmNames[channel as keyof typeof dmNames] || 'Direct Message';
    }
    return channel;
  };

  const shouldShowAvatar = (messageIndex: number) => {
    if (messageIndex === 0) return true;
    const currentMessage = channelMessages[messageIndex];
    const previousMessage = channelMessages[messageIndex - 1];
    
    // Show avatar if different user or time gap > 5 minutes
    const timeDiff = currentMessage.timestamp.getTime() - previousMessage.timestamp.getTime();
    return currentMessage.userId !== previousMessage.userId || timeDiff > 5 * 60 * 1000;
  };

  const isGroupedMessage = (messageIndex: number) => {
    if (messageIndex === 0) return false;
    const currentMessage = channelMessages[messageIndex];
    const previousMessage = channelMessages[messageIndex - 1];
    
    // Group if same user and within 5 minutes
    const timeDiff = currentMessage.timestamp.getTime() - previousMessage.timestamp.getTime();
    return currentMessage.userId === previousMessage.userId && timeDiff <= 5 * 60 * 1000;
  };

  const handleStarClick = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically save this to a favorites list
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
    }
  };

  const filteredMessages = searchQuery.trim() 
    ? channelMessages.filter(message => 
        message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : channelMessages;

  return (
    <div className="flex flex-col h-full w-full bg-chat-dark min-w-0">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-chat-dark flex-shrink-0">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="text-gray-300 flex-shrink-0">
            {getChannelIcon()}
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-lg text-white truncate">
              {getChannelName()}
            </h2>
            {!channel.startsWith('dm-') && (
              <p className="text-sm text-gray-400">
                {channelMessages.length} {channelMessages.length === 1 ? 'member' : 'members'}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleStarClick}
            className={`hover:text-gray-200 hover:bg-gray-700 ${
              isFavorite ? 'text-yellow-400' : 'text-gray-400'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200 hover:bg-gray-700">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200 hover:bg-gray-700">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200 hover:bg-gray-700">
            <Info className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSearchClick}
            className={`hover:text-gray-200 hover:bg-gray-700 ${
              showSearch ? 'text-white bg-gray-700' : 'text-gray-400'
            }`}
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search Bar (if active) */}
      {showSearch && (
        <div className="p-4 border-b border-gray-700 bg-chat-dark">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder={`Search in ${getChannelName()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-gray-400 mt-2">
              {filteredMessages.length} result{filteredMessages.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="text-gray-400">
                {searchQuery ? <Search className="w-6 h-6" /> : getChannelIcon()}
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {searchQuery 
                ? 'No messages found' 
                : `This is the very beginning of ${getChannelName()}`
              }
            </h3>
            <p className="text-gray-400">
              {searchQuery 
                ? `No messages match "${searchQuery}" in this channel.`
                : channel.startsWith('dm-') 
                  ? 'This is the start of your conversation.'
                  : 'This channel is for workspace-wide communication and announcements.'
              }
            </p>
          </div>
        ) : (
          <div className="pb-4">
            {filteredMessages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                showAvatar={shouldShowAvatar(index)}
                isGrouped={isGroupedMessage(index)}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700 bg-chat-dark flex-shrink-0">
        <MessageInput
          channelId={channel}
          placeholder={`Message ${channel.startsWith('dm-') ? getChannelName() : `#${getChannelName()}`}`}
        />
      </div>
    </div>
  );
};

export default ChatArea;

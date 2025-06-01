
import React, { useState } from 'react';
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
  Smile,
  Paperclip,
  Send
} from 'lucide-react';
import { User } from '@/contexts/AuthContext';

interface ChatAreaProps {
  channel: string;
  user: User | null;
}

const ChatArea: React.FC<ChatAreaProps> = ({ channel, user }) => {
  const [message, setMessage] = useState('');

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
        'dm-3': 'Emma Davis'
      };
      return dmNames[channel as keyof typeof dmNames] || 'Direct Message';
    }
    return channel;
  };

  const sendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message, 'to channel:', channel);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {getChannelIcon()}
          <div>
            <h2 className="font-bold text-lg text-slack-text-primary">
              {getChannelName()}
            </h2>
            {!channel.startsWith('dm-') && (
              <p className="text-sm text-slack-text-secondary">
                Channel description goes here
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Star className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Info className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Welcome message */}
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slack-light-gray rounded-slack-lg flex items-center justify-center mx-auto mb-4">
              {getChannelIcon()}
            </div>
            <h3 className="text-xl font-bold text-slack-text-primary mb-2">
              This is the very beginning of #{getChannelName()}
            </h3>
            <p className="text-slack-text-secondary">
              This channel is for workspace-wide communication and announcements.
            </p>
          </div>

          {/* Sample messages */}
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-slack-aubergine rounded-slack-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-bold text-slack-text-primary">User</span>
                  <span className="text-xs text-slack-text-secondary">9:00 AM</span>
                </div>
                <p className="text-slack-text-primary">
                  Welcome to the team! 👋
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-3">
          <div className="flex-1 border border-gray-300 rounded-slack-lg overflow-hidden">
            <div className="p-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message #${getChannelName()}`}
                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="flex items-center justify-between px-3 pb-3">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={sendMessage}
                disabled={!message.trim()}
                size="sm"
                className="bg-slack-green hover:bg-slack-green/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;

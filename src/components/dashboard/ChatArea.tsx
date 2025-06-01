
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Hash, 
  Users, 
  Info, 
  Phone, 
  Video, 
  Settings,
  Smile,
  Paperclip,
  Send,
  MoreVertical
} from 'lucide-react';
import { User } from '@/contexts/AuthContext';

interface ChatAreaProps {
  channel: string;
  user: User | null;
}

interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: Date;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

const ChatArea: React.FC<ChatAreaProps> = ({ channel, user }) => {
  const [message, setMessage] = useState('');
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Sarah Wilson',
      avatar: 'SW',
      content: 'Hey team! Just wanted to share an update on the design system. We\'ve made great progress this week.',
      timestamp: new Date(2024, 0, 15, 9, 30),
      reactions: [
        { emoji: '👍', count: 3, users: ['Mike Chen', 'Emma Davis', 'John Doe'] },
        { emoji: '🎉', count: 1, users: ['Mike Chen'] }
      ]
    },
    {
      id: '2',
      sender: 'Mike Chen',
      avatar: 'MC',
      content: 'That\'s awesome! The new components look really clean. When do you think we can start implementing them?',
      timestamp: new Date(2024, 0, 15, 9, 35),
    },
    {
      id: '3',
      sender: 'Emma Davis',
      avatar: 'ED',
      content: 'I agree with Mike. The design consistency is much better now. Should we schedule a team sync to discuss the implementation timeline?',
      timestamp: new Date(2024, 0, 15, 9, 42),
      reactions: [
        { emoji: '💯', count: 2, users: ['Sarah Wilson', 'Mike Chen'] }
      ]
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getChannelInfo = () => {
    switch (channel) {
      case 'general':
        return { name: 'general', description: 'Company-wide announcements and work-based matters', memberCount: 42 };
      case 'random':
        return { name: 'random', description: 'Non-work banter and water cooler conversation', memberCount: 38 };
      case 'design':
        return { name: 'design', description: 'Design team collaboration and feedback', memberCount: 8 };
      case 'development':
        return { name: 'development', description: 'Development team discussions and updates', memberCount: 12 };
      default:
        return { name: channel, description: 'Direct message', memberCount: 2 };
    }
  };

  const channelInfo = getChannelInfo();
  const isDM = channel.startsWith('dm-');

  return (
    <div className="flex flex-col h-full">
      {/* Channel Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slack-border bg-slack-white">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            {isDM ? (
              <div className="w-8 h-8 bg-slack-aubergine rounded-slack-md flex items-center justify-center mr-3">
                <span className="text-white text-13 font-bold">
                  {channelInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
            ) : (
              <Hash className="w-6 h-6 text-slack-text-secondary mr-2" />
            )}
            <div>
              <h2 className="text-18 font-bold text-slack-text-primary">
                {channelInfo.name}
              </h2>
              {!isDM && (
                <p className="text-13 text-slack-text-secondary">
                  {channelInfo.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isDM && (
            <>
              <Button variant="ghost" size="sm" className="text-slack-text-secondary hover:text-slack-text-primary">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slack-text-secondary hover:text-slack-text-primary">
                <Video className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" className="text-slack-text-secondary hover:text-slack-text-primary">
            <Users className="w-4 h-4" />
            <span className="ml-1 text-13">{channelInfo.memberCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-slack-text-secondary hover:text-slack-text-primary">
            <Info className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-slack-text-secondary hover:text-slack-text-primary">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, index) => {
          const showAvatar = index === 0 || messages[index - 1].sender !== msg.sender;
          const showTimestamp = showAvatar;

          return (
            <div key={msg.id} className="group">
              <div className="flex items-start space-x-3">
                {showAvatar ? (
                  <div className="w-9 h-9 bg-slack-aubergine rounded-slack-md flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-13 font-bold">{msg.avatar}</span>
                  </div>
                ) : (
                  <div className="w-9 flex-shrink-0 flex justify-center">
                    <span className="text-11 text-slack-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  {showTimestamp && (
                    <div className="flex items-baseline mb-1">
                      <span className="font-bold text-15 text-slack-text-primary mr-2">
                        {msg.sender}
                      </span>
                      <span className="text-11 text-slack-text-muted">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  <div className="text-15 text-slack-text-primary leading-relaxed">
                    {msg.content}
                  </div>
                  
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex items-center space-x-1 mt-2">
                      {msg.reactions.map((reaction, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-11 border-slack-border hover:border-slack-aubergine bg-slack-white hover:bg-slack-light-gray"
                        >
                          <span className="mr-1">{reaction.emoji}</span>
                          <span>{reaction.count}</span>
                        </Button>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-slack-text-muted hover:text-slack-text-primary hover:bg-slack-light-gray rounded-slack-sm"
                      >
                        <Smile className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 text-slack-text-muted hover:text-slack-text-primary h-6 w-6 p-0"
                >
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-slack-border">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative border border-slack-border rounded-slack-lg">
              <Input
                type="text"
                placeholder={`Message ${isDM ? channelInfo.name : '#' + channelInfo.name}`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="border-0 focus:ring-0 text-15 py-3 pr-20 rounded-slack-lg"
              />
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slack-text-muted hover:text-slack-text-primary"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slack-text-muted hover:text-slack-text-primary"
                >
                  <Smile className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slack-aubergine hover:text-slack-aubergine/80 disabled:text-slack-text-muted"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-11 text-slack-text-muted mt-1">
              <span className="font-bold">B</span> bold, <span className="italic">I</span> italic, 
              <span className="line-through">S</span> strike
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;

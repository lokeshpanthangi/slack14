
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  MessageSquare, 
  Smile,
  Reply
} from 'lucide-react';
import { Message, useMessages } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  isGrouped?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  showAvatar = true,
  isGrouped = false 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { addReaction, removeReaction, setSelectedThread } = useMessages();
  const { user } = useAuth();

  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '👏'];

  const formatMessageContent = (content: string) => {
    // Simple mention formatting - in a real app, this would be more sophisticated
    const mentionRegex = /@(\w+)/g;
    const channelRegex = /#(\w+)/g;
    
    let formattedContent = content
      .replace(mentionRegex, '<span class="text-blue-400 hover:underline cursor-pointer">@$1</span>')
      .replace(channelRegex, '<span class="text-blue-400 hover:underline cursor-pointer">#$1</span>');
    
    // Simple formatting
    formattedContent = formattedContent
      .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-700 px-1 rounded text-white">$1</code>');
    
    return formattedContent;
  };

  const handleReaction = (emoji: string) => {
    if (!user) return;
    
    const existingReaction = message.reactions.find(r => r.emoji === emoji);
    const hasUserReacted = existingReaction?.users.includes(user.id);
    
    if (hasUserReacted) {
      removeReaction(message.channelId, message.id, emoji, user.id);
    } else {
      addReaction(message.channelId, message.id, emoji, user.id);
    }
    setShowEmojiPicker(false);
  };

  const handleReplyClick = () => {
    setSelectedThread({ channelId: message.channelId, messageId: message.id });
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    return date.toLocaleDateString();
  };

  return (
    <div 
      className={`group flex items-start space-x-3 hover:bg-slack-message-hover px-4 py-1 ${isGrouped ? 'py-0.5' : 'py-2'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 ${isGrouped ? 'w-8' : ''}`}>
        {showAvatar && !isGrouped && (
          <div className="w-8 h-8 bg-slack-aubergine rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {message.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {isGrouped && (
          <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100">
            {formatTimestamp(message.timestamp)}
          </span>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {!isGrouped && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-bold text-white">{message.username}</span>
            <span className="text-xs text-gray-400">{formatTimestamp(message.timestamp)}</span>
            {message.edited && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
          </div>
        )}
        
        <div 
          className="text-white"
          dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
        />

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={() => handleReaction(reaction.emoji)}
                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border hover:bg-gray-700 ${
                  user && reaction.users.includes(user.id) 
                    ? 'bg-blue-600/20 border-blue-500/30' 
                    : 'bg-gray-700 border-gray-600'
                }`}
              >
                <span>{reaction.emoji}</span>
                <span className="font-medium text-white">{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Thread Preview */}
        {message.replyCount > 0 && (
          <button
            onClick={handleReplyClick}
            className="flex items-center space-x-2 mt-2 text-blue-400 hover:underline text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}</span>
            <span className="text-gray-400">
              Last reply {formatTimestamp(message.replies[message.replies.length - 1]?.timestamp || message.timestamp)}
            </span>
          </button>
        )}
      </div>

      {/* Message Actions */}
      {showActions && (
        <div className="flex-shrink-0 relative">
          <div className="flex items-center space-x-1 bg-gray-700 border border-gray-600 rounded-lg shadow-sm px-1 py-0.5">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-600"
              >
                <Smile className="w-4 h-4" />
              </Button>
              
              {showEmojiPicker && (
                <div className="absolute top-full right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg p-2 grid grid-cols-4 gap-1 z-50">
                  {commonEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-600 rounded"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReplyClick}
              className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-600"
            >
              <Reply className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-600"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;

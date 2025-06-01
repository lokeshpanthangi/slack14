
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useMessages } from '@/contexts/MessageContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

const ThreadSidebar: React.FC = () => {
  const { messages, selectedThread, setSelectedThread } = useMessages();

  if (!selectedThread) return null;

  const channelMessages = messages[selectedThread.channelId] || [];
  const parentMessage = channelMessages.find(msg => msg.id === selectedThread.messageId);

  if (!parentMessage) return null;

  return (
    <div className="w-full h-full bg-slack-chat border-l border-slack-input-border flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slack-input-border bg-slack-chat/95 backdrop-blur-sm">
        <h3 className="font-bold text-lg text-slack-primary">Thread</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedThread(null)}
          className="h-8 w-8 p-0 text-slack-secondary hover:text-slack-primary hover:bg-slack-message-hover transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Thread Messages */}
      <div className="flex-1 overflow-y-auto">
        {/* Parent Message */}
        <div className="border-b border-slack-input-border pb-4 bg-slack-chat/50">
          <MessageBubble message={parentMessage} showAvatar={true} />
        </div>

        {/* Replies */}
        <div className="p-4">
          <div className="text-sm font-medium text-slack-secondary mb-4 animate-fade-in">
            {parentMessage.replyCount} {parentMessage.replyCount === 1 ? 'reply' : 'replies'}
          </div>
          
          <div className="space-y-2">
            {parentMessage.replies.map((reply, index) => (
              <div 
                key={reply.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MessageBubble
                  message={reply}
                  showAvatar={true}
                  isGrouped={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thread Input */}
      <div className="p-4 border-t border-slack-input-border bg-slack-chat/95 backdrop-blur-sm">
        <MessageInput
          channelId={selectedThread.channelId}
          placeholder={`Reply to ${parentMessage.username}...`}
          isThread={true}
          parentMessageId={selectedThread.messageId}
        />
      </div>
    </div>
  );
};

export default ThreadSidebar;

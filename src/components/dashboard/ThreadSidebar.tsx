
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
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-bold text-lg">Thread</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedThread(null)}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Thread Messages */}
      <div className="flex-1 overflow-y-auto">
        {/* Parent Message */}
        <div className="border-b border-gray-200 pb-4">
          <MessageBubble message={parentMessage} showAvatar={true} />
        </div>

        {/* Replies */}
        <div className="p-4">
          <div className="text-sm font-medium text-gray-600 mb-4">
            {parentMessage.replyCount} {parentMessage.replyCount === 1 ? 'reply' : 'replies'}
          </div>
          
          <div className="space-y-2">
            {parentMessage.replies.map((reply, index) => (
              <MessageBubble
                key={reply.id}
                message={reply}
                showAvatar={true}
                isGrouped={false}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Thread Input */}
      <div className="p-4 border-t border-gray-200">
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

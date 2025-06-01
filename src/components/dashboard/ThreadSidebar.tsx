
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Hash, Reply, MoreHorizontal } from 'lucide-react';
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
    <div className="w-full h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-gray-900">Thread</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedThread(null)}
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Thread Messages */}
      <div className="flex-1 overflow-y-auto">
        {/* Parent Message */}
        <div className="border-b border-gray-100 p-4">
          <MessageBubble message={parentMessage} showAvatar={true} />
        </div>

        {/* Replies Header */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Reply className="w-4 h-4" />
            <span className="font-medium">
              {parentMessage.replyCount} {parentMessage.replyCount === 1 ? 'reply' : 'replies'}
            </span>
          </div>
        </div>
        
        {/* Replies */}
        <div className="p-4">
          <div className="space-y-3">
            {parentMessage.replies.map((reply) => (
              <div key={reply.id} className="pl-0">
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
      <div className="p-4 border-t border-gray-200 bg-white">
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

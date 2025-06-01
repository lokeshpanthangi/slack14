
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Bold, 
  Italic, 
  Link,
  Hash
} from 'lucide-react';
import { useMessages } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';

interface MessageInputProps {
  channelId: string;
  placeholder?: string;
  onSend?: () => void;
  isThread?: boolean;
  parentMessageId?: string;
}

interface Mention {
  id: string;
  type: 'user' | 'channel';
  name: string;
  displayName: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  channelId, 
  placeholder = "Type a message...", 
  onSend,
  isThread = false,
  parentMessageId 
}) => {
  const [message, setMessage] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState({ start: 0, end: 0 });
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { addMessage, addReply } = useMessages();
  const { user } = useAuth();

  // Mock workspace members and channels for @mentions
  const workspaceMembers: Mention[] = [
    { id: 'user1', type: 'user', name: 'sarah.wilson', displayName: 'Sarah Wilson' },
    { id: 'user2', type: 'user', name: 'mike.chen', displayName: 'Mike Chen' },
    { id: 'user3', type: 'user', name: 'emma.davis', displayName: 'Emma Davis' },
  ];

  const workspaceChannels: Mention[] = [
    { id: 'general', type: 'channel', name: 'general', displayName: 'general' },
    { id: 'random', type: 'channel', name: 'random', displayName: 'random' },
    { id: 'design', type: 'channel', name: 'design', displayName: 'design' },
  ];

  const allMentions = [...workspaceMembers, ...workspaceChannels];

  const filteredMentions = allMentions.filter(mention =>
    mention.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    mention.displayName.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Check for @mentions
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setShowMentions(true);
      setMentionQuery(mentionMatch[1]);
      setMentionPosition({
        start: cursorPosition - mentionMatch[0].length,
        end: cursorPosition
      });
      setSelectedMentionIndex(0);
    } else {
      setShowMentions(false);
    }

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  const insertMention = (mention: Mention) => {
    const beforeMention = message.slice(0, mentionPosition.start);
    const afterMention = message.slice(mentionPosition.end);
    const mentionText = mention.type === 'user' ? `@${mention.name}` : `#${mention.name}`;
    
    const newMessage = beforeMention + mentionText + ' ' + afterMention;
    setMessage(newMessage);
    setShowMentions(false);
    
    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPosition = beforeMention.length + mentionText.length + 1;
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev < filteredMentions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev > 0 ? prev - 1 : filteredMentions.length - 1
        );
      } else if (e.key === 'Enter' && filteredMentions.length > 0) {
        e.preventDefault();
        insertMention(filteredMentions[selectedMentionIndex]);
      } else if (e.key === 'Escape') {
        setShowMentions(false);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (message.trim() && user) {
      if (isThread && parentMessageId) {
        addReply(channelId, parentMessageId, {
          channelId,
          userId: user.id,
          username: user.displayName,
          content: message.trim()
        });
      } else {
        addMessage(channelId, {
          channelId,
          userId: user.id,
          username: user.displayName,
          content: message.trim()
        });
      }
      
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      onSend?.();
    }
  };

  const formatText = (type: 'bold' | 'italic' | 'code') => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = message.slice(start, end);
    
    let formattedText = '';
    switch (type) {
      case 'bold':
        formattedText = `*${selectedText}*`;
        break;
      case 'italic':
        formattedText = `_${selectedText}_`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
    }
    
    const newMessage = message.slice(0, start) + formattedText + message.slice(end);
    setMessage(newMessage);
    
    // Update cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        const newStart = start + (type === 'code' ? 1 : 1);
        const newEnd = newStart + selectedText.length;
        textareaRef.current.setSelectionRange(newStart, newEnd);
        textareaRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className="relative">
      {showMentions && filteredMentions.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          {filteredMentions.map((mention, index) => (
            <button
              key={mention.id}
              onClick={() => insertMention(mention)}
              className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 ${
                index === selectedMentionIndex ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                {mention.type === 'user' ? (
                  <>
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">
                        {mention.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{mention.displayName}</div>
                      <div className="text-sm text-gray-500">@{mention.name}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Hash className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">#{mention.name}</span>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        {/* Formatting Toolbar */}
        <div className="flex items-center px-3 py-2 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('bold')}
              className="h-7 w-7 p-0"
            >
              <Bold className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('italic')}
              className="h-7 w-7 p-0"
            >
              <Italic className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('code')}
              className="h-7 w-7 p-0 font-mono text-xs"
            >
              {'</>'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
            >
              <Link className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-3">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[22px] max-h-[200px]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            size="sm"
            className="bg-slack-green hover:bg-slack-green/90 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;

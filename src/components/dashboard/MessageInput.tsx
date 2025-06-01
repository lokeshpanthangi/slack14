
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bold, 
  Italic, 
  Code, 
  Link, 
  Smile, 
  Paperclip, 
  AtSign,
  Hash,
  Send
} from 'lucide-react';
import { useMessages } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';

interface MessageInputProps {
  channelId: string;
  placeholder?: string;
  isThread?: boolean;
  parentMessageId?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  channelId, 
  placeholder = "Type a message...",
  isThread = false,
  parentMessageId 
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, addReply } = useMessages();
  const { user } = useAuth();

  const commonEmojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰'];
  
  const workspaceMembers = [
    { id: '1', name: 'Sarah Wilson', username: 'sarah' },
    { id: '2', name: 'Mike Chen', username: 'mike' },
    { id: '3', name: 'Emma Davis', username: 'emma' },
    { id: '4', name: 'John Doe', username: 'john' },
  ];

  const channels = [
    { id: 'general', name: 'general' },
    { id: 'random', name: 'random' },
    { id: 'design', name: 'design' },
    { id: 'development', name: 'development' },
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '22px';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [message]);

  const handleSend = () => {
    if (!message.trim() || !user) return;

    const messageData = {
      channelId,
      userId: user.id,
      username: user.displayName,
      content: message.trim(),
    };

    if (isThread && parentMessageId) {
      addReply(channelId, parentMessageId, messageData);
    } else {
      addMessage(channelId, messageData);
    }

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Check for @ mentions
    const lastAtIndex = value.lastIndexOf('@');
    const lastSpaceIndex = value.lastIndexOf(' ');
    
    if (lastAtIndex > lastSpaceIndex && lastAtIndex !== -1) {
      const searchTerm = value.slice(lastAtIndex + 1);
      setMentionSearch(searchTerm);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (username: string) => {
    const lastAtIndex = message.lastIndexOf('@');
    const beforeMention = message.slice(0, lastAtIndex);
    const newMessage = beforeMention + `@${username} `;
    setMessage(newMessage);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  const insertEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const formatText = (type: string) => {
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
      default:
        return;
    }

    const newMessage = message.slice(0, start) + formattedText + message.slice(end);
    setMessage(newMessage);
    textareaRef.current.focus();
  };

  const filteredMembers = workspaceMembers.filter(member =>
    member.username.toLowerCase().includes(mentionSearch.toLowerCase()) ||
    member.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Mentions Dropdown */}
      {showMentions && filteredMembers.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 bg-slack-input border border-slack-input-border rounded-lg shadow-lg max-h-48 overflow-y-auto z-50 w-64">
          {filteredMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => insertMention(member.username)}
              className="w-full text-left px-3 py-2 hover:bg-slack-message-hover flex items-center space-x-2"
            >
              <div className="w-6 h-6 bg-slack-aubergine rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {member.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-slack-primary font-medium">{member.name}</div>
                <div className="text-slack-muted text-sm">@{member.username}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full right-0 mb-2 bg-slack-input border border-slack-input-border rounded-lg shadow-lg p-3 grid grid-cols-8 gap-1 z-50">
          {commonEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => insertEmoji(emoji)}
              className="w-8 h-8 flex items-center justify-center hover:bg-slack-message-hover rounded text-lg"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Container */}
      <div className="bg-slack-input border border-slack-input-border rounded-lg">
        {/* Formatting Toolbar */}
        <div className="flex items-center space-x-1 p-2 border-b border-slack-input-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('bold')}
            className="h-7 w-7 p-0 text-slack-secondary hover:text-slack-primary hover:bg-slack-message-hover"
          >
            <Bold className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('italic')}
            className="h-7 w-7 p-0 text-slack-secondary hover:text-slack-primary hover:bg-slack-message-hover"
          >
            <Italic className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => formatText('code')}
            className="h-7 w-7 p-0 text-slack-secondary hover:text-slack-primary hover:bg-slack-message-hover"
          >
            <Code className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-slack-secondary hover:text-slack-primary hover:bg-slack-message-hover"
          >
            <Link className="w-3 h-3" />
          </Button>
          <div className="h-4 w-px bg-slack-input-border mx-1" />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-slack-secondary hover:text-slack-primary hover:bg-slack-message-hover"
          >
            <AtSign className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-slack-secondary hover:text-slack-primary hover:bg-slack-message-hover"
          >
            <Hash className="w-3 h-3" />
          </Button>
        </div>

        {/* Text Input */}
        <div className="flex items-end p-3 space-x-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 min-h-[22px] max-h-[200px] resize-none bg-transparent border-none text-slack-primary placeholder:text-slack-muted focus:ring-0 focus:outline-none"
            rows={1}
          />
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-slack-secondary hover:text-slack-primary hover:bg-slack-message-hover"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="h-7 w-7 p-0 text-slack-secondary hover:text-slack-primary hover:bg-slack-message-hover"
            >
              <Smile className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              size="sm"
              className="h-7 w-7 p-0 bg-slack-green hover:bg-slack-green/80 text-white disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;

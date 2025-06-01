
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Message {
  id: string;
  channelId: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  timestamp: Date;
  edited?: boolean;
  editedAt?: Date;
  reactions: { emoji: string; users: string[]; count: number }[];
  replies: Message[];
  replyCount: number;
  threadParticipants: string[];
}

export interface MessageContextType {
  messages: { [channelId: string]: Message[] };
  addMessage: (channelId: string, message: Omit<Message, 'id' | 'timestamp' | 'reactions' | 'replies' | 'replyCount' | 'threadParticipants'>) => void;
  addReply: (channelId: string, messageId: string, reply: Omit<Message, 'id' | 'timestamp' | 'reactions' | 'replies' | 'replyCount' | 'threadParticipants'>) => void;
  addReaction: (channelId: string, messageId: string, emoji: string, userId: string) => void;
  removeReaction: (channelId: string, messageId: string, emoji: string, userId: string) => void;
  selectedThread: { channelId: string; messageId: string } | null;
  setSelectedThread: (thread: { channelId: string; messageId: string } | null) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<{ [channelId: string]: Message[] }>({});
  const [selectedThread, setSelectedThread] = useState<{ channelId: string; messageId: string } | null>(null);

  const addMessage = (channelId: string, messageData: Omit<Message, 'id' | 'timestamp' | 'reactions' | 'replies' | 'replyCount' | 'threadParticipants'>) => {
    const newMessage: Message = {
      ...messageData,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      reactions: [],
      replies: [],
      replyCount: 0,
      threadParticipants: []
    };

    setMessages(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMessage]
    }));
  };

  const addReply = (channelId: string, messageId: string, replyData: Omit<Message, 'id' | 'timestamp' | 'reactions' | 'replies' | 'replyCount' | 'threadParticipants'>) => {
    const reply: Message = {
      ...replyData,
      id: `reply-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      reactions: [],
      replies: [],
      replyCount: 0,
      threadParticipants: []
    };

    setMessages(prev => {
      const channelMessages = prev[channelId] || [];
      return {
        ...prev,
        [channelId]: channelMessages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              replies: [...msg.replies, reply],
              replyCount: msg.replyCount + 1,
              threadParticipants: [...new Set([...msg.threadParticipants, replyData.userId])]
            };
          }
          return msg;
        })
      };
    });
  };

  const addReaction = (channelId: string, messageId: string, emoji: string, userId: string) => {
    setMessages(prev => {
      const channelMessages = prev[channelId] || [];
      return {
        ...prev,
        [channelId]: channelMessages.map(msg => {
          if (msg.id === messageId) {
            const existingReaction = msg.reactions.find(r => r.emoji === emoji);
            if (existingReaction) {
              if (!existingReaction.users.includes(userId)) {
                return {
                  ...msg,
                  reactions: msg.reactions.map(r => 
                    r.emoji === emoji 
                      ? { ...r, users: [...r.users, userId], count: r.count + 1 }
                      : r
                  )
                };
              }
            } else {
              return {
                ...msg,
                reactions: [...msg.reactions, { emoji, users: [userId], count: 1 }]
              };
            }
          }
          return msg;
        })
      };
    });
  };

  const removeReaction = (channelId: string, messageId: string, emoji: string, userId: string) => {
    setMessages(prev => {
      const channelMessages = prev[channelId] || [];
      return {
        ...prev,
        [channelId]: channelMessages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              reactions: msg.reactions.map(r => {
                if (r.emoji === emoji && r.users.includes(userId)) {
                  const newUsers = r.users.filter(u => u !== userId);
                  return { ...r, users: newUsers, count: r.count - 1 };
                }
                return r;
              }).filter(r => r.count > 0)
            };
          }
          return msg;
        })
      };
    });
  };

  return (
    <MessageContext.Provider value={{
      messages,
      addMessage,
      addReply,
      addReaction,
      removeReaction,
      selectedThread,
      setSelectedThread
    }}>
      {children}
    </MessageContext.Provider>
  );
};


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Hash, 
  Users, 
  MessageSquare,
  File,
  Clock
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const searchResults = {
    messages: [
      { id: 1, content: 'Hey team, let\'s discuss the project timeline', channel: 'general', user: 'Sarah Wilson', timestamp: '2 hours ago' },
      { id: 2, content: 'The new design looks great!', channel: 'design', user: 'Mike Chen', timestamp: '1 day ago' }
    ],
    channels: [
      { id: 1, name: 'general', members: 15 },
      { id: 2, name: 'design', members: 8 }
    ],
    people: [
      { id: 1, name: 'Sarah Wilson', title: 'Product Manager', status: 'active' },
      { id: 2, name: 'Mike Chen', title: 'Designer', status: 'away' }
    ],
    files: [
      { id: 1, name: 'project-timeline.pdf', channel: 'general', timestamp: '3 hours ago' },
      { id: 2, name: 'design-mockups.fig', channel: 'design', timestamp: '1 day ago' }
    ]
  };

  const tabs = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'channels', label: 'Channels', icon: Hash },
    { id: 'people', label: 'People', icon: Users },
    { id: 'files', label: 'Files', icon: File }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold">Search</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-4">
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search messages, channels, people, and files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-16 border-gray-300 focus:border-violet-500 focus:ring-violet-500"
              autoFocus
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-none border-b-2 ${
                    activeTab === tab.id
                      ? 'border-violet-500 text-violet-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {searchQuery ? (
              <div className="space-y-4">
                {(activeTab === 'all' || activeTab === 'messages') && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Messages
                    </h3>
                    {searchResults.messages.map((message) => (
                      <div key={message.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                            <span className="text-violet-600 font-medium text-sm">
                              {message.user.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900">{message.user}</span>
                              <Hash className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-500">{message.channel}</span>
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-500">{message.timestamp}</span>
                            </div>
                            <p className="text-gray-700">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(activeTab === 'all' || activeTab === 'channels') && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Hash className="w-4 h-4 mr-2" />
                      Channels
                    </h3>
                    {searchResults.channels.map((channel) => (
                      <div key={channel.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Hash className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="font-medium text-gray-900">#{channel.name}</span>
                            <p className="text-sm text-gray-500">{channel.members} members</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(activeTab === 'all' || activeTab === 'people') && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      People
                    </h3>
                    {searchResults.people.map((person) => (
                      <div key={person.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                            <span className="text-violet-600 font-medium text-sm">
                              {person.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{person.name}</span>
                            <p className="text-sm text-gray-500">{person.title}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ml-auto ${
                            person.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(activeTab === 'all' || activeTab === 'files') && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <File className="w-4 h-4 mr-2" />
                      Files
                    </h3>
                    {searchResults.files.map((file) => (
                      <div key={file.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <File className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="font-medium text-gray-900">{file.name}</span>
                            <p className="text-sm text-gray-500">
                              in #{file.channel} • {file.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Start typing to search across your workspace</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;

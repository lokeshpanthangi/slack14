
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  X, 
  Filter,
  Calendar,
  User,
  Hash,
  File
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  if (!isOpen) return null;

  const searchResults = [
    { type: 'message', content: 'Let\'s discuss the new feature', channel: 'general', user: 'Sarah Wilson', timestamp: '2 hours ago' },
    { type: 'file', name: 'presentation.pdf', channel: 'design', user: 'Mike Chen', timestamp: '1 day ago' },
    { type: 'user', name: 'Emma Davis', status: 'Product Manager', online: true },
    { type: 'channel', name: 'development', description: 'Development discussions', members: 15 }
  ];

  const tabs = [
    { id: 'all', label: 'All', count: 24 },
    { id: 'messages', label: 'Messages', count: 18 },
    { id: 'files', label: 'Files', count: 3 },
    { id: 'people', label: 'People', count: 2 },
    { id: 'channels', label: 'Channels', count: 1 }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Search</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search messages, files, people, and channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              autoFocus
            />
          </div>
          
          {/* Search Filters */}
          <div className="flex items-center space-x-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-400 border-gray-600 hover:bg-gray-700"
            >
              <Filter className="w-3 h-3 mr-1" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-400 border-gray-600 hover:bg-gray-700"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Date
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-400 border-gray-600 hover:bg-gray-700"
            >
              <User className="w-3 h-3 mr-1" />
              Person
            </Button>
          </div>
        </div>

        {/* Search Tabs */}
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {searchResults.map((result, index) => (
              <div key={index} className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
                {result.type === 'message' && (
                  <div className="flex items-start space-x-3">
                    <Hash className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-medium">{result.user}</span>
                        <span className="text-gray-400 text-sm">in #{result.channel}</span>
                        <span className="text-gray-400 text-sm">{result.timestamp}</span>
                      </div>
                      <p className="text-gray-300">{result.content}</p>
                    </div>
                  </div>
                )}
                
                {result.type === 'file' && (
                  <div className="flex items-center space-x-3">
                    <File className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{result.name}</span>
                        <span className="text-gray-400 text-sm">in #{result.channel}</span>
                      </div>
                      <p className="text-gray-400 text-sm">Shared by {result.user} • {result.timestamp}</p>
                    </div>
                  </div>
                )}
                
                {result.type === 'user' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slack-aubergine rounded-md flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {result.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{result.name}</span>
                        {result.online && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                      </div>
                      <p className="text-gray-400 text-sm">{result.status}</p>
                    </div>
                  </div>
                )}
                
                {result.type === 'channel' && (
                  <div className="flex items-center space-x-3">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">#{result.name}</span>
                        <span className="text-gray-400 text-sm">{result.members} members</span>
                      </div>
                      <p className="text-gray-400 text-sm">{result.description}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

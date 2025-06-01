
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  MessageSquare, 
  Bell, 
  Search,
  MoreHorizontal,
  Plus
} from 'lucide-react';

const NavigationSidebar: React.FC = () => {
  return (
    <div className="w-16 bg-violet-600 flex flex-col items-center py-4 space-y-4">
      {/* Workspace Icon */}
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4">
        <span className="text-violet-600 font-bold text-lg">M</span>
      </div>
      
      {/* Navigation Items */}
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 text-white hover:bg-white/20 rounded-lg"
      >
        <Home className="w-5 h-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 text-white hover:bg-white/20 rounded-lg bg-white/20"
      >
        <MessageSquare className="w-5 h-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 text-white hover:bg-white/20 rounded-lg"
      >
        <Bell className="w-5 h-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 text-white hover:bg-white/20 rounded-lg"
      >
        <Search className="w-5 h-5" />
      </Button>
      
      <div className="flex-1" />
      
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 text-white hover:bg-white/20 rounded-lg"
      >
        <Plus className="w-5 h-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 text-white hover:bg-white/20 rounded-lg"
      >
        <MoreHorizontal className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default NavigationSidebar;

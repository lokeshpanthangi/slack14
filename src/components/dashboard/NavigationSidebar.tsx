
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  MessageSquare, 
  Search,
  Settings,
  MoreHorizontal,
  Plus
} from 'lucide-react';

interface NavigationSidebarProps {
  onHomeClick: () => void;
  onDMClick: () => void;
  onSearchClick: () => void;
  onSettingsClick: () => void;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  onHomeClick,
  onDMClick,
  onSearchClick,
  onSettingsClick
}) => {
  return (
    <div className="w-16 bg-slack-aubergine flex flex-col items-center py-4 space-y-4">
      {/* Workspace Icon */}
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4">
        <span className="text-slack-aubergine font-bold text-lg">M</span>
      </div>
      
      {/* Navigation Items */}
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 text-white hover:bg-white/20 rounded-lg"
        onClick={onHomeClick}
      >
        <Home className="w-5 h-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 text-white hover:bg-white/20 rounded-lg"
        onClick={onDMClick}
      >
        <MessageSquare className="w-5 h-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 text-white hover:bg-white/20 rounded-lg"
        onClick={onSearchClick}
      >
        <Search className="w-5 h-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 text-white hover:bg-white/20 rounded-lg"
        onClick={onSettingsClick}
      >
        <Settings className="w-5 h-5" />
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

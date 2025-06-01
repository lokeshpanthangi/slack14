
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  User as UserIcon, 
  Mail, 
  Clock, 
  Settings, 
  LogOut,
  Edit3,
  Camera
} from 'lucide-react';
import { User, useAuth } from '@/contexts/AuthContext';

interface UserProfileProps {
  user: User | null;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose }) => {
  const { logout, updateUserStatus, updateUserPresence } = useAuth();
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusText, setStatusText] = useState(user?.status.text || '');
  const [statusEmoji, setStatusEmoji] = useState(user?.status.emoji || '😀');

  const handleStatusSave = () => {
    updateUserStatus({
      text: statusText,
      emoji: statusEmoji
    });
    setIsEditingStatus(false);
  };

  const handlePresenceChange = (presence: 'active' | 'away' | 'offline' | 'dnd') => {
    updateUserPresence(presence);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const getPresenceText = () => {
    switch (user?.presence) {
      case 'active': return 'Active';
      case 'away': return 'Away';
      case 'dnd': return 'Do not disturb';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const getPresenceColor = () => {
    switch (user?.presence) {
      case 'active': return 'bg-slack-green';
      case 'away': return 'border-2 border-slack-green bg-transparent';
      case 'dnd': return 'bg-slack-red';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slack-text-primary">
            Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-slack-aubergine rounded-slack-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {user?.displayName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute -bottom-1 -right-1 w-6 h-6 p-0 bg-white border border-gray-300 rounded-full"
              >
                <Camera className="w-3 h-3" />
              </Button>
              <div className={`absolute -bottom-1 -left-1 w-4 h-4 rounded-full ${getPresenceColor()}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slack-text-primary">
                {user?.displayName}
              </h3>
              <p className="text-sm text-slack-text-secondary">
                {getPresenceText()}
              </p>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slack-text-primary">Status</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingStatus(!isEditingStatus)}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
            
            {isEditingStatus ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    value={statusEmoji}
                    onChange={(e) => setStatusEmoji(e.target.value)}
                    className="w-16 text-center"
                    maxLength={2}
                  />
                  <Input
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    placeholder="What's your status?"
                    className="flex-1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingStatus(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleStatusSave}
                    className="bg-slack-green hover:bg-slack-green/90"
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slack-light-gray rounded-slack-md">
                <p className="text-sm text-slack-text-primary">
                  {user?.status.emoji} {user?.status.text || 'No status set'}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Presence Settings */}
          <div className="space-y-3">
            <h4 className="font-medium text-slack-text-primary">Set yourself as</h4>
            <div className="space-y-2">
              {[
                { key: 'active', label: 'Active', color: 'bg-slack-green' },
                { key: 'away', label: 'Away', color: 'border-2 border-slack-green bg-transparent' },
                { key: 'dnd', label: 'Do not disturb', color: 'bg-slack-red' },
              ].map((option) => (
                <Button
                  key={option.key}
                  variant="ghost"
                  onClick={() => handlePresenceChange(option.key as any)}
                  className={`w-full justify-start ${
                    user?.presence === option.key ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full mr-3 ${option.color}`} />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* User Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-slack-text-primary">Contact Information</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-slack-text-secondary" />
                <span className="text-slack-text-primary">{user?.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="w-4 h-4 text-slack-text-secondary" />
                <span className="text-slack-text-primary">{user?.timezone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <UserIcon className="w-4 h-4 text-slack-text-secondary" />
                <span className="text-slack-text-primary">{user?.role}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <Settings className="w-4 h-4 mr-3" />
              Account Settings
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-slack-red hover:text-slack-red"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;

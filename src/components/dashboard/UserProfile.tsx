
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, X, Camera, Clock, MapPin, Mail, Smartphone } from 'lucide-react';
import { User as UserType, useAuth } from '@/contexts/AuthContext';

interface UserProfileProps {
  user: UserType | null;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose }) => {
  const { updateUserStatus, updateUserPresence, logout } = useAuth();
  const [statusText, setStatusText] = useState(user?.status.text || '');
  const [statusEmoji, setStatusEmoji] = useState(user?.status.emoji || '');

  const predefinedStatuses = [
    { emoji: '🏠', text: 'Working from home' },
    { emoji: '🤒', text: 'Out sick' },
    { emoji: '🌴', text: 'Vacationing' },
    { emoji: '🚗', text: 'Commuting' },
    { emoji: '📞', text: 'In a meeting' },
    { emoji: '🎧', text: 'Focusing' },
  ];

  const handleStatusUpdate = () => {
    updateUserStatus({ text: statusText, emoji: statusEmoji });
  };

  const handlePresenceChange = (presence: 'active' | 'away' | 'offline' | 'dnd') => {
    updateUserPresence(presence);
  };

  const getPresenceLabel = (presence: string) => {
    switch (presence) {
      case 'active': return 'Active';
      case 'away': return 'Away';
      case 'dnd': return 'Do not disturb';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const getPresenceColor = (presence: string) => {
    switch (presence) {
      case 'active': return 'bg-slack-green';
      case 'away': return 'border-2 border-slack-green bg-transparent';
      case 'dnd': return 'bg-slack-red';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-18 font-bold text-slack-text-primary">Profile</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-start space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-slack-aubergine rounded-slack-xl flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {user?.displayName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full border-2 border-white bg-white"
                >
                  <Camera className="w-3 h-3" />
                </Button>
                <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full ${getPresenceColor(user?.presence || 'offline')} border-2 border-white`}>
                  {user?.presence === 'dnd' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-0.5 bg-white rounded" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slack-text-primary mb-1">
                  {user?.displayName}
                </h2>
                <p className="text-13 text-slack-text-secondary mb-2">
                  {getPresenceLabel(user?.presence || 'offline')}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-13 text-slack-text-secondary">
                    <Mail className="w-4 h-4 mr-2" />
                    {user?.email}
                  </div>
                  <div className="flex items-center text-13 text-slack-text-secondary">
                    <MapPin className="w-4 h-4 mr-2" />
                    {user?.timezone}
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <Label className="text-15 font-bold text-slack-text-primary">
                Set a status
              </Label>
              
              <div className="grid grid-cols-2 gap-2">
                {predefinedStatuses.map((status, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => {
                      setStatusEmoji(status.emoji);
                      setStatusText(status.text);
                    }}
                    className="justify-start h-10 text-13 border-slack-border hover:border-slack-aubergine"
                  >
                    <span className="mr-2">{status.emoji}</span>
                    {status.text}
                  </Button>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="🙂"
                  value={statusEmoji}
                  onChange={(e) => setStatusEmoji(e.target.value)}
                  className="w-16 text-center border-slack-border"
                  maxLength={2}
                />
                <Input
                  type="text"
                  placeholder="What's your status?"
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  className="flex-1 border-slack-border"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slack-text-muted" />
                <span className="text-13 text-slack-text-secondary">
                  Clear after: Never
                </span>
              </div>

              <Button
                onClick={handleStatusUpdate}
                className="bg-slack-aubergine hover:bg-slack-aubergine/90 text-white"
              >
                Save Status
              </Button>
            </div>

            {/* Presence */}
            <div className="space-y-4">
              <Label className="text-15 font-bold text-slack-text-primary">
                Presence
              </Label>
              
              <div className="space-y-2">
                {['active', 'away', 'dnd'].map((presence) => (
                  <Button
                    key={presence}
                    variant="outline"
                    onClick={() => handlePresenceChange(presence as any)}
                    className={`w-full justify-start h-10 text-13 ${
                      user?.presence === presence
                        ? 'border-slack-aubergine bg-slack-light-gray'
                        : 'border-slack-border'
                    }`}
                  >
                    <div className={`mr-3 w-3 h-3 rounded-full ${getPresenceColor(presence)}`}>
                      {presence === 'dnd' && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-1.5 h-0.5 bg-white rounded" />
                        </div>
                      )}
                    </div>
                    {getPresenceLabel(presence)}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-15 font-bold text-slack-text-primary">
                  Full name
                </Label>
                <Input
                  type="text"
                  value={user?.displayName || ''}
                  className="mt-2 border-slack-border"
                  readOnly
                />
              </div>
              
              <div>
                <Label className="text-15 font-bold text-slack-text-primary">
                  Email address
                </Label>
                <Input
                  type="email"
                  value={user?.email || ''}
                  className="mt-2 border-slack-border"
                  readOnly
                />
              </div>

              <div>
                <Label className="text-15 font-bold text-slack-text-primary">
                  Phone number
                </Label>
                <Input
                  type="tel"
                  placeholder="Add phone number"
                  className="mt-2 border-slack-border"
                />
              </div>

              <div>
                <Label className="text-15 font-bold text-slack-text-primary">
                  What I do
                </Label>
                <Input
                  type="text"
                  placeholder="Add your role or what you do"
                  className="mt-2 border-slack-border"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-15 font-bold text-slack-text-primary">
                    Desktop notifications
                  </Label>
                  <p className="text-13 text-slack-text-secondary">
                    Get notified about new messages and activity
                  </p>
                </div>
                <Button variant="outline" className="border-slack-border">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-15 font-bold text-slack-text-primary">
                    Email notifications
                  </Label>
                  <p className="text-13 text-slack-text-secondary">
                    Receive notifications via email
                  </p>
                </div>
                <Button variant="outline" className="border-slack-border">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-15 font-bold text-slack-text-primary">
                    Do not disturb
                  </Label>
                  <p className="text-13 text-slack-text-secondary">
                    Pause notifications temporarily
                  </p>
                </div>
                <Button variant="outline" className="border-slack-border">
                  Set schedule
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-15 font-bold text-slack-text-primary">
                  Timezone
                </Label>
                <p className="text-13 text-slack-text-secondary mb-2">
                  Current timezone: {user?.timezone}
                </p>
                <Button variant="outline" className="border-slack-border">
                  Change timezone
                </Button>
              </div>

              <div>
                <Label className="text-15 font-bold text-slack-text-primary">
                  Language & region
                </Label>
                <p className="text-13 text-slack-text-secondary mb-2">
                  English (US)
                </p>
                <Button variant="outline" className="border-slack-border">
                  Change language
                </Button>
              </div>

              <div className="pt-4 border-t border-slack-border">
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-slack-red text-slack-red hover:bg-slack-red hover:text-white"
                >
                  Sign out
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;

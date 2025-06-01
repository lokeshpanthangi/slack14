
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Users, 
  Shield, 
  Image,
  Bell,
  Trash2,
  Plus
} from 'lucide-react';

interface WorkspaceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({ isOpen, onClose }) => {
  const [workspaceName, setWorkspaceName] = useState('My Workspace');
  const [workspaceDescription, setWorkspaceDescription] = useState('A collaborative workspace for our team');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Workspace Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workspace Name
                    </label>
                    <Input
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="max-w-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={workspaceDescription}
                      onChange={(e) => setWorkspaceDescription(e.target.value)}
                      className="max-w-md"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workspace Icon
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-violet-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">M</span>
                      </div>
                      <Button variant="outline" className="flex items-center">
                        <Image className="w-4 h-4 mr-2" />
                        Change Icon
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="members" className="mt-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Workspace Members</h3>
                  <Button className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Members
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Wilson', email: 'sarah@company.com', role: 'Admin' },
                    { name: 'Mike Chen', email: 'mike@company.com', role: 'Member' },
                    { name: 'Emma Davis', email: 'emma@company.com', role: 'Member' },
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                          <span className="text-violet-600 font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{member.role}</span>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Permissions & Roles</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Channel Creation</h4>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <p className="text-sm text-gray-600">Who can create public and private channels</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Message Deletion</h4>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <p className="text-sm text-gray-600">Who can delete messages in channels</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">File Sharing</h4>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <p className="text-sm text-gray-600">Who can share files and set sharing permissions</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Default Notification Schedule</h4>
                      <p className="text-sm text-gray-600">Set default quiet hours for all members</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Configure email notification preferences</p>
                    </div>
                    <Button variant="outline">Settings</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Advanced Settings</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-red-600">Delete Workspace</h4>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Permanently delete this workspace and all its data. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end space-x-3 p-6 pt-0 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkspaceSettings;

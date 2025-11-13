import { useState, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import {
  User,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  Edit,
  Check,
  X,
  Camera,
  Upload,
  CheckSquare,
} from "lucide-react";
import { User as UserType } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ProfileProps {
  user: UserType;
  onUpdateUser: (updates: Partial<UserType>) => void;
}

export function Profile({ user, onUpdateUser }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [taskAssignments, setTaskAssignments] = useState(true);
  const [fileUploads, setFileUploads] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [chatMessages, setChatMessages] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSaveProfile = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passwordForm.new.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }
    toast.success("Password changed successfully!");
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result as string;
        setEditedUser({ ...editedUser, avatar: newAvatar });
        onUpdateUser({ avatar: newAvatar });
        toast.success("Profile photo updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="mb-1">Profile & Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-teal-600"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-teal-600"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="data-[state=active]:bg-teal-600"
          >
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Account Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-teal-600/20 to-blue-600/20 border-teal-600/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Tasks Completed</p>
                  <h3 className="mt-1">24</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-teal-600/20 flex items-center justify-center">
                  <CheckSquare className="h-6 w-6 text-teal-400" />
                </div>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-600/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Files Shared</p>
                  <h3 className="mt-1">38</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-600/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Projects Active</p>
                  <h3 className="mt-1">3</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-2xl">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-teal-600 hover:bg-teal-700"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
                <div>
                  <h2>{user.name}</h2>
                  <p className="text-gray-400">{user.role}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        user.online ? "bg-green-500" : "bg-gray-500"
                      }`}
                    />
                    <span className="text-sm text-gray-400">
                      {user.online ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  value={editedUser.name}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="bg-gray-900 border-gray-700 disabled:opacity-70"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="bg-gray-900 border-gray-700 disabled:opacity-70"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  value={editedUser.phone}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  className="bg-gray-900 border-gray-700 disabled:opacity-70"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Role
                </Label>
                <Input
                  value={editedUser.role}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, role: e.target.value })
                  }
                  disabled={!isEditing}
                  className="bg-gray-900 border-gray-700 disabled:opacity-70"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  University
                </Label>
                <Input
                  value={editedUser.university}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, university: e.target.value })
                  }
                  disabled={!isEditing}
                  className="bg-gray-900 border-gray-700 disabled:opacity-70"
                />
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                {
                  action: "Completed task",
                  item: "Database Schema Design",
                  time: "2 hours ago",
                  color: "text-green-400",
                },
                {
                  action: "Uploaded file",
                  item: "Technical_Documentation.pdf",
                  time: "5 hours ago",
                  color: "text-blue-400",
                },
                {
                  action: "Joined project",
                  item: "AI-Powered Healthcare App",
                  time: "1 day ago",
                  color: "text-purple-400",
                },
                {
                  action: "Updated profile",
                  item: "Contact information",
                  time: "3 days ago",
                  color: "text-teal-400",
                },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-700"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${activity.color.replace(
                      "text-",
                      "bg-"
                    )}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className={activity.color}>{activity.action}</span>{" "}
                      "{activity.item}"
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="mb-6">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  value={passwordForm.current}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      current: e.target.value,
                    })
                  }
                  className="bg-gray-900 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={passwordForm.new}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, new: e.target.value })
                  }
                  className="bg-gray-900 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordForm.confirm}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirm: e.target.value,
                    })
                  }
                  className="bg-gray-900 border-gray-700"
                />
              </div>
              <Button
                onClick={handleChangePassword}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Update Password
              </Button>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="mb-4">Two-Factor Authentication</h3>
            <p className="text-gray-400 mb-4">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline">Enable Two-Factor Authentication</Button>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="mb-6">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-gray-400">
                    Use dark theme across the application
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={(checked) => {
                    setDarkMode(checked);
                    toast.success(
                      checked ? "Dark mode enabled" : "Light mode enabled"
                    );
                  }}
                />
              </div>
              <div className="p-4 rounded-lg bg-teal-600/10 border border-teal-600/20">
                <p className="text-sm text-teal-400 flex items-center gap-2">
                  <span className="h-2 w-2 bg-teal-400 rounded-full" />
                  Dark mode is currently active for optimal viewing experience
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="mb-6">Notification Preferences</h3>
            <div className="space-y-6">
              <div>
                <h4 className="mb-3 text-teal-400">General Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-400">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={(checked) => {
                        setEmailNotifications(checked);
                        toast.success(
                          checked
                            ? "Email notifications enabled"
                            : "Email notifications disabled"
                        );
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-400">
                        Receive push notifications in browser
                      </p>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={(checked) => {
                        setPushNotifications(checked);
                        toast.success(
                          checked
                            ? "Push notifications enabled"
                            : "Push notifications disabled"
                        );
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-teal-400">Activity Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Task Assignments</Label>
                      <p className="text-sm text-gray-400">
                        When you're assigned a new task
                      </p>
                    </div>
                    <Switch
                      checked={taskAssignments}
                      onCheckedChange={setTaskAssignments}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>File Uploads</Label>
                      <p className="text-sm text-gray-400">
                        When team members upload files
                      </p>
                    </div>
                    <Switch
                      checked={fileUploads}
                      onCheckedChange={setFileUploads}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Deadline Alerts</Label>
                      <p className="text-sm text-gray-400">
                        Reminders for approaching deadlines
                      </p>
                    </div>
                    <Switch
                      checked={deadlineAlerts}
                      onCheckedChange={setDeadlineAlerts}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Chat Messages</Label>
                      <p className="text-sm text-gray-400">
                        When you receive new messages
                      </p>
                    </div>
                    <Switch
                      checked={chatMessages}
                      onCheckedChange={setChatMessages}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Task Reminders</Label>
                      <p className="text-sm text-gray-400">
                        Daily reminders for pending tasks
                      </p>
                    </div>
                    <Switch
                      checked={taskReminders}
                      onCheckedChange={setTaskReminders}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="mb-6">Language & Region</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
              <div className="space-y-2">
                <Label>Language</Label>
                <Input
                  value="English"
                  disabled
                  className="bg-gray-900 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Input
                  value="PKT (UTC+5)"
                  disabled
                  className="bg-gray-900 border-gray-700"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

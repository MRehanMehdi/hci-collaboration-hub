import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { TaskBoard } from "./components/TaskBoard";
import { FileSharing } from "./components/FileSharing";
import { Timeline } from "./components/Timeline";
import { Chat } from "./components/Chat";
import { Profile } from "./components/Profile";
import { Notifications } from "./components/Notifications";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Badge } from "./components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./components/ui/dropdown-menu";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import {
  projects as initialProjects,
  tasks as initialTasks,
  files as initialFiles,
  milestones as initialMilestones,
  messages as initialMessages,
  notifications as initialNotifications,
  users,
  currentUser as initialCurrentUser,
} from "./data/mockData";
import {
  Project,
  Task,
  File,
  Milestone,
  Message,
  Notification,
  User as UserType,
} from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "./components/ui/sonner";
import { useTheme } from "./theme-context";

type View =
  | "dashboard"
  | "tasks"
  | "files"
  | "timeline"
  | "chat"
  | "notifications"
  | "profile";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [currentUser, setCurrentUser] = useState<UserType>(initialCurrentUser);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const navigationItems = [
    { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
    { id: "tasks" as View, label: "Tasks", icon: CheckSquare },
    { id: "files" as View, label: "Files", icon: FileText },
    { id: "timeline" as View, label: "Timeline", icon: Calendar },
    { id: "chat" as View, label: "Chat", icon: MessageSquare },
  ];

  // ------------------------------
  // HANDLERS
  // ------------------------------
  const handleCreateProject = (project: Partial<Project>) => {
    const newProject: Project = {
      id: String(projects.length + 1),
      title: project.title!,
      description: project.description!,
      progress: project.progress || 0,
      deadline: project.deadline!,
      team: project.team || [],
      status: project.status || "ongoing",
      createdAt: project.createdAt || new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
  };

  const handleCreateTask = (task: Partial<Task>) => {
    const newTask: Task = {
      id: String(tasks.length + 1),
      title: task.title!,
      description: task.description || "",
      projectId: task.projectId || "1",
      assigneeId: task.assigneeId!,
      priority: task.priority!,
      status: task.status || "todo",
      dueDate: task.dueDate!,
      subtasks: task.subtasks || [],
      comments: task.comments || [],
      attachments: task.attachments || [],
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  const handleUploadFile = (file: Partial<File>) => {
    const newFile: File = {
      id: String(files.length + 1),
      name: file.name!,
      type: file.type!,
      size: file.size!,
      uploaderId: file.uploaderId!,
      uploadDate: file.uploadDate!,
      projectId: file.projectId || "1",
      version: file.version || 1,
      url: file.url || "#",
    };
    setFiles([...files, newFile]);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(files.filter((f) => f.id !== fileId));
  };

  const handleCreateMilestone = (milestone: Partial<Milestone>) => {
    const newMilestone: Milestone = {
      id: String(milestones.length + 1),
      title: milestone.title!,
      week: milestone.week!,
      status: milestone.status!,
      projectId: milestone.projectId || "1",
    };
    setMilestones([...milestones, newMilestone]);
  };

  const handleSendMessage = (message: Partial<Message>) => {
    const newMessage: Message = {
      id: String(messages.length + 1),
      userId: message.userId!,
      text: message.text!,
      timestamp: message.timestamp!,
      attachments: message.attachments,
      reactions: message.reactions,
      threadId: message.threadId,
      pinned: message.pinned,
    };
    setMessages([...messages, newMessage]);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  const handleUpdateUser = (updates: Partial<UserType>) => {
    setCurrentUser({ ...currentUser, ...updates });
  };

  // ------------------------------
  // RENDER VIEW
  // ------------------------------
  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            projects={projects}
            users={users}
            onProjectSelect={() => setCurrentView("tasks")}
            onCreateProject={handleCreateProject}
          />
        );
      case "tasks":
        return (
          <TaskBoard
            tasks={tasks}
            users={users}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
          />
        );
      case "files":
        return (
          <FileSharing
            files={files}
            users={users}
            onUploadFile={handleUploadFile}
            onDeleteFile={handleDeleteFile}
          />
        );
      case "timeline":
        return (
          <Timeline
            milestones={milestones}
            onCreateMilestone={handleCreateMilestone}
          />
        );
      case "chat":
        return (
          <Chat
            messages={messages}
            users={users}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
          />
        );
      case "notifications":
        return (
          <Notifications
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteNotification={handleDeleteNotification}
          />
        );
      case "profile":
        return <Profile user={currentUser} onUpdateUser={handleUpdateUser} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* Top Navigation Bar */}
      <nav
        className={`border-b sticky top-0 z-50 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-gray-100 border-gray-200"
        }`}
      >
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <CheckSquare className="h-5 w-5 text-white" />
                </div>
                <h2 className="hidden sm:block">CollabHub</h2>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    onClick={() => setCurrentView(item.id)}
                    className={
                      currentView === item.id
                        ? "bg-teal-600 hover:bg-teal-700"
                        : ""
                    }
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}

              {/* Theme toggle button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                title="Toggle Dark/Light Mode"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setCurrentView("notifications")}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-600 text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback>
                        {currentUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block">{currentUser.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-gray-100 border-gray-200"
                  }
                  align="end"
                >
                  <DropdownMenuItem
                    onClick={() => setCurrentView("profile")}
                    className="cursor-pointer"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile & Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setCurrentView("notifications")}
                    className="cursor-pointer"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                    {unreadNotifications > 0 && (
                      <Badge className="ml-auto bg-red-600">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator
                    className={theme === "dark" ? "bg-gray-700" : "bg-gray-300"}
                  />
                  <DropdownMenuItem className="cursor-pointer text-red-400">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden border-t overflow-hidden"
                style={{
                  borderColor: theme === "dark" ? "#374151" : "#d1d5db",
                }}
              >
                <div className="py-4 space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={currentView === item.id ? "default" : "ghost"}
                        onClick={() => {
                          setCurrentView(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full justify-start ${
                          currentView === item.id
                            ? "bg-teal-600 hover:bg-teal-700"
                            : ""
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 lg:px-6 py-6">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderView()}
        </motion.div>
      </main>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        theme={theme === "dark" ? "dark" : "light"}
      />
    </div>
  );
}

import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import {
  CheckCheck,
  Bell,
  FileText,
  MessageSquare,
  Calendar,
  Trash2,
  Filter,
} from "lucide-react";
import { Notification } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (notificationId: string) => void;
}

export function Notifications({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
}: NotificationsProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read;
    if (filter === "all") return true;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task":
        return <CheckCheck className="h-5 w-5 text-blue-400" />;
      case "file":
        return <FileText className="h-5 w-5 text-green-400" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-purple-400" />;
      case "deadline":
        return <Calendar className="h-5 w-5 text-red-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "task":
        return "bg-blue-600/10 border-blue-600/20";
      case "file":
        return "bg-green-600/10 border-green-600/20";
      case "message":
        return "bg-purple-600/10 border-purple-600/20";
      case "deadline":
        return "bg-red-600/10 border-red-600/20";
      default:
        return "bg-gray-600/10 border-gray-600/20";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes} minutes ago`;
    }
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead();
    toast.success("All notifications marked as read");
  };

  const handleDelete = (id: string) => {
    onDeleteNotification(id);
    toast.success("Notification deleted");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="mb-1">Notifications Center</h1>
          <p className="text-gray-400">
            {unreadCount > 0
              ? `${unreadCount} unread notification${
                  unreadCount > 1 ? "s" : ""
                }`
              : "All caught up! 🎉"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-600/30 p-4">
          <div className="flex items-center gap-3">
            <CheckCheck className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Tasks</p>
              <p className="text-xl">
                {notifications.filter((n) => n.type === "task").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-600/30 p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Files</p>
              <p className="text-xl">
                {notifications.filter((n) => n.type === "file").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-600/30 p-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Messages</p>
              <p className="text-xl">
                {notifications.filter((n) => n.type === "message").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-red-600/20 to-red-800/20 border-red-600/30 p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-red-400" />
            <div>
              <p className="text-sm text-gray-400">Deadlines</p>
              <p className="text-xl">
                {notifications.filter((n) => n.type === "deadline").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={setFilter} className="space-y-6">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-teal-600">
            All
            {notifications.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-gray-700">
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            className="data-[state=active]:bg-teal-600"
          >
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-red-600">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="task" className="data-[state=active]:bg-teal-600">
            Tasks
            {notifications.filter((n) => n.type === "task").length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-blue-600">
                {notifications.filter((n) => n.type === "task").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="file" className="data-[state=active]:bg-teal-600">
            Files
            {notifications.filter((n) => n.type === "file").length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-green-600">
                {notifications.filter((n) => n.type === "file").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="message"
            className="data-[state=active]:bg-teal-600"
          >
            Messages
            {notifications.filter((n) => n.type === "message").length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-purple-600">
                {notifications.filter((n) => n.type === "message").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="deadline"
            className="data-[state=active]:bg-teal-600"
          >
            Deadlines
            {notifications.filter((n) => n.type === "deadline").length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-red-600">
                {notifications.filter((n) => n.type === "deadline").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-0">
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="space-y-3">
              <AnimatePresence>
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`bg-gray-800 border-gray-700 p-4 hover:border-teal-600 transition-all cursor-pointer group ${
                        !notification.read
                          ? "border-l-4 border-l-teal-600 bg-gray-800/70"
                          : ""
                      }`}
                      onClick={() =>
                        !notification.read && onMarkAsRead(notification.id)
                      }
                    >
                      <div className="flex gap-4">
                        <div
                          className={`h-12 w-12 rounded-full ${getNotificationColor(
                            notification.type
                          )} flex items-center justify-center shrink-0`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="line-clamp-1">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-teal-500 rounded-full shrink-0" />
                                )}
                              </div>
                              <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                                {notification.description}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notification.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.timestamp)}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {notification.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredNotifications.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gray-800 border-gray-700 p-12">
                    <div className="text-center text-gray-400">
                      <motion.div
                        animate={{
                          rotate: [0, -10, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      >
                        <Bell className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                      </motion.div>
                      <h3 className="mb-2">No notifications</h3>
                      <p className="text-sm">
                        {filter === "unread"
                          ? "You're all caught up! No unread notifications."
                          : `No ${
                              filter === "all" ? "" : filter
                            } notifications to display.`}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

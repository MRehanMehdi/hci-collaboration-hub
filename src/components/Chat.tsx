import { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  Send,
  Paperclip,
  Smile,
  Bot,
  Users,
  Pin,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { Message, User } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface ChatProps {
  messages: Message[];
  users: User[];
  currentUser: User;
  onSendMessage: (message: Partial<Message>) => void;
}

export function Chat({
  messages,
  users,
  currentUser,
  onSendMessage,
}: ChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<
    Array<{ role: "user" | "ai"; text: string }>
  >([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage({
        userId: currentUser.id,
        text: newMessage,
        timestamp: new Date().toISOString(),
      });
      setNewMessage("");

      // Simulate typing indicator
      setTypingUsers(["2"]);
      setTimeout(() => setTypingUsers([]), 2000);
    }
  };

  const handleAIQuery = () => {
    if (aiInput.trim()) {
      setAiMessages([...aiMessages, { role: "user", text: aiInput }]);
      setAiInput("");

      // Simulate AI response
      setTimeout(() => {
        let response = "";
        const query = aiInput.toLowerCase();

        if (query.includes("task") || query.includes("due")) {
          response =
            "You have 3 tasks due this week:\n1. Design User Interface Mockups (Due Nov 15)\n2. Conduct User Research (Due Nov 18)\n3. Product Catalog Implementation (Due Nov 17)";
        } else if (query.includes("progress") || query.includes("status")) {
          response =
            "Project Status Summary:\n• AI-Powered Healthcare App: 65% complete\n• E-Commerce Platform: 40% complete\n• Smart City IoT Project: 85% complete";
        } else if (query.includes("deadline") || query.includes("suggest")) {
          response =
            "Based on your current progress, I suggest:\n• Complete UI mockups by end of week\n• Schedule user research interviews\n• Review and test authentication system";
        } else {
          response =
            "I can help you with:\n• Summarizing project updates\n• Suggesting deadlines\n• Showing tasks due this week\n• Tracking team progress\n\nTry asking: 'Show tasks due this week' or 'What's the project status?'";
        }

        setAiMessages((prev) => [...prev, { role: "ai", text: response }]);
      }, 1000);
    }
  };

  const getUser = (userId: string) => users.find((u) => u.id === userId);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleReaction = (messageId: string) => {
    // Handle reaction logic
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Main Chat */}
      <div
        className={`${
          showAIChat ? "lg:col-span-2" : "lg:col-span-3"
        } flex flex-col`}
      >
        <Card className="bg-gray-800 border-gray-700 flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Users className="h-10 w-10 p-2 bg-gray-700 rounded-full" />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-gray-800" />
                </div>
                <div>
                  <h3>Team Chat</h3>
                  <p className="text-sm text-gray-400">
                    {users.filter((u) => u.online).length} members online
                  </p>
                </div>
              </div>
              <Button
                variant={showAIChat ? "default" : "outline"}
                onClick={() => setShowAIChat(!showAIChat)}
                className={showAIChat ? "bg-teal-600 hover:bg-teal-700" : ""}
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => {
                const user = getUser(message.userId);
                const isCurrentUser = message.userId === currentUser.id;

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-3 ${
                      isCurrentUser ? "flex-row-reverse" : ""
                    }`}
                  >
                    {!isCurrentUser && user && (
                      <Avatar className="h-10 w-10 mt-1">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`flex-1 max-w-[70%] ${
                        isCurrentUser ? "flex flex-col items-end" : ""
                      }`}
                    >
                      {!isCurrentUser && user && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{user.name}</span>
                          {user.online && (
                            <div className="h-2 w-2 bg-green-500 rounded-full" />
                          )}
                        </div>
                      )}

                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isCurrentUser
                            ? "bg-teal-600 text-white"
                            : "bg-gray-700"
                        }`}
                      >
                        {message.pinned && (
                          <div className="flex items-center gap-1 text-xs text-yellow-400 mb-1">
                            <Pin className="h-3 w-3" />
                            <span>Pinned</span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{message.text}</p>
                        {message.attachments &&
                          message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((attachment, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 text-sm bg-gray-800 rounded px-2 py-1"
                                >
                                  <Paperclip className="h-3 w-3" />
                                  <span>{attachment}</span>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>

                      <div
                        className={`flex items-center gap-3 mt-1 ${
                          isCurrentUser ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex items-center gap-1">
                            {message.reactions.map((reaction, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs px-2 py-0"
                              >
                                {reaction.emoji} {reaction.userIds.length}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {!isCurrentUser && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={() => handleReaction(message.id)}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing Indicator */}
              <AnimatePresence>
                {typingUsers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-gray-400 text-sm"
                  >
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                        className="h-2 w-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: 0.2,
                        }}
                        className="h-2 w-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: 0.4,
                        }}
                        className="h-2 w-2 bg-gray-400 rounded-full"
                      />
                    </div>
                    <span>Someone is typing...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Smile className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="bg-gray-900 border-gray-700"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-teal-600 hover:bg-teal-700 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Chat Panel */}
      <AnimatePresence>
        {showAIChat && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="lg:col-span-1"
          >
            <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
              {/* AI Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3>AI Assistant</h3>
                    <p className="text-sm text-gray-400">Always here to help</p>
                  </div>
                </div>
              </div>

              {/* AI Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {aiMessages.length === 0 ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="h-16 w-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <Bot className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h4>How can I assist you?</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          Ask me about tasks, deadlines, or project status
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Badge
                          className="cursor-pointer hover:bg-teal-600"
                          onClick={() => setAiInput("Show tasks due this week")}
                        >
                          Tasks due this week
                        </Badge>
                        <Badge
                          className="cursor-pointer hover:bg-teal-600"
                          onClick={() =>
                            setAiInput("What's the project status?")
                          }
                        >
                          Project status
                        </Badge>
                        <Badge
                          className="cursor-pointer hover:bg-teal-600"
                          onClick={() => setAiInput("Suggest deadlines")}
                        >
                          Suggest deadlines
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    aiMessages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${
                          msg.role === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        {msg.role === "ai" && (
                          <div className="h-8 w-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[80%] ${
                            msg.role === "user"
                              ? "bg-teal-600 text-white"
                              : "bg-gray-700"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm">
                            {msg.text}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* AI Input */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask AI assistant..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAIQuery()}
                    className="bg-gray-900 border-gray-700"
                  />
                  <Button
                    onClick={handleAIQuery}
                    className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

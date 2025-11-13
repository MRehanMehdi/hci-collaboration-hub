import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Plus,
  Calendar,
  User,
  AlertCircle,
  MessageSquare,
  Paperclip,
  Check,
} from "lucide-react";
import { Task, User as UserType } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface TaskBoardProps {
  tasks: Task[];
  users: UserType[];
  onCreateTask: (task: Partial<Task>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskBoard({
  tasks,
  users,
  onCreateTask,
  onUpdateTask,
}: TaskBoardProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    assigneeId: "",
    dueDate: "",
  });
  const [newComment, setNewComment] = useState("");

  const columns = [
    { id: "todo", title: "To-Do", color: "border-gray-600" },
    { id: "inprogress", title: "In Progress", color: "border-blue-600" },
    { id: "completed", title: "Completed", color: "border-green-600" },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => {
      const matchesStatus = task.status === status;
      const matchesFilter =
        filterType === "all" ||
        (filterType === "my" && task.assigneeId === "1") ||
        (filterType === "team" && task.assigneeId !== "1");
      return matchesStatus && matchesFilter;
    });
  };

  const handleCreateTask = () => {
    if (newTask.title && newTask.assigneeId && newTask.dueDate) {
      onCreateTask({
        ...newTask,
        status: "todo",
        projectId: "1",
        subtasks: [],
        comments: [],
        attachments: [],
      });
      setIsCreateModalOpen(false);
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        assigneeId: "",
        dueDate: "",
      });
    }
  };

  const handleAddComment = () => {
    if (newComment && selectedTask) {
      const updatedComments = [
        ...selectedTask.comments,
        {
          id: `c${Date.now()}`,
          userId: "1",
          text: newComment,
          timestamp: new Date().toISOString(),
        },
      ];
      onUpdateTask(selectedTask.id, { comments: updatedComments });
      setSelectedTask({ ...selectedTask, comments: updatedComments });
      setNewComment("");
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    if (selectedTask) {
      const updatedSubtasks = selectedTask.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      onUpdateTask(selectedTask.id, { subtasks: updatedSubtasks });
      setSelectedTask({ ...selectedTask, subtasks: updatedSubtasks });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-600";
      case "medium":
        return "bg-yellow-600";
      case "low":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  const getAssignee = (assigneeId: string) =>
    users.find((u) => u.id === assigneeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1">Task Management</h1>
          <p className="text-gray-400">Organize and track your project tasks</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to your project
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Task Title</Label>
                <Input
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="bg-gray-900 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="bg-gray-900 border-gray-700"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: any) =>
                      setNewTask({ ...newTask, priority: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className="bg-gray-900 border-gray-700"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select
                  value={newTask.assigneeId}
                  onValueChange={(value) =>
                    setNewTask({ ...newTask, assigneeId: value })
                  }
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleCreateTask}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filterType === "all" ? "default" : "outline"}
          onClick={() => setFilterType("all")}
          className={
            filterType === "all" ? "bg-teal-600 hover:bg-teal-700" : ""
          }
        >
          All Tasks
        </Button>
        <Button
          variant={filterType === "my" ? "default" : "outline"}
          onClick={() => setFilterType("my")}
          className={filterType === "my" ? "bg-teal-600 hover:bg-teal-700" : ""}
        >
          My Tasks
        </Button>
        <Button
          variant={filterType === "team" ? "default" : "outline"}
          onClick={() => setFilterType("team")}
          className={
            filterType === "team" ? "bg-teal-600 hover:bg-teal-700" : ""
          }
        >
          Team Tasks
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);

          return (
            <div key={column.id} className="space-y-4">
              <div className={`border-l-4 ${column.color} pl-4`}>
                <h3 className="mb-1">{column.title}</h3>
                <p className="text-gray-400 text-sm">
                  {columnTasks.length} tasks
                </p>
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-3 pr-4">
                  {columnTasks.map((task, index) => {
                    const assignee = getAssignee(task.assigneeId);
                    const isOverdue =
                      new Date(task.dueDate) < new Date() &&
                      task.status !== "completed";

                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className="bg-gray-800 border-gray-700 hover:border-teal-600 transition-all cursor-pointer p-4"
                          onClick={() => setSelectedTask(task)}
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="flex-1">{task.title}</h4>
                              <Badge
                                className={`${getPriorityColor(
                                  task.priority
                                )} text-xs`}
                              >
                                {task.priority}
                              </Badge>
                            </div>

                            {task.description && (
                              <p className="text-gray-400 text-sm line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                <span
                                  className={`text-xs ${
                                    isOverdue ? "text-red-400" : "text-gray-400"
                                  }`}
                                >
                                  {new Date(task.dueDate).toLocaleDateString(
                                    "en-US",
                                    { month: "short", day: "numeric" }
                                  )}
                                </span>
                              </div>

                              {assignee && (
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={assignee.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {assignee.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>

                            {(task.subtasks.length > 0 ||
                              task.comments.length > 0 ||
                              task.attachments.length > 0) && (
                              <div className="flex items-center gap-3 pt-2 border-t border-gray-700">
                                {task.subtasks.length > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Check className="h-3 w-3" />
                                    <span>
                                      {
                                        task.subtasks.filter(
                                          (st) => st.completed
                                        ).length
                                      }
                                      /{task.subtasks.length}
                                    </span>
                                  </div>
                                )}
                                {task.comments.length > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <MessageSquare className="h-3 w-3" />
                                    <span>{task.comments.length}</span>
                                  </div>
                                )}
                                {task.attachments.length > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Paperclip className="h-3 w-3" />
                                    <span>{task.attachments.length}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      <Dialog
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      >
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <DialogTitle className="flex-1">
                    {selectedTask.title}
                  </DialogTitle>
                  <Badge
                    className={`${getPriorityColor(selectedTask.priority)}`}
                  >
                    {selectedTask.priority}
                  </Badge>
                </div>
                <DialogDescription>
                  View and manage task details
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Description */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <p className="text-gray-400">{selectedTask.description}</p>
                </div>

                {/* Task Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assignee</Label>
                    <div className="flex items-center gap-2">
                      {getAssignee(selectedTask.assigneeId) && (
                        <>
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={getAssignee(selectedTask.assigneeId)!.avatar}
                            />
                            <AvatarFallback>
                              {getAssignee(selectedTask.assigneeId)!
                                .name.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>
                            {getAssignee(selectedTask.assigneeId)!.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>
                        {new Date(selectedTask.dueDate).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtasks */}
                {selectedTask.subtasks.length > 0 && (
                  <div className="space-y-3">
                    <Label>Subtasks</Label>
                    <div className="space-y-2">
                      {selectedTask.subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="flex items-center gap-2"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => handleToggleSubtask(subtask.id)}
                          >
                            {subtask.completed ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <div className="h-4 w-4 border border-gray-600 rounded" />
                            )}
                          </Button>
                          <span
                            className={
                              subtask.completed
                                ? "line-through text-gray-500"
                                : ""
                            }
                          >
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="bg-gray-700" />

                {/* Comments */}
                <div className="space-y-3">
                  <Label>Comments</Label>
                  <ScrollArea className="h-[200px] rounded-md border border-gray-700 p-4">
                    <div className="space-y-4">
                      {selectedTask.comments.map((comment) => {
                        const commenter = users.find(
                          (u) => u.id === comment.userId
                        );
                        return (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={commenter?.avatar} />
                              <AvatarFallback>
                                {commenter?.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">
                                  {commenter?.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400">
                                {comment.text}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="bg-gray-900 border-gray-700"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddComment()
                      }
                    />
                    <Button
                      onClick={handleAddComment}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Post
                    </Button>
                  </div>
                </div>

                {/* Status Change */}
                <div className="space-y-2">
                  <Label>Change Status</Label>
                  <Select
                    value={selectedTask.status}
                    onValueChange={(value: any) => {
                      onUpdateTask(selectedTask.id, { status: value });
                      setSelectedTask({ ...selectedTask, status: value });
                    }}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="todo">To-Do</SelectItem>
                      <SelectItem value="inprogress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

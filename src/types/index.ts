export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  university: string;
  avatar: string;
  online: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  team: string[];
  status: 'ongoing' | 'completed' | 'archived';
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'inprogress' | 'completed';
  dueDate: string;
  subtasks: SubTask[];
  comments: Comment[];
  attachments: string[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaderId: string;
  uploadDate: string;
  projectId: string;
  version: number;
  url: string;
}

export interface Message {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  attachments?: string[];
  reactions?: { emoji: string; userIds: string[] }[];
  threadId?: string;
  pinned?: boolean;
}

export interface Notification {
  id: string;
  type: 'task' | 'file' | 'message' | 'deadline';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link: string;
}

export interface Milestone {
  id: string;
  title: string;
  week: number;
  status: 'completed' | 'inprogress' | 'pending' | 'overdue';
  projectId: string;
}

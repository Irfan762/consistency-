export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'completed';
export type Category = 'daily' | 'learning' | 'hackathon' | 'project';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  status: Status;
  category: Category;
  hackathonId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hackathon {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  url?: string;
  tasks: string[];
  createdAt: Date;
}

export interface DailyStats {
  date: string;
  completed: number;
  total: number;
}

export interface WeeklyProgress {
  week: string;
  completionRate: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

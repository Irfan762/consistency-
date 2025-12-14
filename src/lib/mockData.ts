import { Task, Hackathon, DailyStats } from '@/types';
import { addDays, subDays, format } from 'date-fns';

const today = new Date();

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete React tutorial',
    description: 'Finish the advanced React patterns section',
    dueDate: today,
    priority: 'high',
    status: 'pending',
    category: 'learning',
    createdAt: subDays(today, 3),
    updatedAt: today,
  },
  {
    id: '2',
    title: 'Review team code submissions',
    description: 'Go through pull requests for the hackathon project',
    dueDate: today,
    priority: 'high',
    status: 'pending',
    category: 'hackathon',
    hackathonId: '1',
    createdAt: subDays(today, 1),
    updatedAt: today,
  },
  {
    id: '3',
    title: 'Morning workout routine',
    description: '30 minutes cardio + stretching',
    dueDate: today,
    priority: 'medium',
    status: 'completed',
    category: 'daily',
    createdAt: today,
    updatedAt: today,
  },
  {
    id: '4',
    title: 'Prepare hackathon pitch deck',
    description: 'Create slides for the final presentation',
    dueDate: addDays(today, 2),
    priority: 'high',
    status: 'pending',
    category: 'hackathon',
    hackathonId: '1',
    createdAt: subDays(today, 2),
    updatedAt: today,
  },
  {
    id: '5',
    title: 'Read system design book',
    description: 'Chapter 5: Distributed Systems',
    dueDate: addDays(today, 1),
    priority: 'medium',
    status: 'pending',
    category: 'learning',
    createdAt: subDays(today, 5),
    updatedAt: today,
  },
  {
    id: '6',
    title: 'Update portfolio website',
    description: 'Add new projects and update bio',
    dueDate: addDays(today, 5),
    priority: 'low',
    status: 'pending',
    category: 'project',
    createdAt: subDays(today, 7),
    updatedAt: today,
  },
  {
    id: '7',
    title: 'Meditate for 15 minutes',
    description: 'Morning mindfulness session',
    dueDate: today,
    priority: 'low',
    status: 'completed',
    category: 'daily',
    createdAt: today,
    updatedAt: today,
  },
  {
    id: '8',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for the project',
    dueDate: addDays(today, 3),
    priority: 'medium',
    status: 'pending',
    category: 'project',
    createdAt: subDays(today, 4),
    updatedAt: today,
  },
];

export const mockHackathons: Hackathon[] = [
  {
    id: '1',
    name: 'HackMIT 2024',
    startDate: addDays(today, 7),
    endDate: addDays(today, 9),
    description: 'Build innovative solutions for real-world problems',
    url: 'https://hackmit.org',
    tasks: ['2', '4'],
    createdAt: subDays(today, 14),
  },
  {
    id: '2',
    name: 'ETHGlobal Hackathon',
    startDate: addDays(today, 21),
    endDate: addDays(today, 23),
    description: 'Web3 and blockchain focused hackathon',
    url: 'https://ethglobal.com',
    tasks: [],
    createdAt: subDays(today, 7),
  },
  {
    id: '3',
    name: 'AI Innovation Challenge',
    startDate: addDays(today, 45),
    endDate: addDays(today, 47),
    description: 'Build AI-powered applications',
    tasks: [],
    createdAt: subDays(today, 3),
  },
];

export const generateDailyStats = (): DailyStats[] => {
  const stats: DailyStats[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const total = Math.floor(Math.random() * 5) + 3;
    const completed = Math.floor(Math.random() * total) + 1;
    stats.push({
      date: format(date, 'EEE'),
      completed,
      total,
    });
  }
  return stats;
};

export const generateWeeklyProgress = () => {
  return [
    { week: 'Week 1', completionRate: 65 },
    { week: 'Week 2', completionRate: 72 },
    { week: 'Week 3', completionRate: 58 },
    { week: 'Week 4', completionRate: 85 },
  ];
};

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, Hackathon } from '@/types';
import { generateDailyStats, generateWeeklyProgress } from '@/lib/mockData';
import { api } from '@/lib/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardView } from '@/components/views/DashboardView';
import { TasksView } from '@/components/views/TasksView';
import { CalendarView } from '@/components/views/CalendarView';
import { HackathonsView } from '@/components/views/HackathonsView';
import { ProgressView } from '@/components/views/ProgressView';
import { SettingsView } from '@/components/views/SettingsView';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { HackathonDialog } from '@/components/hackathons/HackathonDialog';
import { SearchDialog } from '@/components/search/SearchDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { isToday } from 'date-fns';


const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [dailyStats] = useState(generateDailyStats());
  const [weeklyProgress] = useState(generateWeeklyProgress());

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [hackathonDialogOpen, setHackathonDialogOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [clearDataDialogOpen, setClearDataDialogOpen] = useState(false);

  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    hackathonAlerts: true,
    browserNotifications: false,
  });

  const pendingTodayTasks = tasks.filter(
    (t) => t.status === 'pending' && isToday(new Date(t.dueDate))
  ).length;

  // Define loadData first
  const loadData = async () => {
    try {
      const [fetchedTasks, fetchedHackathons] = await Promise.all([
        api.tasks.getAll(),
        api.hackathons.getAll()
      ]);
      setTasks(fetchedTasks);
      setHackathons(fetchedHackathons);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to connect to server');
    }
  };

  useEffect(() => {
    // Check localStorage first, then system preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    const checkAndNotify = async () => {
      if (notifications.browserNotifications && pendingTodayTasks > 0) {
        if ('Notification' in window && Notification.permission === 'granted') {
          const lastNotified = localStorage.getItem('lastDailyNotification');
          const today = new Date().toDateString();
          if (lastNotified !== today) {
            new Notification('Daily Reminder', {
              body: `You have ${pendingTodayTasks} tasks due today!`,
              icon: '/favicon.ico'
            });
            localStorage.setItem('lastDailyNotification', today);
          }
        }
      }
    };
    checkAndNotify();
  }, [notifications.browserNotifications, pendingTodayTasks]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleStatus = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'pending' ? 'completed' : 'pending';

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: newStatus, updatedAt: new Date() } : t
      )
    );

    try {
      await api.tasks.update(id, { status: newStatus });
      toast.success('Task status updated');
    } catch (error) {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: task.status } : t
        )
      );
      toast.error('Failed to update task status');
    }
  }, [tasks]);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  }, []);

  const handleDeleteTask = useCallback(async (id: string) => {
    try {
      await api.tasks.delete(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  }, []);

  const handleSaveTask = useCallback(async (data: Partial<Task>) => {
    try {
      if (data.id) {
        const updatedTask = await api.tasks.update(data.id, data);
        setTasks((prev) =>
          prev.map((task) =>
            task.id === data.id ? updatedTask : task
          )
        );
        toast.success('Task updated');
      } else {
        const newTask = await api.tasks.create(data);
        setTasks((prev) => [newTask, ...prev]);
        toast.success('Task created');
      }
      setEditingTask(null);
    } catch (error) {
      toast.error('Failed to save task');
    }
  }, []);

  const handleAddTask = useCallback(() => {
    setEditingTask(null);
    setTaskDialogOpen(true);
  }, []);

  const handleAddHackathon = useCallback(() => {
    setEditingHackathon(null);
    setHackathonDialogOpen(true);
  }, []);

  const handleEditHackathon = useCallback((hackathon: Hackathon) => {
    setEditingHackathon(hackathon);
    setHackathonDialogOpen(true);
  }, []);

  const handleDeleteHackathon = useCallback(async (id: string) => {
    try {
      await api.hackathons.delete(id);
      setHackathons((prev) => prev.filter((h) => h.id !== id));
      // Also update tasks locally to remove the hackathon link, 
      // though ideally backend should handle cascade or we re-fetch tasks
      setTasks((prev) => prev.map((t) =>
        t.hackathonId === id ? { ...t, hackathonId: undefined } : t
      ));
      toast.success('Hackathon deleted');
    } catch (error) {
      toast.error('Failed to delete hackathon');
    }
  }, []);

  const handleSaveHackathon = useCallback(async (data: Partial<Hackathon>) => {
    try {
      if (data.id) {
        const updatedHackathon = await api.hackathons.update(data.id, data);
        setHackathons((prev) =>
          prev.map((h) =>
            h.id === data.id ? updatedHackathon : h
          )
        );
        toast.success('Hackathon updated');
      } else {
        const newHackathon = await api.hackathons.create(data);
        setHackathons((prev) => [newHackathon, ...prev]);
        toast.success('Hackathon added');
      }
      setEditingHackathon(null);
    } catch (error) {
      toast.error('Failed to save hackathon');
    }
  }, []);

  const handleToggleTheme = useCallback(() => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleUpdateNotifications = useCallback((key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleExportData = useCallback(() => {
    const data = {
      tasks,
      hackathons,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowtrack-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  }, [tasks, hackathons]);

  const handleClearData = useCallback(() => {
    setClearDataDialogOpen(true);
  }, []);

  const confirmClearData = useCallback(async () => {
    try {
      // Delete all one by one or create a clear all endpoint. 
      // For now, doing standard iteration might be slow but safe.
      // Better: just clear local state as a "UI Only" clear if that was the intent, 
      // but usually "Clear Data" implies backend too.
      // I'll leave the backend clear out for safety unless explicitly asked, 
      // or implement a loop. Let's implement a loop.
      await Promise.all([
        ...tasks.map(t => api.tasks.delete(t.id)),
        ...hackathons.map(h => api.hackathons.delete(h.id))
      ]);
      setTasks([]);
      setHackathons([]);
      setClearDataDialogOpen(false);
      toast.success('All data cleared');
    } catch (error) {
      toast.error('Failed to clear some data');
    }
  }, [tasks, hackathons]);

  const handleSearchSelectTask = useCallback((task: Task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  }, []);

  const handleSearchSelectHackathon = useCallback((hackathon: Hackathon) => {
    setEditingHackathon(hackathon);
    setHackathonDialogOpen(true);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            tasks={tasks}
            hackathons={hackathons}
            dailyStats={dailyStats}
            weeklyProgress={weeklyProgress}
            onToggleStatus={handleToggleStatus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onNavigate={setActiveView}
          />
        );
      case 'tasks':
        return (
          <TasksView
            tasks={tasks}
            onToggleStatus={handleToggleStatus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            tasks={tasks}
            onToggleStatus={handleToggleStatus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'hackathons':
        return (
          <HackathonsView
            hackathons={hackathons}
            tasks={tasks}
            onAddHackathon={handleAddHackathon}
            onEditHackathon={handleEditHackathon}
            onDeleteHackathon={handleDeleteHackathon}
          />
        );
      case 'progress':
        return (
          <ProgressView
            tasks={tasks}
            dailyStats={dailyStats}
            weeklyProgress={weeklyProgress}
          />
        );
      case 'settings':
        return (
          <SettingsView
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
            notifications={notifications}
            onUpdateNotifications={handleUpdateNotifications}
            onExportData={handleExportData}
            onClearData={handleClearData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="pl-20 lg:pl-[280px] transition-all duration-300">
        <Header
          onAddTask={handleAddTask}
          onOpenSearch={() => setSearchOpen(true)}
          pendingNotifications={pendingTodayTasks}
        />

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={editingTask}
        onSave={handleSaveTask}
      />

      <HackathonDialog
        open={hackathonDialogOpen}
        onOpenChange={setHackathonDialogOpen}
        hackathon={editingHackathon}
        onSave={handleSaveHackathon}
      />

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        tasks={tasks}
        hackathons={hackathons}
        onSelectTask={handleSearchSelectTask}
        onSelectHackathon={handleSearchSelectHackathon}
      />

      <AlertDialog open={clearDataDialogOpen} onOpenChange={setClearDataDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your tasks and hackathons.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;

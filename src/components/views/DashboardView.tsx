import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Target, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { Task, Hackathon, DailyStats } from '@/types';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProgressCharts } from '@/components/dashboard/ProgressCharts';
import { TaskCard } from '@/components/tasks/TaskCard';
import { HackathonCard } from '@/components/hackathons/HackathonCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { isToday, isFuture, differenceInDays } from 'date-fns';

interface DashboardViewProps {
  tasks: Task[];
  hackathons: Hackathon[];
  dailyStats: DailyStats[];
  weeklyProgress: { week: string; completionRate: number }[];
  onToggleStatus: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onNavigate: (view: string) => void;
}

export function DashboardView({
  tasks,
  hackathons,
  dailyStats,
  weeklyProgress,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onNavigate,
}: DashboardViewProps) {
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const todaysTasks = tasks.filter((t) => isToday(new Date(t.dueDate)));
  const upcomingHackathons = hackathons
    .filter((h) => isFuture(new Date(h.startDate)))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  const todaysCompletedRate = todaysTasks.length > 0
    ? Math.round((todaysTasks.filter((t) => t.status === 'completed').length / todaysTasks.length) * 100)
    : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            {greeting}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Champion</span> 👋
          </h1>
          <p className="text-muted-foreground text-lg flex items-center gap-2">
            You have <span className="text-foreground font-semibold">{pendingTasks} pending tasks</span>. Let's crush it today!
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={item}>
          <StatsCard
            title="Total Tasks"
            value={tasks.length}
            subtitle="All time"
            icon={Target}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            title="Completed"
            value={completedTasks}
            trend={{ value: 12, isPositive: true }}
            icon={CheckCircle2}
            colorClass="text-success"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            title="Pending"
            value={pendingTasks}
            subtitle={`${todaysCompletedRate}% done today`}
            icon={Clock}
            colorClass="text-warning"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            title="Upcoming Hackathons"
            value={upcomingHackathons.length}
            subtitle={upcomingHackathons[0] ? `Next: ${differenceInDays(new Date(upcomingHackathons[0].startDate), new Date())} days` : 'None scheduled'}
            icon={Trophy}
            colorClass="text-category-hackathon"
          />
        </motion.div>
      </div>

      <motion.div variants={item}>
        <ProgressCharts
          dailyStats={dailyStats}
          weeklyProgress={weeklyProgress}
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Today's Focus</h2>
            <Button variant="ghost" className="gap-2 hover:bg-primary/5 hover:text-primary" onClick={() => onNavigate('tasks')}>
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {todaysTasks.length > 0 ? (
              todaysTasks.slice(0, 5).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard
                    task={task}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                </motion.div>
              ))
            ) : (
              <Card className="glass-card border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                  <p className="text-muted-foreground max-w-sm">
                    No tasks scheduled for today. Why not pick up a new skill or start a side project?
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Upcoming</h2>
            <Button variant="ghost" className="gap-2 hover:bg-primary/5 hover:text-primary" onClick={() => onNavigate('hackathons')}>
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {upcomingHackathons.length > 0 ? (
              upcomingHackathons.map((hackathon, index) => (
                <motion.div
                  key={hackathon.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HackathonCard key={hackathon.id} hackathon={hackathon} compact />
                </motion.div>
              ))
            ) : (
              <Card className="glass-card border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-category-hackathon/10 flex items-center justify-center mb-4">
                    <Trophy className="w-8 h-8 text-category-hackathon" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Hackathons</h3>
                  <p className="text-muted-foreground">
                    Time to find your next challenge!
                  </p>
                  <Button variant="link" onClick={() => onNavigate('hackathons')} className="mt-2 text-primary">
                    Browse Hackathons
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

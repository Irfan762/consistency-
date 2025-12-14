import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Target, Trophy, ArrowRight } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          You have {pendingTasks} pending tasks. Let's crush it today!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={tasks.length}
          subtitle="All time"
          icon={Target}
        />
        <StatsCard
          title="Completed"
          value={completedTasks}
          trend={{ value: 12, isPositive: true }}
          icon={CheckCircle2}
          colorClass="text-success"
        />
        <StatsCard
          title="Pending"
          value={pendingTasks}
          subtitle={`${todaysCompletedRate}% done today`}
          icon={Clock}
          colorClass="text-warning"
        />
        <StatsCard
          title="Upcoming Hackathons"
          value={upcomingHackathons.length}
          subtitle={upcomingHackathons[0] ? `Next: ${differenceInDays(new Date(upcomingHackathons[0].startDate), new Date())} days` : 'None scheduled'}
          icon={Trophy}
          colorClass="text-category-hackathon"
        />
      </div>

      <ProgressCharts
        dailyStats={dailyStats}
        weeklyProgress={weeklyProgress}
        completedTasks={completedTasks}
        pendingTasks={pendingTasks}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Today's Tasks</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => onNavigate('tasks')}>
                View all <ArrowRight className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysTasks.length > 0 ? (
                todaysTasks.slice(0, 5).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tasks scheduled for today.</p>
                  <p className="text-sm">Enjoy your free time! 🎉</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Hackathons</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => onNavigate('hackathons')}>
                View all <ArrowRight className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-1">
              {upcomingHackathons.length > 0 ? (
                upcomingHackathons.map((hackathon) => (
                  <HackathonCard key={hackathon.id} hackathon={hackathon} compact />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No upcoming hackathons.</p>
                  <p className="text-sm">Add one to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

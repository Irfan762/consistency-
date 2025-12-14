import { motion } from 'framer-motion';
import { TrendingUp, Target, Flame, Award } from 'lucide-react';
import { Task, DailyStats } from '@/types';
import { ProgressCharts } from '@/components/dashboard/ProgressCharts';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { subDays, isWithinInterval, format } from 'date-fns';

interface ProgressViewProps {
  tasks: Task[];
  dailyStats: DailyStats[];
  weeklyProgress: { week: string; completionRate: number }[];
}

export function ProgressView({ tasks, dailyStats, weeklyProgress }: ProgressViewProps) {
  const today = new Date();
  const lastWeekStart = subDays(today, 7);
  
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const totalTasks = tasks.length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const lastWeekCompleted = tasks.filter(
    (t) =>
      t.status === 'completed' &&
      isWithinInterval(new Date(t.updatedAt), { start: lastWeekStart, end: today })
  ).length;

  const categoryStats = ['daily', 'learning', 'hackathon', 'project'].map((category) => {
    const categoryTasks = tasks.filter((t) => t.category === category);
    const completed = categoryTasks.filter((t) => t.status === 'completed').length;
    return {
      category,
      total: categoryTasks.length,
      completed,
      rate: categoryTasks.length > 0 ? Math.round((completed / categoryTasks.length) * 100) : 0,
    };
  });

  const streak = 5;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
        <p className="text-muted-foreground mt-1">
          Track your productivity and achievements
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Overall Completion"
          value={`${completionRate}%`}
          subtitle={`${completedTasks} of ${totalTasks} tasks`}
          icon={Target}
          colorClass="text-primary"
        />
        <StatsCard
          title="This Week"
          value={lastWeekCompleted}
          subtitle="Tasks completed"
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
          colorClass="text-success"
        />
        <StatsCard
          title="Current Streak"
          value={`${streak} days`}
          subtitle="Keep it going!"
          icon={Flame}
          colorClass="text-warning"
        />
        <StatsCard
          title="Best Category"
          value="Learning"
          subtitle="85% completion rate"
          icon={Award}
          colorClass="text-category-learning"
        />
      </div>

      <ProgressCharts
        dailyStats={dailyStats}
        weeklyProgress={weeklyProgress}
        completedTasks={completedTasks}
        pendingTasks={pendingTasks}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryStats.map((stat, index) => (
              <motion.div
                key={stat.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-secondary/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium capitalize">{stat.category}</span>
                  <span className="text-xs text-muted-foreground">{stat.rate}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.rate}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full rounded-full ${
                      stat.category === 'daily'
                        ? 'bg-category-daily'
                        : stat.category === 'learning'
                        ? 'bg-category-learning'
                        : stat.category === 'hackathon'
                        ? 'bg-category-hackathon'
                        : 'bg-category-project'
                    }`}
                  />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {stat.completed} of {stat.total} completed
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

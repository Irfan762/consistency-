import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { Task } from '@/types';
import { TaskCalendar } from '@/components/calendar/TaskCalendar';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CalendarViewProps {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

type DateFilter = 'today' | 'week' | 'custom';

export function CalendarView({ tasks, onToggleStatus, onEditTask, onDeleteTask }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');

  const getFilteredTasks = () => {
    const today = new Date();

    switch (dateFilter) {
      case 'today':
        return tasks.filter((task) => isToday(new Date(task.dueDate)));
      case 'week':
        const weekStart = startOfWeek(today);
        const weekEnd = endOfWeek(today);
        return tasks.filter((task) =>
          isWithinInterval(new Date(task.dueDate), { start: weekStart, end: weekEnd })
        );
      case 'custom':
        if (!selectedDate) return [];
        return tasks.filter((task) => {
          const taskDate = new Date(task.dueDate);
          return (
            taskDate.getDate() === selectedDate.getDate() &&
            taskDate.getMonth() === selectedDate.getMonth() &&
            taskDate.getFullYear() === selectedDate.getFullYear()
          );
        });
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setDateFilter('custom');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground mt-1">
          View and manage tasks by date
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TaskCalendar
            tasks={tasks}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {dateFilter === 'today'
                    ? "Today's Tasks"
                    : dateFilter === 'week'
                    ? 'This Week'
                    : selectedDate
                    ? format(selectedDate, 'EEEE, MMMM d')
                    : 'Select a Date'}
                </CardTitle>
                <Tabs value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
                  <TabsList className="h-9">
                    <TabsTrigger value="today" className="text-xs">Today</TabsTrigger>
                    <TabsTrigger value="week" className="text-xs">This Week</TabsTrigger>
                    <TabsTrigger value="custom" className="text-xs">Selected</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredTasks.length > 0 ? (
                  filteredTasks
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggleStatus={onToggleStatus}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                      />
                    ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <p className="text-lg">No tasks for this period</p>
                    <p className="text-sm">Select a different date or add new tasks</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

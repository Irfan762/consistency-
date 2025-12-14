import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskCalendarProps {
  tasks: Task[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

const categoryColors = {
  daily: 'bg-category-daily',
  learning: 'bg-category-learning',
  hackathon: 'bg-category-hackathon',
  project: 'bg-category-project',
};

export function TaskCalendar({ tasks, onDateSelect, selectedDate }: TaskCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  const getTasksForDay = (day: Date) => {
    return tasks.filter((task) => isSameDay(new Date(task.dueDate), day));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}

          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {days.map((day) => {
            const dayTasks = getTasksForDay(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const hasHighPriority = dayTasks.some((t) => t.priority === 'high' && t.status === 'pending');

            return (
              <motion.button
                key={day.toISOString()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDateSelect(day)}
                className={cn(
                  "aspect-square p-1 rounded-lg flex flex-col items-center justify-center relative transition-all duration-200",
                  isToday(day) && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                  isSelected && "bg-primary text-primary-foreground",
                  !isSelected && !isSameMonth(day, currentMonth) && "text-muted-foreground/50",
                  !isSelected && "hover:bg-accent"
                )}
              >
                <span className={cn(
                  "text-sm font-medium",
                  hasHighPriority && !isSelected && "text-priority-high"
                )}>
                  {format(day, 'd')}
                </span>
                
                {dayTasks.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayTasks.slice(0, 3).map((task, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          isSelected ? "bg-primary-foreground/70" : categoryColors[task.category]
                        )}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <span className={cn(
                        "text-[8px]",
                        isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        +{dayTasks.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, MoreHorizontal, CheckCircle2, Circle, Trash2, Edit2 } from 'lucide-react';
import { Task } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  high: 'bg-priority-high/10 text-priority-high border-priority-high/30',
  medium: 'bg-priority-medium/10 text-priority-medium border-priority-medium/30',
  low: 'bg-priority-low/10 text-priority-low border-priority-low/30',
};

const categoryColors = {
  daily: 'bg-category-daily',
  learning: 'bg-category-learning',
  hackathon: 'bg-category-hackathon',
  project: 'bg-category-project',
};

export function TaskCard({ task, onToggleStatus, onEdit, onDelete }: TaskCardProps) {
  const isCompleted = task.status === 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md",
        isCompleted && "opacity-60"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggleStatus(task.id)}
              className="mt-0.5 shrink-0"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className={cn(
                  "font-medium text-sm leading-snug",
                  isCompleted && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(task.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {task.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <div className={cn("w-2 h-2 rounded-full shrink-0", categoryColors[task.category])} />
                <span className="text-xs text-muted-foreground capitalize">{task.category}</span>

                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full border font-medium",
                  priorityColors[task.priority]
                )}>
                  {task.priority}
                </span>

                <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(task.dueDate), 'MMM d')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

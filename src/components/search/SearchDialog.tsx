import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, CheckSquare, Trophy } from 'lucide-react';
import { Task, Hackathon } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
  hackathons: Hackathon[];
  onSelectTask: (task: Task) => void;
  onSelectHackathon: (hackathon: Hackathon) => void;
}

export function SearchDialog({
  open,
  onOpenChange,
  tasks,
  hackathons,
  onSelectTask,
  onSelectHackathon,
}: SearchDialogProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return { tasks: [], hackathons: [] };

    const lowerQuery = query.toLowerCase();

    const filteredTasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery) ||
        task.category.toLowerCase().includes(lowerQuery)
    );

    const filteredHackathons = hackathons.filter(
      (hackathon) =>
        hackathon.name.toLowerCase().includes(lowerQuery) ||
        (hackathon.description?.toLowerCase().includes(lowerQuery))
    );

    return { tasks: filteredTasks.slice(0, 5), hackathons: filteredHackathons.slice(0, 3) };
  }, [query, tasks, hackathons]);

  const hasResults = results.tasks.length > 0 || results.hackathons.length > 0;

  const handleSelect = (item: Task | Hackathon, type: 'task' | 'hackathon') => {
    if (type === 'task') {
      onSelectTask(item as Task);
    } else {
      onSelectHackathon(item as Hackathon);
    }
    onOpenChange(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <div className="flex items-center border-b border-border px-4">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <Input
            placeholder="Search tasks, hackathons..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 text-base h-14"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-accent rounded-md"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {!query.trim() && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>Start typing to search...</p>
              <p className="text-sm">Search tasks by title, description, or category</p>
            </div>
          )}

          {query.trim() && !hasResults && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No results found for "{query}"</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}

          <AnimatePresence>
            {results.tasks.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">Tasks</p>
                {results.tasks.map((task, index) => (
                  <motion.button
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelect(task, 'task')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      task.status === 'completed' ? "bg-success/10" : "bg-primary/10"
                    )}>
                      <CheckSquare className={cn(
                        "w-4 h-4",
                        task.status === 'completed' ? "text-success" : "text-primary"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium text-sm truncate",
                        task.status === 'completed' && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {task.category} • Due {format(new Date(task.dueDate), 'MMM d')}
                      </p>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      task.priority === 'high' && "bg-priority-high/10 text-priority-high",
                      task.priority === 'medium' && "bg-priority-medium/10 text-priority-medium",
                      task.priority === 'low' && "bg-priority-low/10 text-priority-low"
                    )}>
                      {task.priority}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {results.hackathons.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">Hackathons</p>
                {results.hackathons.map((hackathon, index) => (
                  <motion.button
                    key={hackathon.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (results.tasks.length + index) * 0.05 }}
                    onClick={() => handleSelect(hackathon, 'hackathon')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{hackathon.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(hackathon.startDate), 'MMM d')} - {format(new Date(hackathon.endDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

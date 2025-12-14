import { motion } from 'framer-motion';
import { Bell, Search, Plus, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onAddTask: () => void;
  onOpenSearch: () => void;
  pendingNotifications: number;
}

export function Header({ onAddTask, onOpenSearch, pendingNotifications }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenSearch}
            className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors text-left"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Search tasks, hackathons...</span>
            <kbd className="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </motion.button>
        </div>

        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="gradient" size="default" onClick={onAddTask} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </motion.div>

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {pendingNotifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive rounded-full text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                {pendingNotifications > 9 ? '9+' : pendingNotifications}
              </span>
            )}
          </Button>

          <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-sm font-semibold text-primary-foreground">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}

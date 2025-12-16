import { motion } from 'framer-motion';
import { Bell, Search, Plus, Sun, Moon, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onAddTask: () => void;
  onOpenSearch: () => void;
  pendingNotifications: number;
}

export function Header({ onAddTask, onOpenSearch, pendingNotifications }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 transition-all duration-300 border-b border-transparent",
        scrolled ? "bg-background/80 backdrop-blur-xl border-border/50 shadow-sm" : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onOpenSearch}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card/50 border border-border/50 text-muted-foreground hover:bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 text-left group"
          >
            <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span className="text-sm group-hover:text-foreground transition-colors">Search tasks, hackathons...</span>
            <kbd className="ml-auto hidden sm:inline-flex h-6 select-none items-center gap-1 rounded bg-muted/50 px-2 font-mono text-[10px] font-medium text-muted-foreground border border-border/50">
              <Command className="w-3 h-3" />
              <span>K</span>
            </kbd>
          </motion.button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 pl-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="default"
              size="default"
              onClick={onAddTask}
              className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg hover:shadow-primary/25 border-0 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          </motion.div>

          <div className="h-8 w-px bg-border/50 mx-2 hidden sm:block" />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-orange-500" />}
            </motion.div>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Bell className="w-5 h-5" />
            {pendingNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full shadow-[0_0_8px_var(--destructive)] animate-pulse" />
            )}
          </Button>

          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-secondary border-2 border-background shadow-lg cursor-pointer flex items-center justify-center overflow-hidden"
          >
            <img src="https://github.com/shadcn.png" alt="Profile" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    </header>
  );
}

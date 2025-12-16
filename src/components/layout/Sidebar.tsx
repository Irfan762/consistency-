import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Trophy,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'hackathons', label: 'Hackathons', icon: Trophy },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'circOut' }}
      className="fixed left-0 top-0 h-screen bg-card/80 backdrop-blur-xl border-r border-border/50 z-40 flex flex-col shadow-2xl shadow-black/5"
    >
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <motion.div
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
          className="flex items-center gap-3 overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight">Hackathon</span>
            <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">Hero</span>
          </div>
        </motion.div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-muted-foreground hover:bg-secondary hover:text-foreground shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden group",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <Icon className={cn("w-5 h-5 shrink-0 z-10 transition-colors duration-300", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />

              <motion.span
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
                className="text-sm overflow-hidden whitespace-nowrap z-10"
              >
                {item.label}
              </motion.span>

              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full shadow-[0_0_10px_var(--primary)]" />
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50 bg-secondary/20">
        <motion.button
          onClick={() => onViewChange('settings')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
            activeView === 'settings'
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : "hover:bg-background text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
          )}
        >
          <Settings className={cn("w-5 h-5 shrink-0 transition-transform group-hover:rotate-45 duration-500")} />
          <motion.span
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
            className="font-medium text-sm overflow-hidden whitespace-nowrap"
          >
            Settings
          </motion.span>
        </motion.button>
      </div>
    </motion.aside>
  );
}

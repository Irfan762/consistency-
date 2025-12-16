import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, colorClass }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass-card overflow-hidden h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-baseline gap-2">
                <p className={cn("text-4xl font-bold tracking-tight", colorClass)}>{value}</p>
                {trend && (
                  <span className={cn(
                    "text-xs font-bold px-1.5 py-0.5 rounded-full",
                    trend.isPositive
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  )}>
                    {trend.isPositive ? '+' : ''}{trend.value}%
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>
              )}
            </div>
            <div className={cn(
              "p-3 rounded-2xl shadow-lg ring-1 ring-white/10",
              colorClass ? colorClass.replace('text-', 'bg-') + '/20' : 'bg-primary/20'
            )}>
              <Icon className={cn("w-6 h-6", colorClass || "text-primary")} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className={cn("text-3xl font-bold", colorClass)}>{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
              {trend && (
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}>
                  <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              )}
            </div>
            <div className={cn(
              "p-3 rounded-xl",
              colorClass ? colorClass.replace('text-', 'bg-') + '/10' : 'bg-primary/10'
            )}>
              <Icon className={cn("w-5 h-5", colorClass || "text-primary")} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

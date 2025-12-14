import { motion } from 'framer-motion';
import { format, differenceInDays, isPast } from 'date-fns';
import { Calendar, ExternalLink, Clock, ChevronRight } from 'lucide-react';
import { Hackathon } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HackathonCardProps {
  hackathon: Hackathon;
  compact?: boolean;
}

export function HackathonCard({ hackathon, compact = false }: HackathonCardProps) {
  const today = new Date();
  const daysUntilStart = differenceInDays(new Date(hackathon.startDate), today);
  const isOngoing = isPast(new Date(hackathon.startDate)) && !isPast(new Date(hackathon.endDate));
  const isUpcoming = daysUntilStart > 0 && daysUntilStart <= 14;

  const getStatusBadge = () => {
    if (isOngoing) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-success/10 text-success animate-pulse-glow">
          Live Now
        </span>
      );
    }
    if (isUpcoming) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-warning/10 text-warning">
          Starting Soon
        </span>
      );
    }
    return null;
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ x: 4 }}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-primary-foreground">
            {daysUntilStart > 0 ? daysUntilStart : '!'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{hackathon.name}</h4>
          <p className="text-xs text-muted-foreground">
            {daysUntilStart > 0 ? `${daysUntilStart} days left` : isOngoing ? 'Happening now!' : 'Ended'}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-300",
        isUpcoming && "ring-2 ring-warning/30",
        isOngoing && "ring-2 ring-success/30 shadow-glow"
      )}>
        <div className="h-2 gradient-bg" />
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg truncate">{hackathon.name}</h3>
                {getStatusBadge()}
              </div>
              
              {hackathon.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {hackathon.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(hackathon.startDate), 'MMM d')} - {format(new Date(hackathon.endDate), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className={cn(
                "text-3xl font-bold gradient-text",
                daysUntilStart <= 3 && "text-warning"
              )}>
                {daysUntilStart > 0 ? daysUntilStart : isOngoing ? 'NOW' : '-'}
              </div>
              <div className="text-xs text-muted-foreground">
                {daysUntilStart > 0 ? 'days left' : isOngoing ? '' : 'ended'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{hackathon.tasks.length} related tasks</span>
            </div>
            {hackathon.url && (
              <Button variant="ghost" size="sm" className="ml-auto gap-1.5 text-xs" asChild>
                <a href={hackathon.url} target="_blank" rel="noopener noreferrer">
                  Visit Site
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

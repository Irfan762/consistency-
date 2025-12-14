import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Trash2, Edit2, MoreHorizontal } from 'lucide-react';
import { Hackathon, Task } from '@/types';
import { HackathonCard } from '@/components/hackathons/HackathonCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isFuture, isPast } from 'date-fns';

interface HackathonsViewProps {
  hackathons: Hackathon[];
  tasks: Task[];
  onAddHackathon: () => void;
  onEditHackathon: (hackathon: Hackathon) => void;
  onDeleteHackathon: (id: string) => void;
}

export function HackathonsView({ 
  hackathons, 
  tasks,
  onAddHackathon, 
  onEditHackathon,
  onDeleteHackathon,
}: HackathonsViewProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingHackathons = hackathons
    .filter((h) => isFuture(new Date(h.endDate)))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const pastHackathons = hackathons
    .filter((h) => isPast(new Date(h.endDate)))
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

  const displayedHackathons = activeTab === 'upcoming' ? upcomingHackathons : pastHackathons;

  const getRelatedTasks = (hackathonId: string) => {
    return tasks.filter((t) => t.hackathonId === hackathonId);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hackathons</h1>
          <p className="text-muted-foreground mt-1">
            Track your hackathon preparation and deadlines
          </p>
        </div>
        <Button variant="gradient" onClick={onAddHackathon} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Hackathon
        </Button>
      </motion.div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upcoming' | 'past')}>
        <TabsList className="w-full max-w-xs">
          <TabsTrigger value="upcoming" className="flex-1">
            Upcoming ({upcomingHackathons.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex-1">
            Past ({pastHackathons.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedHackathons.length > 0 ? (
              displayedHackathons.map((hackathon, index) => (
                <motion.div
                  key={hackathon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditHackathon(hackathon)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDeleteHackathon(hackathon.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <HackathonCard hackathon={hackathon} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg text-muted-foreground">
                  {activeTab === 'upcoming'
                    ? 'No upcoming hackathons'
                    : 'No past hackathons'}
                </p>
                {activeTab === 'upcoming' && (
                  <Button variant="outline" onClick={onAddHackathon} className="mt-4">
                    Add your first hackathon
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

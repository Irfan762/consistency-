import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Moon, Sun, Trash2, Download, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface SettingsViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
  notifications: {
    dailyReminder: boolean;
    hackathonAlerts: boolean;
    browserNotifications: boolean;
  };
  onUpdateNotifications: (key: string, value: boolean) => void;
  onExportData: () => void;
  onClearData: () => void;
}

export function SettingsView({
  isDark,
  onToggleTheme,
  notifications,
  onUpdateNotifications,
  onExportData,
  onClearData,
}: SettingsViewProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleNotificationToggle = (key: string, value: boolean) => {
    onUpdateNotifications(key, value);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </motion.div>

      <div className="grid gap-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card overflow-hidden border-none shadow-xl ring-1 ring-white/20">
            <div className="h-32 bg-gradient-to-r from-primary to-purple-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <div className="absolute -bottom-10 left-8">
                <div className="w-24 h-24 rounded-2xl border-4 border-background bg-card flex items-center justify-center text-4xl font-bold text-primary shadow-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            </div>
            <CardHeader className="pt-16 pb-4 px-8">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold">{user?.name || 'User Name'}</CardTitle>
                  <CardDescription className="text-base">{user?.email || 'user@example.com'}</CardDescription>
                </div>
                <Button variant="outline" onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-2 border-destructive/20">
                  <Trash2 className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                  <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Account Type</p>
                  <p className="font-bold mt-1 text-lg">Hackathon Hero</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                  <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Member Since</p>
                  <p className="font-bold mt-1 text-lg">{new Date().getFullYear()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isDark ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how FlowTrack looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={isDark}
                  onCheckedChange={onToggleTheme}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ... Notifications and Data Management Cards upgraded similarly ... */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="daily-reminder" className="text-base">Daily Task Reminder</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about pending tasks each morning
                  </p>
                </div>
                <Switch
                  id="daily-reminder"
                  checked={notifications.dailyReminder}
                  onCheckedChange={(value) => handleNotificationToggle('dailyReminder', value)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="hackathon-alerts" className="text-base">Hackathon Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts before hackathon deadlines
                  </p>
                </div>
                <Switch
                  id="hackathon-alerts"
                  checked={notifications.hackathonAlerts}
                  onCheckedChange={(value) => handleNotificationToggle('hackathonAlerts', value)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="browser-notifications" className="text-base">Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable push notifications in your browser
                  </p>
                </div>
                <Switch
                  id="browser-notifications"
                  checked={notifications.browserNotifications}
                  onCheckedChange={(value) => handleNotificationToggle('browserNotifications', value)}
                />
              </div>
              {notifications.browserNotifications && (
                <div className="flex justify-end pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('Test Notification', {
                          body: 'This is a test notification from Hackathon Hero!',
                          icon: '/favicon.ico'
                        });
                        toast.success('Notification sent!');
                      } else {
                        toast.error('Permission not granted or not supported');
                      }
                    }}
                  >
                    Send Test Notification
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Download className="w-5 h-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Export or clear your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <p className="font-medium">Export Data</p>
                  <p className="text-sm text-muted-foreground">
                    Download all your tasks and hackathons as JSON
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={onExportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <p className="font-medium text-destructive">Clear All Data</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete all tasks and hackathons
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={onClearData}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

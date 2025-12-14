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

  // ... existing handleNotificationToggle ...
  const handleNotificationToggle = (key: string, value: boolean) => {
    onUpdateNotifications(key, value);
  };

  return (
    <div className="space-y-6">
      {/* ... header ... */}

      <div className="grid gap-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden border-none shadow-md">
            <div className="h-24 bg-gradient-to-r from-violet-600 to-indigo-600 relative">
              <div className="absolute -bottom-8 left-6">
                <div className="w-20 h-20 rounded-full border-4 border-background bg-zinc-100 flex items-center justify-center text-3xl font-bold text-violet-700 shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            </div>
            <CardHeader className="pt-10 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">{user?.name || 'User Name'}</CardTitle>
                  <CardDescription className="text-sm">{user?.email || 'user@example.com'}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-2">
                  <Trash2 className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">Account Type</p>
                  <p className="font-medium mt-1">Hackathon Hero</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">Member Since</p>
                  <p className="font-medium mt-1">{new Date().getFullYear()}</p>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how FlowTrack looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="daily-reminder">Daily Task Reminder</Label>
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
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="hackathon-alerts">Hackathon Alerts</Label>
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
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="browser-notifications">Browser Notifications</Label>
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
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export or clear your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
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
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Test Email Notification</p>
                  <p className="text-sm text-muted-foreground">
                    Trigger a test email digest (requires backend config)
                  </p>
                  {user?.email && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Will send to: {user.email} (if configured)
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      // Using direct fetch to avoid import issues in this view
                      const res = await fetch('http://localhost:5001/api/notifications/test', {
                        method: 'POST'
                      });
                      if (res.ok) {
                        toast.success('Email trigger sent (check backend logs)');
                      } else {
                        throw new Error('Failed');
                      }
                    } catch (err) {
                      console.error('Test Email Error:', err);
                      toast.error('Failed to trigger email. Check console for details.');
                    }
                  }}
                >
                  Send Email
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
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

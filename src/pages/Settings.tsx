import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [cloudSync, setCloudSync] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('cloud_sync_enabled')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setCloudSync(data?.cloud_sync_enabled || false);
    } catch (error: any) {
      console.error('Error loading settings:', error);
    }
  };

  const handleCloudSyncToggle = async (enabled: boolean) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ cloud_sync_enabled: enabled })
        .eq('id', user.id);

      if (error) throw error;

      setCloudSync(enabled);
      toast.success(
        enabled ? 'Cloud sync enabled' : 'Cloud sync disabled'
      );
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteData = async () => {
    if (!user) return;

    setDeleting(true);
    try {
      // Delete entries
      const { error: entriesError } = await supabase
        .from('entries')
        .delete()
        .eq('user_id', user.id);

      if (entriesError) throw entriesError;

      // Delete analytics
      const { error: analyticsError } = await supabase
        .from('analytics')
        .delete()
        .eq('user_id', user.id);

      if (analyticsError) throw analyticsError;

      toast.success('All data deleted');
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting data:', error);
      toast.error('Failed to delete data');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-lavender/10 via-wellness-blue/10 to-wellness-mint/10">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Account Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Account Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium">
                  {user?.email || 'Guest User'}
                </span>
              </div>
              {user?.is_anonymous && (
                <p className="text-xs text-muted-foreground">
                  You're using a guest account. Sign up to save your data across devices.
                </p>
              )}
            </div>
          </Card>

          {/* Privacy & Data */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Privacy & Data</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="cloud-sync">Cloud Sync</Label>
                  <p className="text-xs text-muted-foreground">
                    Sync your entries across devices
                  </p>
                </div>
                <Switch
                  id="cloud-sync"
                  checked={cloudSync}
                  onCheckedChange={handleCloudSyncToggle}
                  disabled={loading || user?.is_anonymous}
                />
              </div>

              {user?.is_anonymous && (
                <p className="text-xs text-muted-foreground">
                  Create an account to enable cloud sync
                </p>
              )}
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-destructive/50">
            <h2 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h2>
            <div className="space-y-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All My Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your
                      journal entries and analytics data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteData}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={deleting}
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        'Delete Everything'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <p className="text-xs text-muted-foreground">
                This will delete all your journal entries, reflections, and analytics.
                This action is irreversible.
              </p>
            </div>
          </Card>

          {/* Sign Out */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

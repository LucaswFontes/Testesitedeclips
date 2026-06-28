'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Database,
  Trash2,
  Download,
  Upload,
  Keyboard,
  Monitor,
  Palette,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';
import { Platform, Priority, PLATFORMS, PRIORITIES } from '@/types/clip';
import { supabase } from '@/lib/supabase';

interface Settings {
  theme: 'dark' | 'light';
  defaultPlatform: Platform;
  defaultStreamer: string;
  defaultPriority: Priority;
  confirmDelete: boolean;
  showThumbnails: boolean;
  compactMode: boolean;
}

const defaultSettings: Settings = {
  theme: 'dark',
  defaultPlatform: 'twitch',
  defaultStreamer: '',
  defaultPriority: 'medium',
  confirmDelete: true,
  showThumbnails: true,
  compactMode: false,
};

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clip-tracker-settings');
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) };
        } catch {
          return defaultSettings;
        }
      }
    }
    return defaultSettings;
  });

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('clip-tracker-settings', JSON.stringify(newSettings));
    toast.success('Settings saved');
  };

  const handleExport = async () => {
    try {
      const { data: clips, error } = await supabase.from('clips').select('*');
      if (error) throw error;

      const exportData = {
        exportedAt: new Date().toISOString(),
        clips,
        settings,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clip-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const importData = JSON.parse(text);

        if (importData.settings) {
          setSettings(importData.settings);
          localStorage.setItem('clip-tracker-settings', JSON.stringify(importData.settings));
        }

        toast.success('Data imported successfully');
      } catch (error) {
        toast.error('Failed to import data');
      }
    };
    input.click();
  };

  const handleClearStorage = () => {
    if (confirm('Are you sure you want to clear local storage? This will reset your settings.')) {
      localStorage.removeItem('clip-tracker-settings');
      setSettings(defaultSettings);
      toast.success('Local storage cleared');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-neutral-400 mt-1">Manage your Clip Tracker preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Appearance */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-400" />
              Appearance
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Customize how Clip Tracker looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Theme</Label>
                <p className="text-sm text-neutral-400">
                  Choose between light and dark mode
                </p>
              </div>
              <Select
                value={settings.theme}
                onValueChange={(value: 'dark' | 'light') => updateSetting('theme', value)}
              >
                <SelectTrigger className="w-[120px] bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light" disabled>Light (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator className="bg-neutral-800" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Compact Mode</Label>
                <p className="text-sm text-neutral-400">
                  Show more clips on screen with smaller rows
                </p>
              </div>
              <Switch
                checked={settings.compactMode}
                onCheckedChange={(checked) => updateSetting('compactMode', checked)}
              />
            </div>
            <Separator className="bg-neutral-800" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Show Thumbnails</Label>
                <p className="text-sm text-neutral-400">
                  Display clip thumbnails in the table
                </p>
              </div>
              <Switch
                checked={settings.showThumbnails}
                onCheckedChange={(checked) => updateSetting('showThumbnails', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Defaults */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Monitor className="h-5 w-5 text-purple-400" />
              Defaults
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Set default values for new clips
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Default Platform</Label>
                <p className="text-sm text-neutral-400">
                  Platform selected by default
                </p>
              </div>
              <Select
                value={settings.defaultPlatform}
                onValueChange={(value: Platform) => updateSetting('defaultPlatform', value)}
              >
                <SelectTrigger className="w-[120px] bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue className="capitalize" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator className="bg-neutral-800" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Default Priority</Label>
                <p className="text-sm text-neutral-400">
                  Priority selected by default
                </p>
              </div>
              <Select
                value={settings.defaultPriority}
                onValueChange={(value: Priority) => updateSetting('defaultPriority', value)}
              >
                <SelectTrigger className="w-[120px] bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue className="capitalize" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-purple-400" />
              Keyboard Shortcuts
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Quick actions you can perform with keyboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between bg-neutral-800 px-4 py-3 rounded-lg">
                <span className="text-white">Create Clip</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-neutral-700 rounded text-xs text-white">CTRL</kbd>
                  <span className="text-neutral-500">+</span>
                  <kbd className="px-2 py-1 bg-neutral-700 rounded text-xs text-white">N</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between bg-neutral-800 px-4 py-3 rounded-lg">
                <span className="text-white">Focus Search</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-neutral-700 rounded text-xs text-white">CTRL</kbd>
                  <span className="text-neutral-500">+</span>
                  <kbd className="px-2 py-1 bg-neutral-700 rounded text-xs text-white">F</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between bg-neutral-800 px-4 py-3 rounded-lg">
                <span className="text-white">Close Dialog</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-neutral-700 rounded text-xs text-white">ESC</kbd>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-400" />
              Data
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Export, import, or clear your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Confirm before deleting</Label>
                <p className="text-sm text-neutral-400">
                  Show confirmation dialog when deleting clips
                </p>
              </div>
              <Switch
                checked={settings.confirmDelete}
                onCheckedChange={(checked) => updateSetting('confirmDelete', checked)}
              />
            </div>
            <Separator className="bg-neutral-800" />
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleExport}
                className="border-neutral-700 text-white hover:bg-neutral-800 gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button
                variant="outline"
                onClick={handleImport}
                className="border-neutral-700 text-white hover:bg-neutral-800 gap-2"
              >
                <Upload className="h-4 w-4" />
                Import Data
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearStorage}
                className="bg-red-600 hover:bg-red-700 text-white gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear Local Storage
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              About
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Clip Tracker helps content creators organize livestream clips before editing and publishing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Version</span>
              <span className="text-white font-medium">1.5</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

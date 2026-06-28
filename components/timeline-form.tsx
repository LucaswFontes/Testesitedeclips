'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Loader2 } from 'lucide-react';
import { TimelineFormData, Priority, CATEGORIES } from '@/types/clip';
import { TagInput } from '@/components/tag-input';

interface TimelineFormProps {
  onSubmit: (data: TimelineFormData) => Promise<void>;
  loading?: boolean;
  defaultTimestamp?: string;
}

export function TimelineForm({ onSubmit, loading, defaultTimestamp }: TimelineFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TimelineFormData>({
    title: '',
    description: '',
    timestamp: defaultTimestamp || '',
    category: '',
    tags: [],
    favorite: false,
    priority: 'medium',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        timestamp: '',
        category: '',
        tags: [],
        favorite: false,
        priority: 'medium',
      });
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white gap-2"
      >
        <Plus className="h-4 w-4" />
        Save Moment
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Save Live Moment</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-neutral-300">
                Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                placeholder="What happened?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timestamp" className="text-neutral-300">
                Timestamp
              </Label>
              <div className="flex gap-2">
                <Input
                  id="timestamp"
                  type="time"
                  step="1"
                  value={formData.timestamp}
                  onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                  className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData({ ...formData, timestamp: getCurrentTimestamp() })}
                  className="border-neutral-700 text-white hover:bg-neutral-800 shrink-0"
                >
                  Now
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Category</Label>
              <Select
                value={formData.category || 'none'}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value === 'none' ? '' : value })
                }
              >
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectItem value="none">No category</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.emoji} {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Priority</Label>
              <Select
                value={formData.priority || 'medium'}
                onValueChange={(value: Priority) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Tags</Label>
              <TagInput
                tags={formData.tags}
                onChange={(tags) => setFormData({ ...formData, tags })}
                placeholder="Add tags..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-neutral-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500 min-h-[80px]"
                placeholder="Add notes about this moment..."
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-neutral-300">Favorite</Label>
              <Switch
                checked={formData.favorite}
                onCheckedChange={(checked) => setFormData({ ...formData, favorite: checked })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-neutral-700 text-white hover:bg-neutral-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Moment'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

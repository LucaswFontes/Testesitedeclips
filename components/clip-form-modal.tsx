'use client';

import { useState, useEffect } from 'react';
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
import { Star, Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Clip, ClipFormData, Platform, Priority, Status, PLATFORMS, PRIORITIES, STATUSES, CATEGORIES } from '@/types/clip';
import { TagInput } from '@/components/tag-input';

interface ClipFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClipFormData) => Promise<void>;
  clip?: Clip | null;
}

const defaultFormData: ClipFormData = {
  title: '',
  clip_url: '',
  platform: 'twitch',
  category: '',
  game: '',
  streamer: '',
  notes: '',
  date: new Date().toISOString().split('T')[0],
  rating: 0,
  priority: 'medium',
  status: 'to_edit',
  favorite: false,
  thumbnail_url: '',
  tags: [],
};

export function ClipFormModal({ open, onClose, onSubmit, clip }: ClipFormModalProps) {
  const [formData, setFormData] = useState<ClipFormData>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (clip) {
      setFormData({
        title: clip.title,
        clip_url: clip.clip_url,
        platform: clip.platform,
        category: clip.category || '',
        game: clip.game || '',
        streamer: clip.streamer || '',
        notes: clip.notes || '',
        date: clip.date || '',
        rating: clip.rating || 0,
        priority: clip.priority || 'medium',
        status: clip.status,
        favorite: clip.favorite,
        thumbnail_url: clip.thumbnail_url || '',
        tags: clip.tags || [],
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [clip, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // Convert to base64 for simplicity (in production, use a proper file storage)
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, thumbnail_url: event.target?.result as string });
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to upload:', error);
      setUploadingImage(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star })}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={cn(
                'h-5 w-5',
                star <= formData.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-neutral-600'
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {clip ? 'Edit Clip' : 'Add New Clip'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title" className="text-neutral-300">
                Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="clip_url" className="text-neutral-300">
                Clip URL <span className="text-red-400">*</span>
              </Label>
              <Input
                id="clip_url"
                value={formData.clip_url}
                onChange={(e) => setFormData({ ...formData, clip_url: e.target.value })}
                className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                placeholder="https://..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value: Platform) =>
                  setFormData({ ...formData, platform: value })
                }
              >
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500">
                  <SelectValue />
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

            <div className="space-y-2">
              <Label className="text-neutral-300">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Status) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="game" className="text-neutral-300">
                Game
              </Label>
              <Input
                id="game"
                value={formData.game}
                onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                placeholder="e.g., Valorant, CS2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="streamer" className="text-neutral-300">
                Streamer
              </Label>
              <Input
                id="streamer"
                value={formData.streamer}
                onChange={(e) => setFormData({ ...formData, streamer: e.target.value })}
                className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-neutral-300">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
              />
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
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Rating</Label>
              {renderStars()}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label className="text-neutral-300">Tags</Label>
              <TagInput
                tags={formData.tags}
                onChange={(tags) => setFormData({ ...formData, tags })}
                placeholder="Add tags..."
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label className="text-neutral-300">Thumbnail</Label>
              <div className="flex items-start gap-4">
                {formData.thumbnail_url ? (
                  <div className="relative">
                    <img
                      src={formData.thumbnail_url}
                      alt="Thumbnail"
                      className="w-40 h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, thumbnail_url: '' })}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="w-40 h-24 border-2 border-dashed border-neutral-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                    {uploadingImage ? (
                      <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-neutral-500" />
                        <span className="text-xs text-neutral-500 mt-1">Upload</span>
                      </>
                    )}
                  </label>
                )}
                <div className="flex-1">
                  <Input
                    placeholder="Or paste image URL..."
                    value={formData.thumbnail_url.startsWith('data:') ? '' : formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    className="bg-neutral-800 border-neutral-700 text-white focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="notes" className="text-neutral-300">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-neutral-800 border-neutral-700 text-white min-h-[100px] focus:border-purple-500"
                placeholder="Add any notes about this clip..."
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-neutral-300">Favorite</Label>
              <Switch
                checked={formData.favorite}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, favorite: checked })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-neutral-700 text-white hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : clip ? (
                'Update Clip'
              ) : (
                'Add Clip'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

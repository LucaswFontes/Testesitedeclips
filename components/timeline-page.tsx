'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Clock, MoreVertical, Trash2, Film, Star, Edit2, CheckCircle } from 'lucide-react';
import { TimelineMoment, TimelineFormData, PRIORITY_COLORS, PRIORITY_LABELS, getCategoryWithEmoji, ClipFormData } from '@/types/clip';
import { useTimeline } from '@/hooks/use-clips';
import { TimelineForm } from '@/components/timeline-form';
import { ClipFormModal } from '@/components/clip-form-modal';
import { TagBadge } from '@/components/tag-input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function TimelinePage() {
  const {
    moments,
    loading,
    createMoment,
    updateMoment,
    deleteMoment,
    convertToClip,
  } = useTimeline();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editMoment, setEditMoment] = useState<TimelineMoment | null>(null);
  const [convertMoment, setConvertMoment] = useState<TimelineMoment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleCreateMoment = useCallback(async (data: TimelineFormData) => {
    try {
      await createMoment(data);
      toast.success('Moment saved');
    } catch (error) {
      toast.error('Failed to save moment');
      throw error;
    }
  }, [createMoment]);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteMoment(deleteId);
      toast.success('Moment deleted');
    } catch (error) {
      toast.error('Failed to delete moment');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }, [deleteId, deleteMoment]);

  const handleConvertToClip = useCallback(async (clipData: ClipFormData) => {
    if (!convertMoment) return;
    try {
      await convertToClip(convertMoment, clipData);
      toast.success('Converted to clip');
      setConvertMoment(null);
    } catch (error) {
      toast.error('Failed to convert to clip');
      throw error;
    }
  }, [convertMoment, convertToClip]);

  const sortedMoments = [...moments].sort((a, b) => {
    // Sort by created_at descending (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Timeline</h2>
          <p className="text-neutral-400 mt-1">Save interesting moments while watching a livestream</p>
        </div>
        <TimelineForm onSubmit={handleCreateMoment} />
      </div>

      {/* Timeline */}
      <div className="relative">
        {moments.length === 0 ? (
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="py-20 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600/20 to-green-400/10 flex items-center justify-center mb-4">
                <Clock className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No moments saved yet</h3>
              <p className="text-neutral-400 max-w-sm text-center">
                Click "Save Moment" to create your first timestamp while watching a livestream.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedMoments.map((moment, index) => (
              <div
                key={moment.id}
                className="relative pl-8 pb-8 group"
              >
                {/* Timeline line */}
                {index < sortedMoments.length - 1 && (
                  <div className="absolute left-[11px] top-[28px] w-0.5 h-full bg-neutral-800" />
                )}

                {/* Timeline dot */}
                <div
                  className={cn(
                    'absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                    moment.converted_to_clip
                      ? 'bg-green-600 border-green-500'
                      : moment.favorite
                        ? 'bg-yellow-600 border-yellow-500'
                        : 'bg-neutral-800 border-neutral-700 group-hover:border-purple-500'
                  )}
                >
                  {moment.converted_to_clip ? (
                    <CheckCircle className="h-3 w-3 text-white" />
                  ) : moment.favorite ? (
                    <Star className="h-3 w-3 text-white fill-white" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-neutral-600 group-hover:bg-purple-400 transition-colors" />
                  )}
                </div>

                {/* Moment card */}
                <Card className="bg-neutral-900 border-neutral-800 hover:border-neutral-700 transition-all group/card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                          {moment.title}
                          {moment.converted_to_clip && (
                            <Badge className="bg-green-600/20 text-green-300 border-green-500/30 text-xs">
                              Converted
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-3 text-sm text-neutral-400">
                          {moment.timestamp && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {moment.timestamp}
                            </span>
                          )}
                          <span>
                            {new Date(moment.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          {moment.priority && (
                            <Badge
                              variant="secondary"
                              className={cn('text-white text-xs border-0', PRIORITY_COLORS[moment.priority])}
                            >
                              {PRIORITY_LABELS[moment.priority]}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-white">
                          {!moment.converted_to_clip && (
                            <DropdownMenuItem
                              onClick={() => setConvertMoment(moment)}
                              className="hover:bg-neutral-700 cursor-pointer"
                            >
                              <Film className="h-4 w-4 mr-2" />
                              Convert to Clip
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => setDeleteId(moment.id)}
                            className="hover:bg-neutral-700 cursor-pointer text-red-400 focus:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {moment.description && (
                      <p className="text-neutral-300 text-sm">{moment.description}</p>
                    )}

                    {moment.category && (
                      <Badge variant="outline" className="border-neutral-700 text-neutral-300">
                        {getCategoryWithEmoji(moment.category)}
                      </Badge>
                    )}

                    {moment.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {moment.tags.map((tag) => (
                          <TagBadge key={tag} tag={tag} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-neutral-900 border-neutral-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Moment</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              Are you sure you want to delete this moment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Convert to Clip Modal */}
      <ClipFormModal
        open={!!convertMoment}
        onClose={() => setConvertMoment(null)}
        onSubmit={handleConvertToClip}
        clip={{
          id: '',
          title: convertMoment?.title || '',
          clip_url: '',
          platform: 'twitch',
          category: convertMoment?.category || null,
          game: null,
          streamer: null,
          notes: convertMoment?.description || null,
          date: new Date().toISOString().split('T')[0],
          rating: null,
          priority: convertMoment?.priority || null,
          status: 'to_edit',
          favorite: convertMoment?.favorite || false,
          thumbnail_url: null,
          tags: convertMoment?.tags || [],
          timeline_moment_id: convertMoment?.id || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any}
      />
    </div>
  );
}

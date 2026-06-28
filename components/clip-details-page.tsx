'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Calendar,
  Gamepad2,
  User,
  Tag,
  FileText,
  Clock,
  AlertTriangle,
  Film,
  Edit2,
  Trash2,
  Globe,
} from 'lucide-react';
import { Clip, STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS, PLATFORM_COLORS, getCategoryWithEmoji } from '@/types/clip';
import { TagBadge } from '@/components/tag-input';
import { cn } from '@/lib/utils';

interface ClipDetailsPageProps {
  clip: Clip;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onToggleFavorite: (favorite: boolean) => Promise<void>;
}

export function ClipDetailsPage({
  clip,
  onBack,
  onEdit,
  onDelete,
  onToggleFavorite,
}: ClipDetailsPageProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-neutral-400 hover:text-white hover:bg-neutral-800 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clips
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onEdit}
            className="border-neutral-700 text-white hover:bg-neutral-800 gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Thumbnail & Video */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thumbnail */}
          <Card className="bg-neutral-900 border-neutral-800 overflow-hidden">
            <div className="aspect-video relative bg-neutral-800">
              {clip.thumbnail_url ? (
                <img
                  src={clip.thumbnail_url}
                  alt={clip.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={cn(
                  'w-full h-full flex items-center justify-center',
                  PLATFORM_COLORS[clip.platform]
                )}>
                  <Film className="h-16 w-16 text-white/50" />
                </div>
              )}
              {clip.clip_url && (
                <a
                  href={clip.clip_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 bg-black/80 hover:bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Watch Clip
                </a>
              )}
            </div>
          </Card>

          {/* Title & Status */}
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold text-white">{clip.title}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge
                      variant="secondary"
                      className={cn('text-white border-0', STATUS_COLORS[clip.status])}
                    >
                      {STATUS_LABELS[clip.status]}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={cn('text-white border-0 capitalize', PLATFORM_COLORS[clip.platform])}
                    >
                      {clip.platform}
                    </Badge>
                    {clip.priority && (
                      <Badge
                        variant="secondary"
                        className={cn('text-white border-0', PRIORITY_COLORS[clip.priority])}
                      >
                        {PRIORITY_LABELS[clip.priority]}
                      </Badge>
                    )}
                    <button
                      onClick={() => onToggleFavorite(!clip.favorite)}
                      className="p-1 rounded hover:bg-neutral-800 transition-colors"
                    >
                      <Star
                        className={cn(
                          'h-5 w-5 transition-colors',
                          clip.favorite
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-neutral-600 hover:text-yellow-400'
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {clip.notes && (
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-300 whitespace-pre-wrap">{clip.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {clip.tags.length > 0 && (
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Tag className="h-5 w-5 text-purple-400" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {clip.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-neutral-500" />
                <div>
                  <p className="text-xs text-neutral-500">Date</p>
                  <p className="text-white">{formatDate(clip.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Gamepad2 className="h-4 w-4 text-neutral-500" />
                <div>
                  <p className="text-xs text-neutral-500">Game</p>
                  <p className="text-white">{clip.game || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-neutral-500" />
                <div>
                  <p className="text-xs text-neutral-500">Streamer</p>
                  <p className="text-white">{clip.streamer || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-neutral-500" />
                <div>
                  <p className="text-xs text-neutral-500">Category</p>
                  <p className="text-white">
                    {clip.category ? getCategoryWithEmoji(clip.category) : 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-neutral-500" />
                <div>
                  <p className="text-xs text-neutral-500">Priority</p>
                  <p className="text-white">
                    {clip.priority ? PRIORITY_LABELS[clip.priority] : 'Not set'}
                  </p>
                </div>
              </div>

              {clip.rating && (
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <div>
                    <p className="text-xs text-neutral-500">Rating</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-4 w-4',
                            i < clip.rating!
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-neutral-600'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* History */}
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" />
                History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col">
                <p className="text-xs text-neutral-500">Created</p>
                <p className="text-sm text-white">{formatDateTime(clip.created_at)}</p>
              </div>
              <Separator className="bg-neutral-800" />
              <div className="flex flex-col">
                <p className="text-xs text-neutral-500">Last Updated</p>
                <p className="text-sm text-white">{formatDateTime(clip.updated_at)}</p>
              </div>
              {clip.timeline_moment_id && (
                <>
                  <Separator className="bg-neutral-800" />
                  <div className="flex flex-col">
                    <p className="text-xs text-neutral-500">Created from Timeline</p>
                    <p className="text-sm text-green-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Yes
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {clip.clip_url && (
                <Button
                  variant="outline"
                  className="w-full border-neutral-700 text-white hover:bg-neutral-800 justify-start gap-2"
                  onClick={() => window.open(clip.clip_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Clip URL
                </Button>
              )}
              <Button
                variant="outline"
                className={cn(
                  'w-full border-neutral-700 text-white hover:bg-neutral-800 justify-start gap-2',
                  clip.favorite && 'border-yellow-500'
                )}
                onClick={() => onToggleFavorite(!clip.favorite)}
              >
                <Star className={cn('h-4 w-4', clip.favorite && 'fill-yellow-400 text-yellow-400')} />
                {clip.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

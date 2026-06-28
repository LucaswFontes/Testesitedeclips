'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ExternalLink, Film, Star, Edit2 } from 'lucide-react';
import { Clip } from '@/types/clip';
import { STATUS_LABELS, STATUS_COLORS, getCategoryWithEmoji } from '@/types/clip';
import { cn } from '@/lib/utils';

interface RecentActivityProps {
  clips: Clip[];
}

export function RecentActivity({ clips }: RecentActivityProps) {
  const recentCreated = [...clips]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const recentEdited = [...clips]
    .filter((c) => c.updated_at !== c.created_at)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  const recentPublished = clips
    .filter((c) => c.status === 'posted')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const ActivityItem = ({ clip, icon: Icon, iconColor }: { clip: Clip; icon: typeof Film; iconColor: string }) => (
    <div className="flex items-center gap-3 py-2 group/item hover:bg-neutral-800/50 -mx-2 px-2 rounded transition-colors">
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', iconColor)}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate group-hover/item:text-purple-300 transition-colors">
          {clip.title}
        </p>
        <p className="text-neutral-500 text-xs">{formatTimeAgo(clip.updated_at)}</p>
      </div>
      <div className="flex items-center gap-2">
        {clip.favorite && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
        <Badge
          variant="secondary"
          className={cn('text-white text-xs border-0', STATUS_COLORS[clip.status])}
        >
          {STATUS_LABELS[clip.status]}
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recently Created */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
              <Film className="h-3 w-3 text-white" />
            </div>
            Recently Created
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {recentCreated.length > 0 ? (
            recentCreated.map((clip) => (
              <ActivityItem
                key={clip.id}
                clip={clip}
                icon={Film}
                iconColor="bg-purple-600"
              />
            ))
          ) : (
            <p className="text-neutral-500 text-sm text-center py-4">No clips yet</p>
          )}
        </CardContent>
      </Card>

      {/* Recently Edited */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center">
              <Edit2 className="h-3 w-3 text-white" />
            </div>
            Recently Edited
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {recentEdited.length > 0 ? (
            recentEdited.map((clip) => (
              <ActivityItem
                key={clip.id}
                clip={clip}
                icon={Edit2}
                iconColor="bg-amber-600"
              />
            ))
          ) : (
            <p className="text-neutral-500 text-sm text-center py-4">No edits yet</p>
          )}
        </CardContent>
      </Card>

      {/* Recently Published */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-600 to-cyan-400 flex items-center justify-center">
              <ExternalLink className="h-3 w-3 text-white" />
            </div>
            Recently Published
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {recentPublished.length > 0 ? (
            recentPublished.map((clip) => (
              <ActivityItem
                key={clip.id}
                clip={clip}
                icon={ExternalLink}
                iconColor="bg-cyan-600"
              />
            ))
          ) : (
            <p className="text-neutral-500 text-sm text-center py-4">No published clips yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

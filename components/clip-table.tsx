'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { MoreVertical, Edit, Trash2, Star, ExternalLink, ChevronLeft, ChevronRight, Eye, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Clip,
  PLATFORM_COLORS,
  PRIORITY_COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
  PRIORITY_LABELS,
  getTagColor,
  getCategoryWithEmoji,
} from '@/types/clip';
import { TagBadge } from '@/components/tag-input';

interface ClipTableProps {
  clips: Clip[];
  onEdit: (clip: Clip) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleFavorite: (id: string, favorite: boolean) => Promise<void>;
  onViewDetails?: (clip: Clip) => void;
  loading: boolean;
}

export function ClipTable({
  clips,
  onEdit,
  onDelete,
  onToggleFavorite,
  onViewDetails,
  loading,
}: ClipTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(clips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClips = clips.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await onDelete(deleteId);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        </div>
      </div>
    );
  }

  if (clips.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600/20 to-purple-400/10 flex items-center justify-center">
            <Video className="h-10 w-10 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No clips found</h3>
          <p className="text-neutral-400 max-w-sm mx-auto">
            Get started by adding your first clip using the button above, or try adjusting your filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 bg-neutral-800/50 hover:bg-neutral-800/50">
                <TableHead className="text-neutral-400 w-[80px] sticky top-0 bg-neutral-800/50">Thumbnail</TableHead>
                <TableHead className="text-neutral-400 sticky top-0 bg-neutral-800/50">Title</TableHead>
                <TableHead className="text-neutral-400 sticky top-0 bg-neutral-800/50">Platform</TableHead>
                <TableHead className="text-neutral-400 hidden lg:table-cell sticky top-0 bg-neutral-800/50">Category</TableHead>
                <TableHead className="text-neutral-400 hidden xl:table-cell sticky top-0 bg-neutral-800/50">Game</TableHead>
                <TableHead className="text-neutral-400 hidden md:table-cell sticky top-0 bg-neutral-800/50">Streamer</TableHead>
                <TableHead className="text-neutral-400 hidden sm:table-cell sticky top-0 bg-neutral-800/50">Status</TableHead>
                <TableHead className="text-neutral-400 hidden xl:table-cell sticky top-0 bg-neutral-800/50">Priority</TableHead>
                <TableHead className="text-neutral-400 hidden lg:table-cell sticky top-0 bg-neutral-800/50">Rating</TableHead>
                <TableHead className="text-neutral-400 hidden 2xl:table-cell sticky top-0 bg-neutral-800/50">Tags</TableHead>
                <TableHead className="text-neutral-400 w-[60px] sticky top-0 bg-neutral-800/50">Fav</TableHead>
                <TableHead className="text-neutral-400 w-[60px] sticky top-0 bg-neutral-800/50">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClips.map((clip) => (
                <TableRow
                  key={clip.id}
                  className="border-neutral-800 hover:bg-neutral-800/50 group transition-colors"
                >
                  <TableCell>
                    <div className="w-16 h-10 rounded-lg bg-neutral-800 overflow-hidden relative group/img">
                      {clip.thumbnail_url ? (
                        <img
                          src={clip.thumbnail_url}
                          alt={clip.title}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className={cn(
                          'w-full h-full flex items-center justify-center',
                          PLATFORM_COLORS[clip.platform]
                        )}>
                          <ExternalLink className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="text-white font-medium truncate group-hover:text-purple-300 transition-colors">{clip.title}</p>
                      {clip.clip_url && (
                        <a
                          href={clip.clip_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                        >
                          View clip
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-white text-xs capitalize border-0',
                        PLATFORM_COLORS[clip.platform]
                      )}
                    >
                      {clip.platform}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-neutral-300 hidden lg:table-cell">
                    {clip.category ? getCategoryWithEmoji(clip.category) : '-'}
                  </TableCell>
                  <TableCell className="text-neutral-300 hidden xl:table-cell">
                    <span className="truncate block max-w-[120px]" title={clip.game || ''}>
                      {clip.game || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-neutral-300 hidden md:table-cell">
                    <span className="truncate block max-w-[100px]" title={clip.streamer || ''}>
                      {clip.streamer || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-white text-xs border-0',
                        STATUS_COLORS[clip.status]
                      )}
                    >
                      {STATUS_LABELS[clip.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {clip.priority ? (
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-white text-xs border-0',
                          PRIORITY_COLORS[clip.priority]
                        )}
                      >
                        {PRIORITY_LABELS[clip.priority]}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {clip.rating ? (
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-3 w-3',
                              i < clip.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-600'
                            )}
                          />
                        ))}
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="hidden 2xl:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {clip.tags?.slice(0, 2).map((tag) => (
                        <TagBadge key={tag} tag={tag} />
                      ))}
                      {clip.tags?.length > 2 && (
                        <span className="text-xs text-neutral-500">+{clip.tags.length - 2}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => onToggleFavorite(clip.id, !clip.favorite)}
                      className="p-1 rounded hover:bg-neutral-700 transition-colors"
                    >
                      <Star
                        className={cn(
                          'h-4 w-4 transition-all duration-300',
                          clip.favorite
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-neutral-600 group-hover:text-neutral-400'
                        )}
                      />
                    </button>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-800"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-neutral-800 border-neutral-700 text-white"
                      >
                        {onViewDetails && (
                          <DropdownMenuItem
                            onClick={() => onViewDetails(clip)}
                            className="hover:bg-neutral-700 cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => onEdit(clip)}
                          className="hover:bg-neutral-700 cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(clip.id)}
                          className="hover:bg-neutral-700 cursor-pointer text-red-400 focus:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-800">
            <div className="text-sm text-neutral-400">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, clips.length)} of {clips.length} clips
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="border-neutral-700 text-white hover:bg-neutral-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-neutral-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="border-neutral-700 text-white hover:bg-neutral-800"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-neutral-900 border-neutral-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Clip</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              Are you sure you want to delete this clip? This action cannot be undone.
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
    </>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Star, X, ArrowUp, ArrowDown, CalendarIcon, Tags, Filter } from 'lucide-react';
import { Filters, SortField, SortDirection } from '@/hooks/use-clips';
import { Platform, Priority, Status, STATUSES, PRIORITIES, PLATFORMS, CATEGORIES } from '@/types/clip';
import { cn } from '@/lib/utils';
import { TagBadge } from '@/components/tag-input';
import { format } from 'date-fns';

interface FilterBarProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (dir: SortDirection) => void;
  uniqueCategories: string[];
  uniqueGames: string[];
  uniqueStreamers: string[];
  uniqueTags: string[];
}

const sortFields: { value: SortField; label: string }[] = [
  { value: 'date', label: 'Date' },
  { value: 'rating', label: 'Rating' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
  { value: 'created_at', label: 'Created' },
];

export function FilterBar({
  filters,
  setFilters,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  uniqueCategories,
  uniqueGames,
  uniqueStreamers,
  uniqueTags,
}: FilterBarProps) {
  const hasFilters =
    filters.platform !== 'all' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== '' ||
    filters.game !== '' ||
    filters.streamer !== '' ||
    filters.favoritesOnly ||
    filters.tags.length > 0 ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  const clearFilters = () => {
    setFilters({
      search: filters.search,
      platform: 'all',
      category: '',
      game: '',
      streamer: '',
      status: 'all',
      priority: 'all',
      favoritesOnly: false,
      tags: [],
      dateFrom: '',
      dateTo: '',
    });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    setFilters({ ...filters, tags: newTags });
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filters.platform}
          onValueChange={(value: Platform | 'all') =>
            setFilters({ ...filters, platform: value })
          }
        >
          <SelectTrigger className="w-[130px] bg-neutral-900 border-neutral-800 text-white focus:border-purple-500">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
            <SelectItem value="all">All Platforms</SelectItem>
            {PLATFORMS.map((p) => (
              <SelectItem key={p} value={p} className="capitalize">
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value: Status | 'all') =>
            setFilters({ ...filters, status: value })
          }
        >
          <SelectTrigger className="w-[130px] bg-neutral-900 border-neutral-800 text-white focus:border-purple-500">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
            <SelectItem value="all">All Status</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.priority}
          onValueChange={(value: Priority | 'all') =>
            setFilters({ ...filters, priority: value })
          }
        >
          <SelectTrigger className="w-[130px] bg-neutral-900 border-neutral-800 text-white focus:border-purple-500">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
            <SelectItem value="all">All Priority</SelectItem>
            {PRIORITIES.map((p) => (
              <SelectItem key={p} value={p} className="capitalize">
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.category || 'all'}
          onValueChange={(value) =>
            setFilters({ ...filters, category: value === 'all' ? '' : value })
          }
        >
          <SelectTrigger className="w-[150px] bg-neutral-900 border-neutral-800 text-white focus:border-purple-500">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.emoji} {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {uniqueGames.length > 0 && (
          <Select
            value={filters.game || 'all'}
            onValueChange={(value) => setFilters({ ...filters, game: value === 'all' ? '' : value })}
          >
            <SelectTrigger className="w-[150px] bg-neutral-900 border-neutral-800 text-white focus:border-purple-500">
              <SelectValue placeholder="Game" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
              <SelectItem value="all">All Games</SelectItem>
              {uniqueGames.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {uniqueStreamers.length > 0 && (
          <Select
            value={filters.streamer || 'all'}
            onValueChange={(value) => setFilters({ ...filters, streamer: value === 'all' ? '' : value })}
          >
            <SelectTrigger className="w-[150px] bg-neutral-900 border-neutral-800 text-white focus:border-purple-500">
              <SelectValue placeholder="Streamer" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
              <SelectItem value="all">All Streamers</SelectItem>
              {uniqueStreamers.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'gap-2 border-neutral-800 text-white hover:bg-neutral-800',
                (filters.dateFrom || filters.dateTo) && 'border-purple-500'
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              Date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-neutral-900 border-neutral-800" align="start">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">From</label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">To</label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {uniqueTags.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'gap-2 border-neutral-800 text-white hover:bg-neutral-800',
                  filters.tags.length > 0 && 'border-purple-500'
                )}
              >
                <Tags className="h-4 w-4" />
                Tags
                {filters.tags.length > 0 && (
                  <span className="bg-purple-500 text-white text-xs rounded-full px-1.5">
                    {filters.tags.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-neutral-900 border-neutral-800" align="start">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-neutral-400">Filter by Tags</label>
                  {filters.tags.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilters({ ...filters, tags: [] })}
                      className="text-xs text-neutral-400"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        'rounded-md border px-2 py-1 text-xs transition-all cursor-pointer',
                        filters.tags.includes(tag)
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        <Button
          variant={filters.favoritesOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilters({ ...filters, favoritesOnly: !filters.favoritesOnly })}
          className={cn(
            'gap-1',
            filters.favoritesOnly
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'border-neutral-800 text-white hover:bg-neutral-800'
          )}
        >
          <Star className={cn('h-4 w-4', filters.favoritesOnly && 'fill-current')} />
          Favorites
        </Button>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-neutral-400 hover:text-white hover:bg-neutral-800 gap-1"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-neutral-400 text-sm">Sort by:</span>
        <div className="flex gap-1">
          {sortFields.map((field) => (
            <Button
              key={field.value}
              variant="ghost"
              size="sm"
              onClick={() => toggleSort(field.value)}
              className={cn(
                'gap-1',
                sortField === field.value
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              )}
            >
              {field.label}
              {sortField === field.value &&
                (sortDirection === 'desc' ? (
                  <ArrowDown className="h-3 w-3" />
                ) : (
                  <ArrowUp className="h-3 w-3" />
                ))}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { forwardRef } from 'react';

interface HeaderProps {
  title: string;
  search: string;
  setSearch: (search: string) => void;
  onNewClip: () => void;
}

export const Header = forwardRef<HTMLInputElement, HeaderProps>(
  ({ title, search, setSearch, onNewClip }, ref) => {
    return (
      <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm border-b border-neutral-800 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">{title}</h1>

          <div className="flex items-center gap-4 flex-1 max-w-xl ml-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                ref={ref}
                placeholder="Search by title, game, streamer, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus:border-purple-500 transition-colors"
              />
            </div>

            <Button
              onClick={onNewClip}
              className="bg-violet-600 hover:bg-violet-700 text-white gap-2 shrink-0 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Clip</span>
            </Button>
          </div>
        </div>
      </header>
    );
  }
);

Header.displayName = 'Header';

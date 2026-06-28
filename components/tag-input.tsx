'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTagColor, DEFAULT_TAGS } from '@/types/clip';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onChange, placeholder = 'Add tag...' }: TagInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = DEFAULT_TAGS.filter(
    (t) => !tags.includes(t) && t.toLowerCase().includes(input.toLowerCase())
  );

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className={cn('px-2 py-1 text-sm border gap-1', getTagColor(tag))}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:opacity-70"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="relative">
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="bg-neutral-800 border-neutral-700 text-white pr-10"
          />
          <button
            type="button"
            onClick={() => input && addTag(input)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
            {suggestions.slice(0, 8).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                className="w-full px-3 py-2 text-left text-white hover:bg-neutral-700 text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface TagBadgeProps {
  tag: string;
  onClick?: () => void;
  removable?: boolean;
}

export function TagBadge({ tag, onClick, removable = false }: TagBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('px-2 py-0.5 text-xs border', getTagColor(tag), onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      {tag}
      {removable && <X className="h-3 w-3 ml-1" />}
    </Badge>
  );
}

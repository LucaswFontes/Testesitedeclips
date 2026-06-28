export type Platform = 'kick' | 'twitch' | 'youtube';
export type Priority = 'low' | 'medium' | 'high';
export type Status = 'to_edit' | 'editing' | 'ready' | 'posted';

export interface Clip {
  id: string;
  title: string;
  clip_url: string;
  platform: Platform;
  category: string | null;
  game: string | null;
  streamer: string | null;
  notes: string | null;
  date: string | null;
  rating: number | null;
  priority: Priority | null;
  status: Status;
  favorite: boolean;
  thumbnail_url: string | null;
  tags: string[];
  timeline_moment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimelineMoment {
  id: string;
  title: string;
  description: string | null;
  timestamp: string | null;
  category: string | null;
  tags: string[];
  favorite: boolean;
  priority: Priority | null;
  converted_to_clip: boolean;
  clip_id: string | null;
  created_at: string;
}

export interface ClipFormData {
  title: string;
  clip_url: string;
  platform: Platform;
  category: string;
  game: string;
  streamer: string;
  notes: string;
  date: string;
  rating: number;
  priority: Priority;
  status: Status;
  favorite: boolean;
  thumbnail_url: string;
  tags: string[];
}

export interface TimelineFormData {
  title: string;
  description: string;
  timestamp: string;
  category: string;
  tags: string[];
  favorite: boolean;
  priority: Priority;
}

export const PLATFORMS: Platform[] = ['kick', 'twitch', 'youtube'];
export const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
export const STATUSES: Status[] = ['to_edit', 'editing', 'ready', 'posted'];

export const PLATFORM_COLORS: Record<Platform, string> = {
  kick: 'bg-green-500',
  twitch: 'bg-purple-500',
  youtube: 'bg-red-500',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-slate-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
};

export const STATUS_COLORS: Record<Status, string> = {
  to_edit: 'bg-slate-500',
  editing: 'bg-blue-500',
  ready: 'bg-green-500',
  posted: 'bg-purple-500',
};

export const STATUS_LABELS: Record<Status, string> = {
  to_edit: 'To Edit',
  editing: 'Editing',
  ready: 'Ready',
  posted: 'Posted',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const CATEGORIES: { value: string; label: string; emoji: string }[] = [
  { value: 'funny', label: 'Funny', emoji: '😂' },
  { value: 'scary', label: 'Scary', emoji: '😱' },
  { value: 'best_moment', label: 'Best Moment', emoji: '🔥' },
  { value: 'gameplay', label: 'Gameplay', emoji: '🎮' },
  { value: 'story', label: 'Story', emoji: '❤️' },
  { value: 'rage', label: 'Rage', emoji: '💀' },
  { value: 'plot_twist', label: 'Plot Twist', emoji: '🤯' },
  { value: 'chat', label: 'Chat', emoji: '📢' },
  { value: 'reaction', label: 'Reaction', emoji: '🎤' },
  { value: 'donation', label: 'Donation', emoji: '🎁' },
];

export const DEFAULT_TAGS = [
  'CS2',
  'Minecraft',
  'IRL',
  'Funny',
  'Rage',
  'Chat',
  'Donation',
  'NPC',
  'React',
  'Meme',
  'Valorant',
  'League of Legends',
  'Apex',
  'Fortnite',
  'GTA',
];

export const TAG_COLORS: string[] = [
  'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'bg-green-500/20 text-green-300 border-green-500/30',
  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'bg-red-500/20 text-red-300 border-red-500/30',
];

export function getTagColor(tag: string): string {
  const hash = tag.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export function getCategoryWithEmoji(category: string | null): string {
  if (!category) return '';
  const found = CATEGORIES.find(c => c.value === category);
  return found ? `${found.emoji} ${found.label}` : category;
}

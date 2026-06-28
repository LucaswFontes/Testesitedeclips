'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Film,
  Clock,
  Scissors,
  CheckCircle,
  Star,
  AlertTriangle,
  TrendingUp,
  Gamepad2,
} from 'lucide-react';
import { Clip } from '@/types/clip';
import { useClipStats } from '@/hooks/use-clips';

interface StatsCardsProps {
  clips: Clip[];
}

export function StatsCards({ clips }: StatsCardsProps) {
  const stats = useClipStats(clips);

  const cards = [
    {
      label: 'Total Clips',
      value: stats.total,
      icon: Film,
      gradient: 'from-violet-600 to-violet-400',
      bgGradient: 'from-violet-600/10 to-violet-400/5',
    },
    {
      label: 'Ready to Edit',
      value: stats.readyToEdit,
      icon: Scissors,
      gradient: 'from-emerald-600 to-emerald-400',
      bgGradient: 'from-emerald-600/10 to-emerald-400/5',
    },
    {
      label: 'Currently Editing',
      value: stats.editing,
      icon: Clock,
      gradient: 'from-amber-600 to-amber-400',
      bgGradient: 'from-amber-600/10 to-amber-400/5',
    },
    {
      label: 'Published',
      value: stats.published,
      icon: CheckCircle,
      gradient: 'from-cyan-600 to-cyan-400',
      bgGradient: 'from-cyan-600/10 to-cyan-400/5',
    },
    {
      label: 'Favorites',
      value: stats.favorites,
      icon: Star,
      gradient: 'from-pink-600 to-pink-400',
      bgGradient: 'from-pink-600/10 to-pink-400/5',
    },
    {
      label: 'High Priority',
      value: stats.highPriority,
      icon: AlertTriangle,
      gradient: 'from-red-600 to-red-400',
      bgGradient: 'from-red-600/10 to-red-400/5',
    },
    {
      label: 'Avg Rating',
      value: stats.avgRating,
      icon: TrendingUp,
      gradient: 'from-teal-600 to-teal-400',
      bgGradient: 'from-teal-600/10 to-teal-400/5',
    },
    {
      label: 'Total Games',
      value: stats.totalGames,
      icon: Gamepad2,
      gradient: 'from-indigo-600 to-indigo-400',
      bgGradient: 'from-indigo-600/10 to-indigo-400/5',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((stat) => (
        <Card
          key={stat.label}
          className={`bg-gradient-to-br ${stat.bgGradient} border-neutral-800 hover:border-neutral-700 transition-all duration-300 group overflow-hidden`}
        >
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-${stat.gradient.split('-')[1]}-500/20`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

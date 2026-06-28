'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Clip, ClipFormData, TimelineMoment, TimelineFormData, Platform, Priority, Status } from '@/types/clip';

export function useClips() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('clips')
        .select('*')
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setClips(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clips');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClips();
  }, [fetchClips]);

  const createClip = useCallback(async (formData: ClipFormData) => {
    const { data, error: createError } = await supabase
      .from('clips')
      .insert({
        title: formData.title,
        clip_url: formData.clip_url,
        platform: formData.platform,
        category: formData.category || null,
        game: formData.game || null,
        streamer: formData.streamer || null,
        notes: formData.notes || null,
        date: formData.date || null,
        rating: formData.rating || null,
        priority: formData.priority || null,
        status: formData.status,
        favorite: formData.favorite,
        thumbnail_url: formData.thumbnail_url || null,
        tags: formData.tags || [],
      })
      .select()
      .single();

    if (createError) throw createError;
    if (data) setClips((prev) => [data, ...prev]);
    return data;
  }, []);

  const updateClip = useCallback(async (id: string, formData: ClipFormData) => {
    const { data, error: updateError } = await supabase
      .from('clips')
      .update({
        title: formData.title,
        clip_url: formData.clip_url,
        platform: formData.platform,
        category: formData.category || null,
        game: formData.game || null,
        streamer: formData.streamer || null,
        notes: formData.notes || null,
        date: formData.date || null,
        rating: formData.rating || null,
        priority: formData.priority || null,
        status: formData.status,
        favorite: formData.favorite,
        thumbnail_url: formData.thumbnail_url || null,
        tags: formData.tags || [],
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;
    if (data) {
      setClips((prev) => prev.map((clip) => (clip.id === id ? data : clip)));
    }
    return data;
  }, []);

  const deleteClip = useCallback(async (id: string) => {
    const { error: deleteError } = await supabase.from('clips').delete().eq('id', id);
    if (deleteError) throw deleteError;
    setClips((prev) => prev.filter((clip) => clip.id !== id));
  }, []);

  const toggleFavorite = useCallback(async (id: string, favorite: boolean) => {
    const { error: updateError } = await supabase
      .from('clips')
      .update({ favorite })
      .eq('id', id);

    if (updateError) throw updateError;
    setClips((prev) => prev.map((clip) => (clip.id === id ? { ...clip, favorite } : clip)));
  }, []);

  return {
    clips,
    loading,
    error,
    fetchClips,
    createClip,
    updateClip,
    deleteClip,
    toggleFavorite,
  };
}

export function useTimeline() {
  const [moments, setMoments] = useState<TimelineMoment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('timeline_moments')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setMoments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch moments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoments();
  }, [fetchMoments]);

  const createMoment = useCallback(async (formData: TimelineFormData) => {
    const { data, error: createError } = await supabase
      .from('timeline_moments')
      .insert({
        title: formData.title,
        description: formData.description || null,
        timestamp: formData.timestamp || null,
        category: formData.category || null,
        tags: formData.tags || [],
        favorite: formData.favorite,
        priority: formData.priority || null,
      })
      .select()
      .single();

    if (createError) throw createError;
    if (data) setMoments((prev) => [data, ...prev]);
    return data;
  }, []);

  const updateMoment = useCallback(async (id: string, formData: TimelineFormData) => {
    const { data, error: updateError } = await supabase
      .from('timeline_moments')
      .update({
        title: formData.title,
        description: formData.description || null,
        timestamp: formData.timestamp || null,
        category: formData.category || null,
        tags: formData.tags || [],
        favorite: formData.favorite,
        priority: formData.priority || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;
    if (data) {
      setMoments((prev) => prev.map((m) => (m.id === id ? data : m)));
    }
    return data;
  }, []);

  const deleteMoment = useCallback(async (id: string) => {
    const { error: deleteError } = await supabase.from('timeline_moments').delete().eq('id', id);
    if (deleteError) throw deleteError;
    setMoments((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const convertToClip = useCallback(async (moment: TimelineMoment, clipData: ClipFormData) => {
    const { data: clip, error: clipError } = await supabase
      .from('clips')
      .insert({
        ...clipData,
        timeline_moment_id: moment.id,
      })
      .select()
      .single();

    if (clipError) throw clipError;

    const { error: updateError } = await supabase
      .from('timeline_moments')
      .update({ converted_to_clip: true, clip_id: clip.id })
      .eq('id', moment.id);

    if (updateError) throw updateError;

    setMoments((prev) =>
      prev.map((m) => (m.id === moment.id ? { ...m, converted_to_clip: true, clip_id: clip.id } : m))
    );

    return clip;
  }, []);

  return {
    moments,
    loading,
    error,
    fetchMoments,
    createMoment,
    updateMoment,
    deleteMoment,
    convertToClip,
  };
}

export interface Filters {
  search: string;
  platform: Platform | 'all';
  category: string;
  game: string;
  streamer: string;
  status: Status | 'all';
  priority: Priority | 'all';
  favoritesOnly: boolean;
  tags: string[];
  dateFrom: string;
  dateTo: string;
}

export type SortField = 'date' | 'rating' | 'priority' | 'title' | 'created_at';
export type SortDirection = 'asc' | 'desc';

export function useFilteredClips(
  clips: Clip[],
  filters: Filters,
  sortField: SortField,
  sortDirection: SortDirection
) {
  const uniqueCategories = useMemo(() => {
    const cats = new Set(clips.map((c) => c.category).filter(Boolean));
    return Array.from(cats).sort() as string[];
  }, [clips]);

  const uniqueGames = useMemo(() => {
    const games = new Set(clips.map((c) => c.game).filter(Boolean));
    return Array.from(games).sort() as string[];
  }, [clips]);

  const uniqueStreamers = useMemo(() => {
    const streamers = new Set(clips.map((c) => c.streamer).filter(Boolean));
    return Array.from(streamers).sort() as string[];
  }, [clips]);

  const uniqueTags = useMemo(() => {
    const allTags = clips.flatMap((c) => c.tags || []);
    return Array.from(new Set(allTags)).sort();
  }, [clips]);

  const filteredClips = useMemo(() => {
    let result = [...clips];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter((clip) =>
        clip.title.toLowerCase().includes(search) ||
        (clip.game?.toLowerCase().includes(search)) ||
        (clip.streamer?.toLowerCase().includes(search)) ||
        (clip.category?.toLowerCase().includes(search)) ||
        (clip.notes?.toLowerCase().includes(search)) ||
        clip.platform.toLowerCase().includes(search) ||
        (clip.tags?.some(t => t.toLowerCase().includes(search)))
      );
    }

    if (filters.platform !== 'all') {
      result = result.filter((clip) => clip.platform === filters.platform);
    }

    if (filters.category) {
      result = result.filter((clip) => clip.category === filters.category);
    }

    if (filters.game) {
      result = result.filter((clip) => clip.game === filters.game);
    }

    if (filters.streamer) {
      result = result.filter((clip) => clip.streamer === filters.streamer);
    }

    if (filters.status !== 'all') {
      result = result.filter((clip) => clip.status === filters.status);
    }

    if (filters.priority !== 'all') {
      result = result.filter((clip) => clip.priority === filters.priority);
    }

    if (filters.favoritesOnly) {
      result = result.filter((clip) => clip.favorite);
    }

    if (filters.tags.length > 0) {
      result = result.filter((clip) =>
        filters.tags.every((tag) => clip.tags?.includes(tag))
      );
    }

    if (filters.dateFrom) {
      result = result.filter((clip) => clip.date && clip.date >= filters.dateFrom);
    }

    if (filters.dateTo) {
      result = result.filter((clip) => clip.date && clip.date <= filters.dateTo);
    }

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'date':
          comparison = new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case 'priority':
          comparison = (priorityOrder[a.priority || 'low'] ?? 2) - (priorityOrder[b.priority || 'low'] ?? 2);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [clips, filters, sortField, sortDirection]);

  return { filteredClips, uniqueCategories, uniqueGames, uniqueStreamers, uniqueTags };
}

export function useClipStats(clips: Clip[]) {
  return useMemo(() => {
    const total = clips.length;
    const readyToEdit = clips.filter((c) => c.status === 'ready').length;
    const editing = clips.filter((c) => c.status === 'editing').length;
    const published = clips.filter((c) => c.status === 'posted').length;
    const favorites = clips.filter((c) => c.favorite).length;
    const highPriority = clips.filter((c) => c.priority === 'high').length;
    const avgRating = clips.length > 0
      ? (clips.reduce((sum, c) => sum + (c.rating || 0), 0) / clips.length).toFixed(1)
      : '0.0';
    const totalGames = new Set(clips.map((c) => c.game).filter(Boolean)).size;

    const clipsByCategory = clips.reduce((acc, clip) => {
      const cat = clip.category || 'Other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const clipsByGame = clips.reduce((acc, clip) => {
      const game = clip.game || 'Other';
      acc[game] = (acc[game] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const clipsByStatus = clips.reduce((acc, clip) => {
      acc[clip.status] = (acc[clip.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const clipsByMonth = clips.reduce((acc, clip) => {
      if (clip.date) {
        const month = clip.date.substring(0, 7);
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      readyToEdit,
      editing,
      published,
      favorites,
      highPriority,
      avgRating,
      totalGames,
      clipsByCategory,
      clipsByGame,
      clipsByStatus,
      clipsByMonth,
    };
  }, [clips]);
}

'use client';

import { useState, useCallback, useRef } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { StatsCards } from '@/components/stats-cards';
import { ClipTable } from '@/components/clip-table';
import { ClipFormModal } from '@/components/clip-form-modal';
import { ClipDetailsPage } from '@/components/clip-details-page';
import { FilterBar } from '@/components/filter-bar';
import { SettingsPage } from '@/components/settings-page';
import { DashboardCharts } from '@/components/dashboard-charts';
import { RecentActivity } from '@/components/recent-activity';
import { TimelinePage } from '@/components/timeline-page';
import { useClips, useFilteredClips, Filters, SortField, SortDirection } from '@/hooks/use-clips';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { ClipFormData, Clip } from '@/types/clip';
import { toast } from 'sonner';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClip, setEditingClip] = useState<Clip | null>(null);
  const [viewingClip, setViewingClip] = useState<Clip | null>(null);

  const [filters, setFilters] = useState<Filters>({
    search: '',
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

  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    clips,
    loading,
    error,
    createClip,
    updateClip,
    deleteClip,
    toggleFavorite,
  } = useClips();

  const { filteredClips, uniqueCategories, uniqueGames, uniqueStreamers, uniqueTags } = useFilteredClips(
    clips,
    filters,
    sortField,
    sortDirection
  );

  const handleNewClip = useCallback(() => {
    setEditingClip(null);
    setModalOpen(true);
  }, []);

  const handleEditClip = useCallback((clip: Clip) => {
    setEditingClip(clip);
    setModalOpen(true);
  }, []);

  const handleViewClip = useCallback((clip: Clip) => {
    setViewingClip(clip);
  }, []);

  const handleBackFromDetails = useCallback(() => {
    setViewingClip(null);
  }, []);

  const handleSubmit = useCallback(
    async (data: ClipFormData) => {
      try {
        if (editingClip) {
          await updateClip(editingClip.id, data);
          toast.success('Clip updated successfully');
        } else {
          await createClip(data);
          toast.success('Clip created successfully');
        }
      } catch (err) {
        toast.error(editingClip ? 'Failed to update clip' : 'Failed to create clip');
        throw err;
      }
    },
    [editingClip, createClip, updateClip]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteClip(id);
        toast.success('Clip deleted successfully');
      } catch (err) {
        toast.error('Failed to delete clip');
        throw err;
      }
    },
    [deleteClip]
  );

  const handleToggleFavorite = useCallback(
    async (id: string, favorite: boolean) => {
      try {
        await toggleFavorite(id, favorite);
      } catch (err) {
        toast.error('Failed to update favorite');
      }
    },
    [toggleFavorite]
  );

  const handleFocusSearch = useCallback(() => {
    searchInputRef.current?.focus();
    setCurrentPage('clips');
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onCreateNew: handleNewClip,
    onFocusSearch: handleFocusSearch,
    onCloseDialog: modalOpen ? handleCloseModal : undefined,
  });

  const getPageTitle = () => {
    if (viewingClip) return '';
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'clips':
        return 'All Clips';
      case 'timeline':
        return 'Live Timeline';
      case 'settings':
        return 'Settings';
      default:
        return 'Clip Tracker';
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        {currentPage !== 'settings' && currentPage !== 'timeline' && !viewingClip && (
          <Header
            title={getPageTitle()}
            search={filters.search}
            setSearch={(search) => setFilters({ ...filters, search })}
            onNewClip={handleNewClip}
          />
        )}

        <main className="flex-1 p-6 overflow-auto scrollbar-thin">
          {viewingClip ? (
            <ClipDetailsPage
              clip={viewingClip}
              onBack={handleBackFromDetails}
              onEdit={() => {
                setEditingClip(viewingClip);
                setModalOpen(true);
              }}
              onDelete={async () => {
                if (confirm('Are you sure you want to delete this clip?')) {
                  await handleDelete(viewingClip.id);
                  setViewingClip(null);
                }
              }}
              onToggleFavorite={async (favorite) => {
                await toggleFavorite(viewingClip.id, favorite);
                setViewingClip({ ...viewingClip, favorite });
              }}
            />
          ) : currentPage === 'dashboard' ? (
            <div className="space-y-6">
              <StatsCards clips={clips} />
              <DashboardCharts clips={clips} />
              <RecentActivity clips={clips} />

              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Recent Clips</h2>
                <FilterBar
                  filters={filters}
                  setFilters={setFilters}
                  sortField={sortField}
                  setSortField={setSortField}
                  sortDirection={sortDirection}
                  setSortDirection={setSortDirection}
                  uniqueCategories={uniqueCategories}
                  uniqueGames={uniqueGames}
                  uniqueStreamers={uniqueStreamers}
                  uniqueTags={uniqueTags}
                />
                <div className="mt-4">
                  <ClipTable
                    clips={filteredClips}
                    onEdit={handleEditClip}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                    onViewDetails={handleViewClip}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          ) : currentPage === 'clips' ? (
            <div className="space-y-4">
              <FilterBar
                filters={filters}
                setFilters={setFilters}
                sortField={sortField}
                setSortField={setSortField}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                uniqueCategories={uniqueCategories}
                uniqueGames={uniqueGames}
                uniqueStreamers={uniqueStreamers}
                uniqueTags={uniqueTags}
              />
              <ClipTable
                clips={filteredClips}
                onEdit={handleEditClip}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onViewDetails={handleViewClip}
                loading={loading}
              />
            </div>
          ) : currentPage === 'timeline' ? (
            <TimelinePage />
          ) : currentPage === 'settings' ? (
            <SettingsPage />
          ) : null}
        </main>
      </div>

      <ClipFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingClip(null);
        }}
        onSubmit={handleSubmit}
        clip={editingClip}
      />
    </div>
  );
}

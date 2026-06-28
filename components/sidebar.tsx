'use client';

import { cn } from '@/lib/utils';
import { LayoutDashboard, Film, Clock, Settings, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clips', label: 'Clips', icon: Film },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, setCurrentPage, collapsed, setCollapsed }: SidebarProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-neutral-900 border border-neutral-800"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </Button>

      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 flex flex-col bg-neutral-900/95 backdrop-blur border-r border-neutral-800 transition-all duration-300',
          collapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-64',
          'lg:translate-x-0'
        )}
      >
        <div className={cn(
          'flex items-center border-b border-neutral-800',
          collapsed ? 'justify-center p-4' : 'justify-between p-6'
        )}>
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center">
                <Film className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-white text-lg">Clip Tracker</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center">
              <Film className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        <TooltipProvider delayDuration={0}>
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setCurrentPage(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-lg transition-all duration-200',
                      collapsed ? 'justify-center p-3' : 'px-3 py-3',
                      currentPage === item.id
                        ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="bg-neutral-800 border-neutral-700 text-white">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>
        </TooltipProvider>

        <div className={cn(
          'border-t border-neutral-800',
          collapsed ? 'p-4' : 'p-6'
        )}>
          {!collapsed && (
            <div className="text-xs text-neutral-500">
              Version 1.5
            </div>
          )}
        </div>
      </aside>

      {collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}

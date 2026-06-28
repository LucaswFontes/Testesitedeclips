'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Clip } from '@/types/clip';
import { useClipStats } from '@/hooks/use-clips';
import { CATEGORIES } from '@/types/clip';

const COLORS = [
  '#8b5cf6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#6366f1',
  '#14b8a6',
  '#f97316',
  '#84cc16',
];

interface DashboardChartsProps {
  clips: Clip[];
}

export function DashboardCharts({ clips }: DashboardChartsProps) {
  const stats = useClipStats(clips);

  const categoryData = Object.entries(stats.clipsByCategory)
    .map(([name, value]) => ({
      name: CATEGORIES.find((c) => c.value === name)?.label || name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const gameData = Object.entries(stats.clipsByGame)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const statusData = [
    { name: 'To Edit', value: stats.clipsByStatus.to_edit || 0, fill: '#64748b' },
    { name: 'Editing', value: stats.clipsByStatus.editing || 0, fill: '#3b82f6' },
    { name: 'Ready', value: stats.clipsByStatus.ready || 0, fill: '#10b981' },
    { name: 'Posted', value: stats.clipsByStatus.posted || 0, fill: '#8b5cf6' },
  ];

  const monthlyData = Object.entries(stats.clipsByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, count]) => ({
      name: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      clips: count,
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Clips by Status */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Clips by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f1f1f',
                    border: '1px solid #404040',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend
                  formatter={(value) => <span className="text-neutral-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Clips by Category */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Clips by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis type="number" stroke="#737373" />
                <YAxis dataKey="name" type="category" width={100} stroke="#737373" tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f1f1f',
                    border: '1px solid #404040',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Clips by Game */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Top Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gameData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="name" stroke="#737373" tick={{ fill: '#a3a3a3', fontSize: 10 }} interval={0} height={60} />
                <YAxis stroke="#737373" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f1f1f',
                    border: '1px solid #404040',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Published per Month */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Clips Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="name" stroke="#737373" tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                  <YAxis stroke="#737373" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f1f1f',
                      border: '1px solid #404040',
                      borderRadius: '8px',
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clips"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-500">
                No data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

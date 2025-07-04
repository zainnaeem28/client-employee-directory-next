'use client';

/*
# @Author: Muhammad Zain Naeem PMP®, APMC® <zain.naeem@invozone.dev>
# @Role: Senior Software Engineer, Designer & Writer
# @GitHub: https://github.com/scriptsamurai28
# @CodeStats: https://codestats.net/users/scriptsamurai28
# @Date: July 04, 2025
# @Version: 1.0.0
# @Status: Production Ready ✅
#
# 💡 "Code is poetry written in logic"
# 📍 Built with ❤️ in Lahore, Pakistan
# 🎯 Turning ideas into digital reality
*/
import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Activity, Building2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { employeeApi } from '@/lib/api';

const mockStats = {
  totalEmployees: 128,
  departments: 7,
  topLocation: { name: 'New York', count: 42, percent: 33 },
  locations: [
    { name: 'New York', value: 42 },
    { name: 'San Francisco', value: 30 },
    { name: 'London', value: 20 },
    { name: 'Other', value: 36 },
  ],
  averageSalary: 92000,
  activeEmployees: { active: 110, total: 128 },
  jobTitleTrends: [
    { title: 'Software Engineer', value: 40 },
    { title: 'Designer', value: 22 },
    { title: 'Manager', value: 18 },
    { title: 'QA', value: 12 },
    { title: 'Other', value: 36 },
  ],
};

const glassyCard =
  'relative z-0 rounded-xl shadow-lg px-4 py-3 flex flex-row items-center justify-between bg-gradient-to-br from-blue-400/80 via-blue-600/60 to-blue-800/80 backdrop-blur-xl border border-blue-200/40 min-h-[110px] max-h-[110px] min-w-[260px] overflow-hidden group transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-300/60';

const glassyCardNoOverflow =
  'relative z-0 rounded-xl shadow-lg px-4 py-3 flex flex-row items-center justify-between bg-gradient-to-br from-blue-400/80 via-blue-600/60 to-blue-800/80 backdrop-blur-xl border border-blue-200/40 min-h-[110px] max-h-[110px] min-w-[260px] group transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-300/60';

const glassyTooltip =
  'backdrop-blur-md bg-blue-900/80 border border-blue-300/30 text-white text-sm rounded-md px-6 py-2 shadow-lg';

const iconBg =
  'p-2 rounded-lg bg-white/20 flex items-center justify-center shadow-sm transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110';

const iconStyles = {
  users: 'text-blue-800',
  dollar: 'text-green-400',
  activity: 'text-orange-600',
  building: 'text-green-400',
};

const COLORS = ['#0073FF', '#5926F1', '#F472B6', '#F8BA1C', '#0CD98E'];



interface TooltipPayload {
  payload: {
    name?: string;
    title?: string;
    value: number;
  };
}

const CustomTooltip = ({ active, payload, coordinate }: { active?: boolean; payload?: TooltipPayload[]; coordinate?: { x: number; y: number } }) => {
  if (active && payload && payload.length && coordinate) {
    const entry = payload[0].payload;
    // Use absolute positioning relative to the card
    const style = {
      position: 'absolute' as const,
      left: coordinate.x + 8,
      top: coordinate.y - 20,
      minWidth: 140,
      maxWidth: 200,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      pointerEvents: 'none' as const,
      zIndex: 999999,
    };
    return (
      <div
        className={'backdrop-blur-md border border-blue-200/30 text-white text-sm rounded-md px-6 py-2 shadow-lg text-center'}
        style={{
          ...style,
          background: 'color-mix(in oklab, var(--color-blue-900) 60%, transparent)',
        }}
      >
        <div className="font-bold whitespace-nowrap overflow-hidden text-ellipsis">{(entry.name || entry.title) as string}</div>
        <div className="whitespace-nowrap">Count: <span className="font-semibold">{entry.value}</span></div>
      </div>
    );
  }
  return null;
};

const StatsCards: React.FC = () => {
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tooltip state for active employees bar
  const [barTooltip, setBarTooltip] = useState<{ visible: boolean; x: number; y: number }>({ visible: false, x: 0, y: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await employeeApi.getStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics');
        // Keep using mock data as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const { totalEmployees, departments, topLocation, averageSalary, activeEmployees, jobTitleTrends, locations } = stats;
  const activePercent = activeEmployees && activeEmployees.total > 0 ? Math.round((activeEmployees.active / activeEmployees.total) * 100) : 0;
  const topJob = jobTitleTrends && jobTitleTrends.length > 0 ? jobTitleTrends.reduce((a, b) => (a.value > b.value ? a : b), jobTitleTrends[0]) : { title: 'N/A', value: 0 };

  // Show only top 8 locations, group the rest as 'Other' if needed
  const MAX_LOCATIONS = 8;
  let pieLocations = locations || [];
  if (locations && locations.length > MAX_LOCATIONS) {
    // Sort by value descending
    const sorted = [...locations].sort((a, b) => b.value - a.value);
    const topLocations = sorted.slice(0, MAX_LOCATIONS);
    const otherCount = sorted.slice(MAX_LOCATIONS).reduce((sum, loc) => sum + loc.value, 0);
    pieLocations = otherCount > 0
      ? [...topLocations, { name: 'Other', value: otherCount }]
      : topLocations;
  }

  if (loading) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="relative z-0 rounded-xl shadow-lg px-4 py-3 flex flex-row items-center justify-between bg-gradient-to-br from-blue-400/80 via-blue-600/60 to-blue-800/30 backdrop-blur-xl border border-blue-200/40 min-h-[110px] max-h-[110px] min-w-[260px] overflow-hidden">
            <div className="flex flex-col gap-1 relative z-10">
              <div className="h-4 bg-white/20 rounded animate-pulse"></div>
              <div className="h-8 bg-white/30 rounded animate-pulse"></div>
            </div>
            <div className="p-2 rounded-lg bg-white/20 w-12 h-12 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-8">
        <div className="text-red-400 text-sm mb-2">{error}</div>
        <div className="text-blue-200 text-xs">Using sample data</div>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Employees */}
      <div className={glassyCard}>
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-xl overflow-hidden pointer-events-none"></div>
        <div className="flex flex-col gap-1 relative z-10">
          <span className="text-base font-semibold text-white/90">Total Employees</span>
          <span className="text-2xl font-extrabold text-white">{totalEmployees || 0}</span>
        </div>
        <div className={iconBg}><Users className={`w-8 h-8 ${iconStyles.users}`} /></div>
      </div>

      {/* Departments */}
      <div className={glassyCard}>
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-xl overflow-hidden pointer-events-none"></div>
        <div className="flex flex-col gap-1 relative z-10">
          <span className="text-base font-semibold text-white/90">Departments</span>
          <span className="text-2xl font-extrabold text-white">{departments || 0}</span>
        </div>
        <div className={iconBg}><Building2 className={`w-8 h-8 ${iconStyles.building}`} /></div>
      </div>

      {/* Top Location (pie chart replaces icon+container) */}
      <div className={glassyCardNoOverflow}>
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-xl overflow-hidden pointer-events-none"></div>
        <div className="flex flex-col gap-1 relative z-10">
          <span className="text-base font-semibold text-white/90">Top Location</span>
          <span className="text-lg font-bold text-white">{topLocation?.name || 'N/A'} <span className="text-blue-200 font-normal">({topLocation?.count || 0})</span></span>
          <span className="text-base font-bold text-white mt-1">{topLocation?.percent || 0}%</span>
        </div>
        <div style={{ width: 84, height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieLocations}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={40}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                stroke="none"
              >
                {pieLocations.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} cursor={false} position={undefined} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Average Salary */}
      <div className={glassyCard}>
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-xl overflow-hidden pointer-events-none"></div>
        <div className="flex flex-col gap-1 relative z-10">
          <span className="text-base font-semibold text-white/90 mt-1">Average Salary</span>
          <span className="text-2xl font-extrabold text-white">
            {averageSalary != null && averageSalary > 0 ? `$${averageSalary.toLocaleString()}` : 'N/A'}
          </span>
          <span className="text-xs text-blue-100/80 mt-1">per year</span>
        </div>
        <div className={iconBg}><DollarSign className={`w-8 h-8 ${iconStyles.dollar}`} /></div>
      </div>

      {/* Active Employees */}
      <div className={glassyCard + ' flex justify-between items-center overflow-visible'}>
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-xl overflow-hidden pointer-events-none"></div>
        <div className="flex flex-col gap-1 w-full pr-4 relative z-10">
          <span className="text-base font-semibold text-white/90">Active Employees</span>
          <span className="text-2xl font-extrabold text-white">{activeEmployees?.active || 0}</span>
          <div className="relative w-full mt-2">
            <div
              className="w-full bg-blue-100/20 rounded-full h-2 group"
              onMouseMove={e => {
                setBarTooltip({
                  visible: true,
                  x: e.clientX + 12,
                  y: e.clientY - 40,
                });
              }}
              onMouseLeave={() => setBarTooltip({ ...barTooltip, visible: false })}
            >
              <div
                className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${activePercent}%` }}
              />
            </div>
          </div>
        </div>
        <div className={iconBg}><Activity className={`w-8 h-8 ${iconStyles.activity}`} /></div>
      </div>

      {/* Job Title Trends (pie chart replaces icon+container) */}
      <div className={glassyCardNoOverflow}>
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-xl overflow-hidden pointer-events-none"></div>
        <div className="flex flex-col gap-1 relative z-10">
          <span className="text-base font-semibold text-white/90">Top Job Title</span>
          <span className="text-lg font-bold text-white">{topJob.title || 'N/A'} <span className="text-blue-200 font-normal">({topJob.value || 0})</span></span>
          <span className="text-xs text-blue-100/80 mt-1">see breakdown</span>
        </div>
        <div style={{ width: 84, height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={jobTitleTrends}
                dataKey="value"
                nameKey="title"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={40}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                stroke="none"
              >
                {jobTitleTrends.map((entry, idx) => (
                  <Cell key={`cell-job-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} cursor={false} position={undefined} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tooltip rendered at root level to avoid stacking context issues */}
      {barTooltip.visible && (
        <div
          style={{
            position: 'fixed',
            left: barTooltip.x,
            top: barTooltip.y,
            zIndex: 9999,
            minWidth: 180,
            maxWidth: 240,
            pointerEvents: 'none',
            background: 'color-mix(in oklab, var(--color-blue-900) 60%, transparent)',
          }}
          className={'backdrop-blur-md border border-blue-200/30 text-white text-sm rounded-md px-6 py-2 shadow-lg text-center'}
        >
          {`${activeEmployees?.active || 0} / ${activeEmployees?.total || 0} active employees`}
        </div>
      )}
    </div>
  );
};

export default StatsCards; 
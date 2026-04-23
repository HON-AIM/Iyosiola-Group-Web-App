import { useEffect, useState } from 'react';
import { statsAPI } from '../services/api';

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalClients: 0,
    leadsToday: 0,
    unassignedLeads: 0,
    totalAssignedLeads: 0,
    assignedClients: 0,
    activeClients: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsAPI.get();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      label: 'Total Leads',
      value: stats.totalLeads,
      icon: '📋',
      gradient: 'from-blue-500 to-blue-700'
    },
    {
      label: 'Active Clients',
      value: stats.activeClients,
      icon: '👥',
      gradient: 'from-emerald-500 to-emerald-700'
    },
    {
      label: 'Total Assigned',
      value: stats.totalAssignedLeads,
      icon: '✅',
      gradient: 'from-violet-500 to-violet-700'
    },
    {
      label: 'Leads Today',
      value: stats.leadsToday,
      icon: '📈',
      gradient: 'from-amber-500 to-amber-700'
    },
    {
      label: 'Unassigned',
      value: stats.unassignedLeads,
      icon: '⚠️',
      gradient: 'from-rose-500 to-rose-700'
    },
    {
      label: 'With Leads',
      value: stats.assignedClients,
      icon: '🎯',
      gradient: 'from-cyan-500 to-cyan-700'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-24 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div key={card.label} className="card hover:shadow-xl transition-shadow duration-300">
          <div className={`p-6 rounded-xl bg-gradient-to-br ${card.gradient} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">{card.label}</p>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                {card.icon}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

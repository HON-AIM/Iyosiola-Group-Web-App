import { useEffect, useState } from 'react';
import { activitiesAPI } from '../services/api';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await activitiesAPI.getAll();
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStyles = (type) => {
    switch (type) {
      case 'lead_received': 
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: '📋', label: 'Lead Received' };
      case 'lead_assigned': 
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '✅', label: 'Lead Assigned' };
      case 'client_created': 
        return { bg: 'bg-violet-100', text: 'text-violet-700', icon: '👤', label: 'Client Created' };
      case 'client_updated': 
        return { bg: 'bg-amber-100', text: 'text-amber-700', icon: '✏️', label: 'Client Updated' };
      case 'client_deleted': 
        return { bg: 'bg-rose-100', text: 'text-rose-700', icon: '🗑️', label: 'Client Deleted' };
      case 'lead_cap_reset': 
        return { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: '🔄', label: 'Lead Cap Reset' };
      case 'lead_deleted': 
        return { bg: 'bg-red-100', text: 'text-red-700', icon: '❌', label: 'Lead Deleted' };
      default: 
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '📌', label: 'Activity' };
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now - then) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <span className="px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-medium rounded-full">
            Live
          </span>
        </div>
      </div>
      <div className="space-y-0 max-h-[400px] overflow-y-auto">
        {activities.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
              📭
            </div>
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const styles = getStyles(activity.type);
            return (
              <div 
                key={activity._id} 
                className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
              >
                <div className={`w-10 h-10 ${styles.bg} ${styles.text} rounded-full flex items-center justify-center text-lg flex-shrink-0`}>
                  {styles.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 ${styles.bg} ${styles.text} rounded-full`}>
                      {styles.label}
                    </span>
                    <span className="text-xs text-gray-400">{getTimeAgo(activity.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;

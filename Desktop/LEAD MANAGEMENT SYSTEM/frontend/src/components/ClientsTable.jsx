import { useEffect, useState } from 'react';
import { clientsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ClientsTable = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await clientsAPI.getAll();
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
    const interval = setInterval(fetchClients, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status, remaining) => {
    const styles = {
      active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'ACTIVE' },
      full: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'FULL' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'INACTIVE' }
    };
    const style = status === 'full' || remaining === 0 
      ? styles.full 
      : styles[status] || styles.inactive;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const getProgressBar = (received, cap) => {
    const percentage = cap > 0 ? (received / cap) * 100 : 0;
    const color = percentage >= 100 ? 'bg-rose-500' : percentage >= 80 ? 'bg-amber-500' : 'bg-emerald-500';
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
        <div className={`h-2 rounded-full ${color} transition-all duration-500`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Active Clients</h2>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-xl"></div>
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm">
              👥
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Active Clients</h2>
          </div>
          <button
            onClick={() => navigate('/clients')}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View All →
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-50">
        {clients.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
              📭
            </div>
            <p className="text-gray-500">No clients yet</p>
            <button 
              onClick={() => navigate('/clients')}
              className="mt-3 text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Add your first client →
            </button>
          </div>
        ) : (
          clients.slice(0, 5).map((client) => {
            const remaining = Math.max(0, client.leadCap - client.leadsReceived);
            return (
              <div key={client._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{client.name}</p>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {client.state}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{client.email}</p>
                  </div>
                  <div className="text-right ml-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-900">{client.leadsReceived}</span>
                      <span className="text-xs text-gray-400">/ {client.leadCap}</span>
                    </div>
                    {getProgressBar(client.leadsReceived, client.leadCap)}
                  </div>
                  <div className="ml-3">
                    {getStatusBadge(client.status, remaining)}
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

export default ClientsTable;

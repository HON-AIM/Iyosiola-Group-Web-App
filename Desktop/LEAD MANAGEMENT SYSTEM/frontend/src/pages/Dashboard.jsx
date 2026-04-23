import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatsCards from '../components/StatsCards';
import ClientsTable from '../components/ClientsTable';
import ActivityFeed from '../components/ActivityFeed';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-8">
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg shadow-purple-200">
                📊
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Overview of your lead distribution system</p>
              </div>
            </div>
          </div>

          <StatsCards />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ClientsTable />
            <ActivityFeed />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

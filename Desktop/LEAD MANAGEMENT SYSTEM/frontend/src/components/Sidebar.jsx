import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', color: 'from-violet-500 to-purple-600' },
    { path: '/clients', label: 'Clients', icon: '👥', color: 'from-emerald-500 to-teal-600' },
    { path: '/leads', label: 'Leads', icon: '📋', color: 'from-amber-500 to-orange-600' },
    { path: '/add-lead', label: 'Add Lead', icon: '➕', color: 'from-cyan-500 to-blue-600' },
    { path: '/settings', label: 'Settings', icon: '⚙️', color: 'from-rose-500 to-pink-600' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 min-h-screen shadow-xl">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-purple-200">
            📊
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              LeadDistribute
            </h1>
            <p className="text-xs text-gray-400">v2.0</p>
          </div>
        </div>
      </div>
      <nav className="mt-4 px-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all duration-200 ${
              location.pathname === item.path 
                ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                : 'text-gray-600 hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className={`font-semibold ${location.pathname === item.path ? 'text-white' : 'text-gray-700'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl">
          <p className="text-xs text-gray-500 font-medium">Need help?</p>
          <p className="text-sm text-violet-700 font-semibold mt-1">Contact support</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

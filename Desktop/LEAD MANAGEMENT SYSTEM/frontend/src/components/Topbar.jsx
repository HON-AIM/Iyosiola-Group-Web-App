import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="search"
              placeholder="Search leads, clients..."
              className="w-full pl-12 pr-4 py-3 bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-transparent rounded-xl focus:border-violet-300 focus:ring-4 focus:ring-violet-100 outline-none transition-all duration-200"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 ml-8">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
              <span className="text-white font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{user?.username}</p>
              <p className="text-xs text-violet-600 font-medium">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 text-white font-medium rounded-xl hover:from-rose-600 hover:to-red-600 transition-all duration-200 shadow-lg shadow-red-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

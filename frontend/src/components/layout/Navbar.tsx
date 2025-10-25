import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store.ts';
import { Button } from '@/components/ui/button.tsx';
import { NotificationsDropdown } from '@/features/social/components/NotificationsDropdown.tsx';
import { LogOut, Menu, Activity, User } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PromptForge
              </span>
            </Link>

              {/* Desktop Navigation - Social First */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/feed"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Feed
                </Link>
                <Link
                  to="/prompts"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Explore
                </Link>
                <Link
                  to="/prompts/create"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Create
                </Link>
                <Link
                  to="/ai-lab"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  AI Lab
                </Link>
                <Link
                  to="/marketplace"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Marketplace
                </Link>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/feed')}
                className="flex items-center space-x-1"
                title="Activity Feed"
              >
                <Activity className="h-5 w-5" />
              </Button>
              <NotificationsDropdown />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/profile/${user?.id}`)}
                className="flex items-center space-x-1"
                title="My Profile"
              >
                <User className="h-5 w-5" />
              </Button>
              <span className="text-sm text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

          {/* Mobile menu - Social First */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-3 pt-2 space-y-1">
            <Link
              to="/dashboard"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/feed"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              Activity Feed
            </Link>
            <Link
              to="/prompts"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              Explore Prompts
            </Link>
            <Link
              to="/prompts/create"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              Create Prompt
            </Link>
            <Link
              to={`/profile/${user?.id}`}
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              My Profile
            </Link>
            <Link
              to="/ai-lab"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              AI Testing Lab
            </Link>
            <Link
              to="/marketplace"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              Marketplace
            </Link>
            <div className="px-3 py-2 border-t mt-2">
              <p className="text-sm text-gray-700 mb-2">
                {user?.firstName} {user?.lastName}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};


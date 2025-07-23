import React, { ReactNode } from 'react';
import { useQuery } from 'react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';
import {
  HomeIcon,
  DocumentTextIcon,
  DocumentIcon,
  PhotoIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: '儀表板', href: '/dashboard', icon: HomeIcon },
  { name: '文章管理', href: '/posts', icon: DocumentTextIcon },
  { name: '頁面管理', href: '/pages', icon: DocumentIcon },
  { name: '媒體管理', href: '/media', icon: PhotoIcon },
  { name: '網站設定', href: '/settings', icon: CogIcon },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { data: userInfo } = useQuery(
    'currentUser',
    authService.getCurrentUser,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">
              Tony 的管理後台
            </h1>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = isCurrentPath(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={
                      isActive
                        ? 'sidebar-link-active'
                        : 'sidebar-link-inactive'
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User info and logout */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                {userInfo?.data?.user?.avatar_url ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={userInfo.data.user.avatar_url}
                    alt={userInfo.data.user.name || userInfo.data.user.login}
                  />
                ) : (
                  <UserIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userInfo?.data?.user?.name || userInfo?.data?.user?.login}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userInfo?.data?.user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title="登出"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
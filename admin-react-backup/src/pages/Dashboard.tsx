import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { apiRequest } from '@/services/api';
import { SiteStats } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  DocumentTextIcon,
  DocumentIcon,
  PhotoIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { data: statsData, isLoading, error } = useQuery(
    'siteStats',
    () => apiRequest<SiteStats>('GET', '/settings/stats')
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !statsData?.data) {
    return (
      <div className="text-center text-red-600">
        <p>無法載入統計資料</p>
      </div>
    );
  }

  const stats = statsData.data;

  const quickStats = [
    {
      name: '總文章數',
      value: stats.posts.total,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      href: '/posts',
    },
    {
      name: '總頁面數',
      value: stats.pages.total,
      icon: DocumentIcon,
      color: 'bg-green-500',
      href: '/pages',
    },
    {
      name: '儲存庫大小',
      value: `${Math.round(stats.repository.size / 1024)} KB`,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'GitHub 星星',
      value: stats.repository.stargazers_count,
      icon: ChartBarIcon,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">儀表板</h1>
        <p className="mt-1 text-sm text-gray-500">
          歡迎來到您的部落格管理後台
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-md ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
              {stat.href && (
                <div className="ml-5 flex-shrink-0">
                  <Link
                    to={stat.href}
                    className="text-sm text-primary-600 hover:text-primary-900"
                  >
                    查看
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">文章分類分布</h3>
          {Object.keys(stats.posts.categories).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.posts.categories)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{category}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {count} 篇
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">尚未有文章分類</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">最近活動</h3>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.sha} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-primary-500 rounded-full mt-2"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900 truncate">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.author} • {new Date(activity.date).toLocaleDateString('zh-TW')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">尚無活動記錄</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">快速操作</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/posts/new"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-400" />
            新增文章
          </Link>
          <Link
            to="/media"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <PhotoIcon className="h-5 w-5 mr-2 text-gray-400" />
            上傳媒體
          </Link>
          <Link
            to="/settings"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <DocumentIcon className="h-5 w-5 mr-2 text-gray-400" />
            網站設定
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
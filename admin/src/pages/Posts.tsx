import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { postsService } from '@/services/posts';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';

const Posts: React.FC = () => {
  const { data: postsData, isLoading, error } = useQuery(
    'posts',
    postsService.getAllPosts
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !postsData?.data) {
    return (
      <div className="text-center text-red-600">
        <p>無法載入文章列表</p>
      </div>
    );
  }

  const posts = postsData.data;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理您的部落格文章
          </p>
        </div>
        <Link
          to="/posts/new"
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          新增文章
        </Link>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">尚未有文章</h3>
          <p className="mt-1 text-sm text-gray-500">
            開始撰寫您的第一篇文章吧！
          </p>
          <div className="mt-6">
            <Link
              to="/posts/new"
              className="btn-primary"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              新增文章
            </Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    標題
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分類
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.filename} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                        {post.excerpt && (
                          <div className="text-sm text-gray-500 truncate max-w-md">
                            {post.excerpt}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString('zh-TW')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {post.categories.map((category) => (
                          <span
                            key={category}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/posts/edit/${post.filename}`}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        編輯
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { authService } from '@/services/auth';
import Layout from '@/components/layout/Layout';
import Login from '@/components/auth/Login';
import Dashboard from '@/pages/Dashboard';
import Posts from '@/pages/Posts';
import PostEditor from '@/pages/PostEditor';
import Pages from '@/pages/Pages';
import PageEditor from '@/pages/PageEditor';
import Media from '@/pages/Media';
import Settings from '@/pages/Settings';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function App() {
  const { data: authStatus, isLoading, error } = useQuery(
    'authStatus',
    authService.checkAuthStatus,
    {
      retry: false,
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !authStatus?.data?.authenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/new" element={<PostEditor />} />
        <Route path="/posts/edit/:filename" element={<PostEditor />} />
        <Route path="/pages" element={<Pages />} />
        <Route path="/pages/edit/:filename" element={<PageEditor />} />
        <Route path="/media" element={<Media />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
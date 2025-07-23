import React from 'react';

const PostEditor: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">文章編輯器</h1>
        <p className="mt-1 text-sm text-gray-500">
          建立或編輯文章
        </p>
      </div>
      
      <div className="card">
        <p className="text-center text-gray-500">
          文章編輯器將在後續版本中實現
        </p>
      </div>
    </div>
  );
};

export default PostEditor;
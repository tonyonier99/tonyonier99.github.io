import { apiRequest } from './api';
import { Post, PostDetail, PostFrontMatter } from '@/types';

export const postsService = {
  // Get all posts
  getAllPosts: async () => {
    return apiRequest<Post[]>('GET', '/posts');
  },

  // Get a specific post
  getPost: async (filename: string) => {
    return apiRequest<PostDetail>('GET', `/posts/${filename}`);
  },

  // Create a new post
  createPost: async (data: {
    title: string;
    content: string;
    frontMatter?: Partial<PostFrontMatter>;
  }) => {
    return apiRequest('POST', '/posts', data);
  },

  // Update an existing post
  updatePost: async (filename: string, data: {
    title: string;
    content: string;
    frontMatter?: Partial<PostFrontMatter>;
  }) => {
    return apiRequest('PUT', `/posts/${filename}`, data);
  },

  // Delete a post
  deletePost: async (filename: string) => {
    return apiRequest('DELETE', `/posts/${filename}`);
  },
};
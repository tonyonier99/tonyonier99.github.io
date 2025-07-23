export interface User {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface Post {
  filename: string;
  path: string;
  sha: string;
  title: string;
  date: string;
  categories: string[];
  excerpt: string;
  layout: string;
}

export interface PostDetail extends Post {
  frontMatter: PostFrontMatter;
  body: string;
  content: string;
}

export interface PostFrontMatter {
  layout: string;
  title: string;
  date: string;
  categories: string[];
  excerpt: string;
  [key: string]: any;
}

export interface Page {
  filename: string;
  path: string;
  sha: string;
  title: string;
  layout: string;
  size: number;
}

export interface PageDetail extends Page {
  frontMatter: PageFrontMatter;
  body: string;
  content: string;
}

export interface PageFrontMatter {
  layout?: string;
  title?: string;
  [key: string]: any;
}

export interface MediaFile {
  filename: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  type: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  baseurl: string;
  url: string;
  author: {
    name: string;
    email: string;
  };
  social_links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  header_pages: string[];
  [key: string]: any;
}

export interface SiteStats {
  posts: {
    total: number;
    categories: Record<string, number>;
  };
  pages: {
    total: number;
  };
  repository: {
    size: number;
    language: string;
    created_at: string;
    updated_at: string;
    stargazers_count: number;
    forks_count: number;
  };
  recentActivity: Array<{
    sha: string;
    message: string;
    author: string;
    date: string;
    url: string;
  }>;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthStatus {
  authenticated: boolean;
  user: User | null;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
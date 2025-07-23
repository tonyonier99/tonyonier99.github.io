const axios = require('axios');

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.owner = process.env.GITHUB_OWNER || 'tonyonier99';
    this.repo = process.env.GITHUB_REPO || 'tonyonier99.github.io';
    this.token = process.env.GITHUB_TOKEN;
    
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    });
  }

  // Get file content from repository
  async getFile(path) {
    try {
      const response = await this.api.get(`/repos/${this.owner}/${this.repo}/contents/${path}`);
      return {
        content: Buffer.from(response.data.content, 'base64').toString('utf-8'),
        sha: response.data.sha,
        path: response.data.path
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // Create or update file in repository
  async createOrUpdateFile(path, content, message, sha = null, isBinary = false) {
    try {
      const data = {
        message,
        content: isBinary ? content : Buffer.from(content, 'utf-8').toString('base64'),
        branch: 'main'
      };
      
      if (sha) {
        data.sha = sha;
      }

      const response = await this.api.put(`/repos/${this.owner}/${this.repo}/contents/${path}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete file from repository
  async deleteFile(path, message, sha) {
    try {
      const response = await this.api.delete(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
        data: {
          message,
          sha,
          branch: 'main'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // List files in a directory
  async listFiles(path = '') {
    try {
      const response = await this.api.get(`/repos/${this.owner}/${this.repo}/contents/${path}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get repository information
  async getRepoInfo() {
    try {
      const response = await this.api.get(`/repos/${this.owner}/${this.repo}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get commits for a file
  async getFileCommits(path, page = 1, perPage = 10) {
    try {
      const response = await this.api.get(`/repos/${this.owner}/${this.repo}/commits`, {
        params: {
          path,
          page,
          per_page: perPage
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get repository statistics
  async getRepoStats() {
    try {
      const [repoInfo, commits] = await Promise.all([
        this.getRepoInfo(),
        this.api.get(`/repos/${this.owner}/${this.repo}/commits?per_page=1`)
      ]);

      return {
        size: repoInfo.size,
        language: repoInfo.language,
        created_at: repoInfo.created_at,
        updated_at: repoInfo.updated_at,
        stargazers_count: repoInfo.stargazers_count,
        forks_count: repoInfo.forks_count,
        open_issues_count: repoInfo.open_issues_count
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GitHubService;
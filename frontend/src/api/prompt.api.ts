import { promptServiceClient } from './client.ts';
import type { Prompt, CreatePromptRequest, UpdatePromptRequest, PromptFilters, PaginatedPromptsResponse } from '@/types/prompt.types.ts';

export const promptApi = {
  /**
   * Get all public prompts with filters and pagination
   */
  getPrompts: async (filters: PromptFilters = {}): Promise<PaginatedPromptsResponse> => {
    const params: any = {
      page: filters.page || 0,
      size: filters.size || 20,
      sortBy: 'createdAt',
      sortDir: 'DESC',
    };

    // Map frontend sortBy to backend sortBy
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          params.sortBy = 'createdAt';
          params.sortDir = 'DESC';
          break;
        case 'popular':
          params.sortBy = 'viewsCount';
          params.sortDir = 'DESC';
          break;
        case 'top-rated':
          params.sortBy = 'averageRating';
          params.sortDir = 'DESC';
          break;
        case 'most-used':
          params.sortBy = 'usageCount';
          params.sortDir = 'DESC';
          break;
      }
    }

    let url = '/prompts/public';
    
    // Use search endpoint if search query is provided
    if (filters.search) {
      url = '/prompts/search';
      params.keyword = filters.search;
      params.isPublic = true;
    }
    // Use category endpoint if category is specified
    else if (filters.category) {
      url = `/prompts/category/${filters.category}`;
    }
    // Use tag endpoint if tags are specified
    else if (filters.tags && filters.tags.length > 0) {
      url = `/prompts/tag/${filters.tags[0]}`; // Use first tag
    }

    const response = await promptServiceClient.get(url, { params });
    return response.data;
  },

  /**
   * Get single prompt by ID
   */
  getPromptById: async (id: string): Promise<Prompt> => {
    const response = await promptServiceClient.get<Prompt>(`/prompts/${id}`);
    return response.data;
  },

  /**
   * Get current user's prompts
   */
  getMyPrompts: async (page = 0, size = 20): Promise<PaginatedPromptsResponse> => {
    const response = await promptServiceClient.get<PaginatedPromptsResponse>('/prompts/my-prompts', {
      params: { page, size, sortBy: 'createdAt', sortDir: 'DESC' },
    });
    return response.data;
  },

  /**
   * Create new prompt
   */
  createPrompt: async (data: CreatePromptRequest): Promise<Prompt> => {
    // Map frontend data to backend format
    const backendData = {
      title: data.title,
      description: data.description,
      content: data.content,
      category: data.category,
      tags: data.tags || [],
      isPublic: data.visibility === 'PUBLIC', // Map visibility to isPublic
      // Backend doesn't have status field - prompts are created as published if public
    };
    
    const response = await promptServiceClient.post<Prompt>('/prompts', backendData);
    return response.data;
  },

  /**
   * Update existing prompt
   */
  updatePrompt: async (id: string, data: UpdatePromptRequest): Promise<Prompt> => {
    const response = await promptServiceClient.put<Prompt>(`/prompts/${id}`, data);
    return response.data;
  },

  /**
   * Delete prompt
   */
  deletePrompt: async (id: string): Promise<void> => {
    await promptServiceClient.delete(`/prompts/${id}`);
  },

  /**
   * Get trending prompts (most viewed)
   */
  getTrendingPrompts: async (page = 0, size = 20): Promise<PaginatedPromptsResponse> => {
    const response = await promptServiceClient.get<PaginatedPromptsResponse>('/prompts/trending', {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Toggle like on prompt
   */
  toggleLike: async (id: string): Promise<void> => {
    await promptServiceClient.post(`/api/social/likes`, { promptId: id });
  },
};


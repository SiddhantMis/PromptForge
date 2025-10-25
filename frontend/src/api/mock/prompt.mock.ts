import type { Prompt, CreatePromptRequest, PromptFilters, PaginatedPromptsResponse } from '@/types/prompt.types.ts';
import type { Category } from '@/types/category.types.ts';

// Mock categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Creative Writing', description: 'Story, poetry, creative content', icon: '✍️', promptCount: 24 },
  { id: '2', name: 'Code Generation', description: 'Programming and code assistance', icon: '💻', promptCount: 18 },
  { id: '3', name: 'Business', description: 'Business plans, emails, proposals', icon: '💼', promptCount: 15 },
  { id: '4', name: 'Marketing', description: 'Ad copy, social media, SEO', icon: '📈', promptCount: 20 },
  { id: '5', name: 'Education', description: 'Learning, teaching, explanations', icon: '🎓', promptCount: 12 },
  { id: '6', name: 'Data Analysis', description: 'Data interpretation, insights', icon: '📊', promptCount: 9 },
  { id: '7', name: 'Translation', description: 'Language translation and localization', icon: '🌍', promptCount: 8 },
  { id: '8', name: 'Productivity', description: 'Task management, summaries', icon: '⚡', promptCount: 16 },
];

// Mock prompts
export const mockPrompts: Prompt[] = [
  {
    id: '1',
    title: 'Professional Email Writer',
    description: 'Generate professional business emails for any situation with the perfect tone and structure',
    content: 'You are a professional email writer. Write a {tone} email about {topic} to {recipient}. Keep it concise, professional, and action-oriented. Include a clear subject line.',
    category: 'Business',
    tags: ['email', 'business', 'communication'],
    authorId: '1',
    authorUsername: 'john_writer',
    authorName: 'John Smith',
    visibility: 'PUBLIC',
    status: 'PUBLISHED',
    likesCount: 234,
    viewsCount: 1523,
    usageCount: 892,
    averageRating: 4.8,
    ratingsCount: 156,
    isPremium: false,
    userHasLiked: false,
    userHasSaved: false,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-20T14:22:00Z',
  },
  {
    id: '2',
    title: 'Creative Story Generator',
    description: 'Create engaging short stories with vivid descriptions and compelling characters',
    content: 'Write a {genre} short story about {theme}. Include vivid descriptions, dialogue, and a satisfying conclusion. Length: approximately {word_count} words.',
    category: 'Creative Writing',
    tags: ['story', 'creative', 'fiction'],
    authorId: '2',
    authorUsername: 'creative_mind',
    authorName: 'Sarah Johnson',
    visibility: 'PUBLIC',
    status: 'PUBLISHED',
    likesCount: 445,
    viewsCount: 2301,
    usageCount: 1234,
    averageRating: 4.9,
    ratingsCount: 289,
    isPremium: true,
    price: 4.99,
    userHasLiked: true,
    userHasSaved: true,
    createdAt: '2025-01-10T08:15:00Z',
    updatedAt: '2025-01-18T16:45:00Z',
  },
  {
    id: '3',
    title: 'Python Code Debugger',
    description: 'Debug Python code and explain errors in simple terms with solutions',
    content: 'You are an expert Python developer. Analyze this code: {code}. Identify bugs, explain errors in simple terms, and provide corrected code with comments explaining the fixes.',
    category: 'Code Generation',
    tags: ['python', 'debugging', 'programming'],
    authorId: '3',
    authorUsername: 'code_ninja',
    authorName: 'Alex Chen',
    visibility: 'PUBLIC',
    status: 'PUBLISHED',
    likesCount: 678,
    viewsCount: 3456,
    usageCount: 2145,
    averageRating: 4.7,
    ratingsCount: 412,
    isPremium: false,
    userHasLiked: false,
    userHasSaved: false,
    createdAt: '2025-01-05T12:00:00Z',
    updatedAt: '2025-01-22T09:30:00Z',
  },
  {
    id: '4',
    title: 'Social Media Caption Creator',
    description: 'Generate engaging social media captions with relevant hashtags and emojis',
    content: 'Create an engaging {platform} caption for {topic}. Include relevant hashtags, emojis, and a call-to-action. Tone: {tone}. Length: optimal for {platform}.',
    category: 'Marketing',
    tags: ['social-media', 'marketing', 'content'],
    authorId: '1',
    authorUsername: 'john_writer',
    authorName: 'John Smith',
    visibility: 'PUBLIC',
    status: 'PUBLISHED',
    likesCount: 523,
    viewsCount: 2876,
    usageCount: 1567,
    averageRating: 4.6,
    ratingsCount: 334,
    isPremium: false,
    userHasLiked: false,
    userHasSaved: true,
    createdAt: '2025-01-12T14:20:00Z',
    updatedAt: '2025-01-19T11:15:00Z',
  },
  {
    id: '5',
    title: 'Data Analysis Interpreter',
    description: 'Interpret complex data sets and provide actionable insights in plain language',
    content: 'Analyze this data: {data}. Provide key insights, trends, and actionable recommendations. Explain findings in simple, non-technical language suitable for business stakeholders.',
    category: 'Data Analysis',
    tags: ['data', 'analysis', 'insights'],
    authorId: '4',
    authorUsername: 'data_guru',
    authorName: 'Maria Garcia',
    visibility: 'PUBLIC',
    status: 'PUBLISHED',
    likesCount: 189,
    viewsCount: 945,
    usageCount: 456,
    averageRating: 4.8,
    ratingsCount: 89,
    isPremium: true,
    price: 6.99,
    userHasLiked: false,
    userHasSaved: false,
    createdAt: '2025-01-18T09:45:00Z',
    updatedAt: '2025-01-21T13:20:00Z',
  },
  {
    id: '6',
    title: 'Learning Concept Explainer',
    description: 'Explain complex concepts in simple, easy-to-understand terms with examples',
    content: 'Explain {concept} to a {audience_level}. Use simple language, analogies, and practical examples. Break down complex ideas into digestible parts. Include a summary at the end.',
    category: 'Education',
    tags: ['education', 'learning', 'explanation'],
    authorId: '2',
    authorUsername: 'creative_mind',
    authorName: 'Sarah Johnson',
    visibility: 'PUBLIC',
    status: 'PUBLISHED',
    likesCount: 356,
    viewsCount: 1789,
    usageCount: 987,
    averageRating: 4.9,
    ratingsCount: 201,
    isPremium: false,
    userHasLiked: true,
    userHasSaved: false,
    createdAt: '2025-01-08T16:30:00Z',
    updatedAt: '2025-01-16T10:05:00Z',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockPromptApi = {
  /**
   * Get prompts with filters
   */
  getPrompts: async (filters: PromptFilters): Promise<PaginatedPromptsResponse> => {
    await delay(500);

    let filteredPrompts = [...mockPrompts];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredPrompts = filteredPrompts.filter(
        p => p.title.toLowerCase().includes(searchLower) || 
             p.description.toLowerCase().includes(searchLower) ||
             p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filteredPrompts = filteredPrompts.filter(p => p.category === filters.category);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        filteredPrompts.sort((a, b) => b.likesCount - a.likesCount);
        break;
      case 'top-rated':
        filteredPrompts.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'most-used':
        filteredPrompts.sort((a, b) => b.usageCount - a.usageCount);
        break;
      case 'newest':
      default:
        filteredPrompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Apply pagination
    const page = filters.page || 0;
    const size = filters.size || 12;
    const start = page * size;
    const end = start + size;
    const paginatedPrompts = filteredPrompts.slice(start, end);

    return {
      content: paginatedPrompts,
      totalElements: filteredPrompts.length,
      totalPages: Math.ceil(filteredPrompts.length / size),
      currentPage: page,
      pageSize: size,
    };
  },

  /**
   * Get prompt by ID
   */
  getPromptById: async (id: string): Promise<Prompt> => {
    await delay(300);
    
    const prompt = mockPrompts.find(p => p.id === id);
    if (!prompt) {
      throw {
        message: 'Prompt not found',
        status: 404,
      };
    }
    
    return prompt;
  },

  /**
   * Get user's prompts
   */
  getMyPrompts: async (): Promise<Prompt[]> => {
    await delay(400);
    
    // Return prompts from current user (mock)
    const userStr = localStorage.getItem('user');
    if (!userStr) return [];
    
    const user = JSON.parse(userStr);
    return mockPrompts.filter(p => p.authorId === user.id);
  },

  /**
   * Create prompt
   */
  createPrompt: async (data: CreatePromptRequest): Promise<Prompt> => {
    await delay(600);
    
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw {
        message: 'Not authenticated',
        status: 401,
      };
    }
    
    const user = JSON.parse(userStr);
    
    const newPrompt: Prompt = {
      id: String(mockPrompts.length + 1),
      ...data,
      authorId: user.id,
      authorUsername: user.username,
      authorName: `${user.firstName} ${user.lastName}`,
      likesCount: 0,
      viewsCount: 0,
      usageCount: 0,
      averageRating: 0,
      ratingsCount: 0,
      isPremium: false,
      userHasLiked: false,
      userHasSaved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockPrompts.push(newPrompt);
    return newPrompt;
  },

  /**
   * Update prompt
   */
  updatePrompt: async (id: string, data: any): Promise<Prompt> => {
    await delay(600);
    
    const promptIndex = mockPrompts.findIndex(p => p.id === id);
    if (promptIndex === -1) {
      throw {
        message: 'Prompt not found',
        status: 404,
      };
    }
    
    mockPrompts[promptIndex] = {
      ...mockPrompts[promptIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    return mockPrompts[promptIndex];
  },

  /**
   * Delete prompt
   */
  deletePrompt: async (id: string): Promise<void> => {
    await delay(400);
    
    const promptIndex = mockPrompts.findIndex(p => p.id === id);
    if (promptIndex === -1) {
      throw {
        message: 'Prompt not found',
        status: 404,
      };
    }
    
    mockPrompts.splice(promptIndex, 1);
  },

  /**
   * Toggle like
   */
  toggleLike: async (id: string): Promise<void> => {
    await delay(300);
    
    const prompt = mockPrompts.find(p => p.id === id);
    if (!prompt) {
      throw {
        message: 'Prompt not found',
        status: 404,
      };
    }
    
    if (prompt.userHasLiked) {
      prompt.likesCount--;
      prompt.userHasLiked = false;
    } else {
      prompt.likesCount++;
      prompt.userHasLiked = true;
    }
  },
};

export const mockCategoryApi = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    await delay(300);
    return mockCategories;
  },
};


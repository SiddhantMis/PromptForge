export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  authorUsername: string;
  authorName: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  likesCount: number;
  viewsCount: number;
  usageCount: number;
  averageRating: number;
  ratingsCount: number;
  isPremium: boolean;
  price?: number;
  userHasLiked?: boolean;
  userHasSaved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromptRequest {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  status: 'DRAFT' | 'PUBLISHED';
}

export interface UpdatePromptRequest extends Partial<CreatePromptRequest> {
  id: string;
}

export interface PromptFilters {
  search?: string;
  category?: string;
  tags?: string[];
  sortBy?: 'newest' | 'popular' | 'top-rated' | 'most-used';
  page?: number;
  size?: number;
}

export interface PaginatedPromptsResponse {
  content: Prompt[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}


import type { Category } from '@/types/category.types.ts';

// Predefined categories since backend doesn't have a categories endpoint
const CATEGORIES: Category[] = [
  { id: '1', name: 'General', icon: '💬', description: 'General purpose prompts' },
  { id: '2', name: 'Writing', icon: '✍️', description: 'Content creation and writing' },
  { id: '3', name: 'Coding', icon: '💻', description: 'Programming and development' },
  { id: '4', name: 'Marketing', icon: '📢', description: 'Marketing and advertising' },
  { id: '5', name: 'Business', icon: '💼', description: 'Business and productivity' },
  { id: '6', name: 'Education', icon: '📚', description: 'Learning and teaching' },
  { id: '7', name: 'Creative', icon: '🎨', description: 'Creative and artistic' },
  { id: '8', name: 'Data Analysis', icon: '📊', description: 'Data and analytics' },
  { id: '9', name: 'Research', icon: '🔬', description: 'Research and academic' },
  { id: '10', name: 'Customer Support', icon: '🎧', description: 'Customer service and support' },
  { id: '11', name: 'Social Media', icon: '📱', description: 'Social media content' },
  { id: '12', name: 'Translation', icon: '🌐', description: 'Language translation' },
  { id: '13', name: 'Email', icon: '📧', description: 'Email communication' },
  { id: '14', name: 'SEO', icon: '🔍', description: 'Search engine optimization' },
  { id: '15', name: 'Gaming', icon: '🎮', description: 'Gaming and entertainment' },
];

export const categoryApi = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    // Return predefined categories
    return Promise.resolve(CATEGORIES);
  },
};


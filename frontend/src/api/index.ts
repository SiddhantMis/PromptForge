import { authApi } from './auth.api.ts';
import { mockAuthApi } from './mock/auth.mock.ts';
import { promptApi } from './prompt.api.ts';
import { categoryApi } from './category.api.ts';
import { mockPromptApi, mockCategoryApi } from './mock/prompt.mock.ts';
import * as marketplaceApi from './marketplace.api.ts';
import * as mockMarketplaceApi from './mock/marketplace.mock.ts';
import * as socialApi from './social.api.ts';
import * as mockSocialApi from './mock/social.mock.ts';
import * as aiLabApi from './ai-lab.api.ts';
import * as mockAiLabApi from './mock/ai-lab.mock.ts';
import * as advancedMarketplaceApi from './advanced-marketplace.api.ts';
import * as mockAdvancedMarketplaceApi from './mock/advanced-marketplace.mock.ts';

// Check if we should use mock API
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// Debug: Log which API mode is being used
console.log('🔧 API Configuration:', {
  VITE_USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  USE_MOCK_API,
  mode: USE_MOCK_API ? '🎭 MOCK MODE' : '🚀 REAL BACKEND'
});

// Export the appropriate API based on environment
export const api = {
  auth: USE_MOCK_API ? mockAuthApi : authApi,
  prompts: USE_MOCK_API ? mockPromptApi : promptApi,
  categories: USE_MOCK_API ? mockCategoryApi : categoryApi,
  marketplace: USE_MOCK_API ? mockMarketplaceApi : marketplaceApi,
  social: USE_MOCK_API ? mockSocialApi : socialApi,
  aiLab: USE_MOCK_API ? mockAiLabApi : aiLabApi,
  advancedMarketplace: USE_MOCK_API ? mockAdvancedMarketplaceApi : advancedMarketplaceApi,
};

// Also export the flag for debugging
export const isMockMode = USE_MOCK_API;


/**
 * Available AI models for testing
 */
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  costPer1kTokens: number;
  icon?: string;
  isAvailable: boolean;
}

/**
 * Test parameters for AI model
 */
export interface TestParameters {
  temperature: number;
  maxTokens: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

/**
 * Request to test a prompt with AI
 */
export interface TestRequest {
  promptId?: string;
  promptText: string;
  modelId: string;
  parameters: TestParameters;
}

/**
 * Result from AI test
 */
export interface TestResult {
  id: string;
  userId: string;
  promptId?: string;
  promptText: string;
  modelId: string;
  model: AIModel;
  parameters: TestParameters;
  response: string;
  tokensUsed: number;
  cost: number;
  responseTime: number; // in milliseconds
  createdAt: string;
  isSaved: boolean;
}

/**
 * Comparison test result (multiple models)
 */
export interface ComparisonTestResult {
  id: string;
  promptText: string;
  results: TestResult[];
  createdAt: string;
}

/**
 * Test history item
 */
export interface TestHistoryItem {
  id: string;
  promptText: string;
  modelName: string;
  response: string;
  tokensUsed: number;
  cost: number;
  createdAt: string;
  isSaved: boolean;
}

/**
 * Paginated test history response
 */
export interface TestHistoryResponse {
  tests: TestHistoryItem[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Test statistics
 */
export interface TestStatistics {
  totalTests: number;
  totalTokensUsed: number;
  totalCost: number;
  averageResponseTime: number;
  mostUsedModel: string;
  savedTests: number;
}


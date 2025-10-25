import { testServiceClient } from './client.ts';
import type {
  AIModel,
  TestRequest,
  TestResult,
  ComparisonTestResult,
  TestHistoryResponse,
  TestStatistics,
} from '@/types/ai-lab.types.ts';

/**
 * Get available AI providers
 */
export const getAIProviders = async (): Promise<{ providers: string[]; count: number }> => {
  const response = await testServiceClient.get<{ providers: string[]; count: number }>('/api/tests/providers');
  return response.data;
};

/**
 * Test a prompt with an AI model
 */
export const testPrompt = async (request: TestRequest): Promise<TestResult> => {
  const response = await testServiceClient.post<TestResult>('/api/tests', request);
  return response.data;
};

/**
 * Get test by ID
 */
export const getTestById = async (testId: string): Promise<TestResult> => {
  const response = await testServiceClient.get<TestResult>(`/api/tests/${testId}`);
  return response.data;
};

/**
 * Get test history for current user
 */
export const getTestHistory = async (userId: string): Promise<TestResult[]> => {
  const response = await testServiceClient.get<TestResult[]>(`/api/tests/user/${userId}`);
  return response.data;
};

/**
 * Get tests for a specific prompt
 */
export const getPromptTests = async (promptId: string): Promise<TestResult[]> => {
  const response = await testServiceClient.get<TestResult[]>(`/api/tests/prompt/${promptId}`);
  return response.data;
};


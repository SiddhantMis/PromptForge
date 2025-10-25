import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Zap, Settings, Clock, DollarSign, Hash, History, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { api } from '@/api/index.ts';
import type { TestResult, TestParameters } from '@/types/ai-lab.types.ts';

export const AITestPage = () => {
  const navigate = useNavigate();
  const [promptText, setPromptText] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [parameters, setParameters] = useState<TestParameters>({
    temperature: 0.7,
    maxTokens: 1000,
  });
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ['aiModels'],
    queryFn: () => api.aiLab.getAIModels(),
  });

  const testMutation = useMutation({
    mutationFn: () =>
      api.aiLab.testPrompt({
        promptText,
        modelId: selectedModelId,
        parameters,
      }),
    onSuccess: (result) => {
      setTestResult(result);
    },
  });

  const handleTest = () => {
    if (promptText.trim() && selectedModelId) {
      testMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-purple-700 p-8 md:p-10 shadow-lg">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Zap className="w-8 h-8" />
              AI Testing Lab
            </h1>
            <p className="text-indigo-100 text-base">
              Test your prompts with different AI models and compare results
            </p>
          </div>
          <Button
            onClick={() => navigate('/ai-lab/history')}
            size="lg"
            className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-md font-semibold"
          >
            <History className="w-4 h-4 mr-2" />
            View Test History
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prompt Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Your Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter your prompt to test..."
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="min-h-[150px]"
                disabled={testMutation.isPending}
              />
              <p className="text-xs text-gray-500">{promptText.length} characters</p>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <Label>Select AI Model</Label>
              {modelsLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {models?.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModelId(model.id)}
                      disabled={!model.isAvailable || testMutation.isPending}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedModelId === model.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      } ${!model.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900">{model.name}</span>
                        <Badge className="bg-gray-100 text-gray-700 text-xs">
                          ${model.costPer1kTokens}/1K tokens
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{model.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {model.provider} • Max {model.maxTokens} tokens
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Parameters */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Settings className="w-4 h-4" />
                <span>Advanced Settings</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Temperature: {parameters.temperature}</Label>
                </div>
                <Slider
                  value={[parameters.temperature]}
                  onValueChange={(value) =>
                    setParameters((prev) => ({ ...prev, temperature: value[0] }))
                  }
                  min={0}
                  max={2}
                  step={0.1}
                  disabled={testMutation.isPending}
                />
                <p className="text-xs text-gray-500">Higher = more creative, Lower = more focused</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Max Tokens: {parameters.maxTokens}</Label>
                </div>
                <Slider
                  value={[parameters.maxTokens]}
                  onValueChange={(value) =>
                    setParameters((prev) => ({ ...prev, maxTokens: value[0] }))
                  }
                  min={100}
                  max={4000}
                  step={100}
                  disabled={testMutation.isPending}
                />
                <p className="text-xs text-gray-500">Maximum length of the response</p>
              </div>
            </div>

            {/* Test Button */}
            <Button
              onClick={handleTest}
              disabled={!promptText.trim() || !selectedModelId || testMutation.isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-base font-semibold"
            >
              {testMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Testing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Run Test
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right: Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {testMutation.isPending ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : testResult ? (
              <div className="space-y-6">
                {/* Model Info */}
                <div className="flex items-center justify-between pb-3 border-b">
                  <div>
                    <h3 className="font-semibold text-gray-900">{testResult.model.name}</h3>
                    <p className="text-sm text-gray-600">{testResult.model.provider}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Success
                  </Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <Clock className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                    <p className="text-xs text-gray-600 mb-1">Time</p>
                    <p className="text-sm font-bold text-blue-600">
                      {(testResult.responseTime / 1000).toFixed(2)}s
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <Hash className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                    <p className="text-xs text-gray-600 mb-1">Tokens</p>
                    <p className="text-sm font-bold text-purple-600">{testResult.tokensUsed}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <DollarSign className="w-5 h-5 mx-auto text-green-600 mb-1" />
                    <p className="text-xs text-gray-600 mb-1">Cost</p>
                    <p className="text-sm font-bold text-green-600">
                      ${testResult.cost.toFixed(4)}
                    </p>
                  </div>
                </div>

                {/* Response */}
                <div className="space-y-2">
                  <Label>AI Response</Label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-[400px] overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{testResult.response}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => {
                      navigate('/prompts/create', {
                        state: {
                          promptText: testResult.promptText,
                          modelUsed: testResult.model.name,
                          testResult: testResult.response,
                        },
                      });
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create & Publish Prompt
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        navigator.clipboard.writeText(testResult.response);
                      }}
                    >
                      Copy Response
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Save Test
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Zap className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium">No test results yet</p>
                <p className="text-xs mt-1">Run a test to see results here</p>
              </div>
            )}

            {testMutation.isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-sm text-red-600 font-medium">Test failed</p>
                <p className="text-xs text-red-500 mt-1">
                  {(testMutation.error as any)?.message || 'An error occurred'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


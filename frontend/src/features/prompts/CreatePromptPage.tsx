import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/index.ts';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Save, Eye, X } from 'lucide-react';

// Validation schema
const createPromptSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters').max(5000, 'Content must be less than 5000 characters'),
  category: z.string().min(1, 'Please select a category'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed'),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']),
  status: z.enum(['DRAFT', 'PUBLISHED']),
});

type CreatePromptFormData = z.infer<typeof createPromptSchema>;

export const CreatePromptPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  
  // Check if we're coming from AI Lab with test data
  const aiLabData = location.state as { promptText?: string; modelUsed?: string; testResult?: string } | null;

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.getCategories(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreatePromptFormData>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      tags: [],
      visibility: 'PUBLIC',
      status: 'DRAFT',
    },
  });

  const tags = watch('tags') || [];
  const title = watch('title') || '';
  const description = watch('description') || '';
  const content = watch('content') || '';

  // Pre-fill form if coming from AI Lab
  useEffect(() => {
    if (aiLabData?.promptText) {
      setValue('content', aiLabData.promptText);
      setValue('title', `AI-Tested Prompt (${aiLabData.modelUsed || 'AI Model'})`);
      setValue('description', `This prompt was successfully tested with ${aiLabData.modelUsed || 'an AI model'} and produced quality results.`);
      if (aiLabData.modelUsed) {
        setValue('tags', ['ai-tested', aiLabData.modelUsed.toLowerCase().replace(/\s+/g, '-')]);
      }
    }
  }, [aiLabData, setValue]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreatePromptFormData) => api.prompts.createPrompt(data),
    onSuccess: (newPrompt) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      navigate(`/prompts/${newPrompt.id}`);
    },
  });

  const onSubmit = (data: CreatePromptFormData) => {
    createMutation.mutate(data);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 10) {
      setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        {/* Community Header */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-8 shadow-lg">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Share Your Prompt
            </h1>
            <p className="text-blue-100 text-base">
              Contribute to the community and help others create amazing content
            </p>
          </div>
        </div>

      {/* Toggle Preview */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={!previewMode ? 'default' : 'outline'}
          onClick={() => setPreviewMode(false)}
        >
          Edit
        </Button>
        <Button
          type="button"
          variant={previewMode ? 'default' : 'outline'}
          onClick={() => setPreviewMode(true)}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

      {previewMode ? (
        /* Preview Mode */
        <Card>
          <CardHeader>
            <CardTitle>{title || 'Untitled Prompt'}</CardTitle>
            <CardDescription>{description || 'No description provided'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap mb-4">
              {content || 'No content provided'}
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="outline">#{tag}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Edit Mode */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title & Description */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Give your prompt a catchy title"
                  disabled={createMutation.isPending}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{errors.title?.message}</span>
                  <span>{title.length}/100</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe what your prompt does and when to use it"
                  rows={3}
                  disabled={createMutation.isPending}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{errors.description?.message}</span>
                  <span>{description.length}/500</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Content */}
          <Card>
            <CardHeader>
              <CardTitle>Prompt Content</CardTitle>
              <CardDescription>
                Write your AI prompt. Use placeholders like {'{variable}'} for dynamic parts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                {...register('content')}
                placeholder="Enter your prompt here..."
                rows={10}
                className="font-mono"
                disabled={createMutation.isPending}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{errors.content?.message}</span>
                <span>{content.length}/5000</span>
              </div>
            </CardContent>
          </Card>

          {/* Category & Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Categorization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <select
                  id="category"
                  {...register('category')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={createMutation.isPending}
                >
                  <option value="">Select a category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Type a tag and press Enter"
                    disabled={createMutation.isPending || tags.length >= 10}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || tags.length >= 10}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{tags.length}/10 tags</p>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Visibility</Label>
                <div className="flex gap-4">
                  {['PUBLIC', 'PRIVATE', 'UNLISTED'].map((vis) => (
                    <label key={vis} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value={vis}
                        {...register('visibility')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{vis}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex gap-4">
                  {['DRAFT', 'PUBLISHED'].map((stat) => (
                    <label key={stat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value={stat}
                        {...register('status')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{stat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/prompts')}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {createMutation.isPending ? (
                'Creating...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Prompt
                </>
              )}
            </Button>
          </div>

          {createMutation.isError && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">
                Failed to create prompt. Please try again.
              </p>
            </div>
          )}
        </form>
      )}
    </div>
  );
};


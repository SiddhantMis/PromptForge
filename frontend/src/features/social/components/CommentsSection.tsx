import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { api } from '@/api/index.ts';
import { CommentItem } from './CommentItem.tsx';
import type { Comment } from '@/types/social.types.ts';

interface CommentsSectionProps {
  promptId: string;
}

export const CommentsSection = ({ promptId }: CommentsSectionProps) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['comments', promptId],
    queryFn: () => api.social.getComments(promptId, 1, 50),
  });

  const createMutation = useMutation({
    mutationFn: (content: string) =>
      api.social.createComment({
        promptId,
        content,
        parentId: replyingTo?.id,
      }),
    onSuccess: () => {
      setNewComment('');
      setReplyContent('');
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ['comments', promptId] });
    },
  });

  const handleSubmit = () => {
    const content = replyingTo ? replyContent : newComment;
    if (content.trim()) {
      createMutation.mutate(content);
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    setReplyContent('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comments
          {data && data.total > 0 && (
            <span className="text-sm font-normal text-gray-500">({data.total})</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New Comment Form */}
        <div className="space-y-3">
          {replyingTo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">
                  Replying to {replyingTo.user.firstName} {replyingTo.user.lastName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelReply}
                  className="h-auto p-1 text-blue-600 hover:text-blue-800"
                >
                  Cancel
                </Button>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{replyingTo.content}</p>
            </div>
          )}

          <Textarea
            placeholder={
              replyingTo
                ? 'Write your reply...'
                : 'Share your thoughts about this prompt...'
            }
            value={replyingTo ? replyContent : newComment}
            onChange={(e) =>
              replyingTo ? setReplyContent(e.target.value) : setNewComment(e.target.value)
            }
            className="min-h-[100px]"
            disabled={createMutation.isPending}
          />

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={
                createMutation.isPending ||
                (replyingTo ? !replyContent.trim() : !newComment.trim())
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createMutation.isPending
                ? 'Posting...'
                : replyingTo
                ? 'Post Reply'
                : 'Post Comment'}
            </Button>
          </div>
        </div>

        {/* Comments List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : data && data.comments.length > 0 ? (
          <div className="space-y-6">
            {data.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium">No comments yet</p>
            <p className="text-xs mt-1">Be the first to share your thoughts!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


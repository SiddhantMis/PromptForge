import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Reply, Trash2, Edit2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { api } from '@/api/index.ts';
import type { Comment } from '@/types/social.types.ts';
import { cn } from '@/utils/cn.ts';

interface CommentItemProps {
  comment: Comment;
  onReply?: (comment: Comment) => void;
  depth?: number;
}

export const CommentItem = ({ comment, onReply, depth = 0 }: CommentItemProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const likeMutation = useMutation({
    mutationFn: () => api.social.toggleCommentLike(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', comment.promptId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (content: string) => api.social.updateComment(comment.id, content),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['comments', comment.promptId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.social.deleteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', comment.promptId] });
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      updateMutation.mutate(editContent);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  return (
    <div className={cn("flex gap-3", depth > 0 && "ml-12 mt-4")}>
      {/* User Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
          {comment.user.firstName.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm">
                {comment.user.firstName} {comment.user.lastName}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
              {comment.updatedAt !== comment.createdAt && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
            </div>

            {/* Actions Menu */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px]"
                disabled={updateMutation.isPending}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={updateMutation.isPending || !editContent.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          )}
        </div>

        {/* Action Buttons */}
        {!isEditing && (
          <div className="flex items-center gap-4 mt-2 px-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-auto p-0 text-xs font-medium hover:bg-transparent",
                comment.userHasLiked ? "text-red-600" : "text-gray-600 hover:text-red-600"
              )}
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
            >
              <Heart className={cn("w-3.5 h-3.5 mr-1", comment.userHasLiked && "fill-current")} />
              {comment.likesCount > 0 && <span>{comment.likesCount}</span>}
              <span className="ml-1">Like</span>
            </Button>

            {depth < 2 && onReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-transparent"
                onClick={() => onReply(comment)}
              >
                <Reply className="w-3.5 h-3.5 mr-1" />
                Reply
              </Button>
            )}

            {/* Edit/Delete for own comments */}
            {comment.userId === '1' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-transparent"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-transparent"
                  onClick={() => {
                    if (confirm('Delete this comment?')) {
                      deleteMutation.mutate();
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


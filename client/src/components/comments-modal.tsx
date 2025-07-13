import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertCommentSchema } from "@shared/schema";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { isProfileComplete } from "@/lib/profileUtils";

const commentSchema = insertCommentSchema.pick({ content: true });
type CommentForm = z.infer<typeof commentSchema>;

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

interface CommentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: number;
}

export default function CommentsModal({ open, onOpenChange, postId }: CommentsModalProps) {
  const { user } = useAuth();

  const form = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["/api/posts", postId, "comments"],
    enabled: open && !!postId,
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: CommentForm) => {
      const response = await apiRequest("POST", `/api/posts/${postId}/comments`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      form.reset();
      alert("Comment Added: Your comment has been posted.");
    },
    onError: (error) => {
      console.error("Comment creation error:", error);
      alert("Error: Failed to post comment. Please try again.");
    },
  });

  const onSubmit = (data: CommentForm) => {
    if (data.content.trim()) {
      createCommentMutation.mutate(data);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return "Just now";
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {isLoading ? (
            <div className="text-center text-gray-500">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment: Comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.user.profileImageUrl} />
                  <AvatarFallback className="text-xs bg-faith-blue text-white">
                    {getInitials(comment.user.firstName, comment.user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-faith-text">
                        {comment.user.firstName} {comment.user.lastName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Form */}
        {isProfileComplete(user) ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="border-t pt-4">
            <div className="flex space-x-2">
              <Textarea
                {...form.register("content")}
                placeholder="Write a comment..."
                className="flex-1 min-h-[60px] resize-none"
                disabled={createCommentMutation.isPending}
              />
              <Button
                type="submit"
                disabled={createCommentMutation.isPending || !form.watch("content")?.trim()}
                className="bg-faith-blue hover:bg-blue-800 px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="border-t pt-4 bg-gray-50 text-center p-4">
            <p className="text-gray-600 mb-2">Complete your profile to comment</p>
            <Button 
              onClick={() => {
                onOpenChange(false);
                window.location.href = "/register";
              }}
              size="sm"
              className="bg-faith-blue hover:bg-blue-700"
            >
              Complete Profile
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
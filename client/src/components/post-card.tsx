import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Heart, MessageCircle, Share, MoreHorizontal, User, MapPin, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  location?: string;
  prayerCount: number;
  commentCount: number;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

interface PostCardProps {
  post: Post;
  onEditPost?: (post: Post) => void;
}

export default function PostCard({ post, onEditPost }: PostCardProps) {
  const [hasPrayed, setHasPrayed] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Check if current user owns this post
  const isOwnPost = user?.id === post.user.id;

  const prayerMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/posts/${post.id}/prayer`);
    },
    onSuccess: (response: any) => {
      setHasPrayed(response.action === "added");
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      
      toast({
        title: response.action === "added" ? "Prayer Added" : "Prayer Removed",
        description: response.action === "added" 
          ? "Your prayer has been added to this miracle." 
          : "Your prayer has been removed.",
      });
    },
    onError: (error) => {
      console.error("Prayer toggle error:", error);
      toast({
        title: "Error",
        description: "Failed to update prayer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return "now";
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  const handlePrayer = () => {
    prayerMutation.mutate();
  };

  const handleComment = () => {
    // TODO: Implement comment functionality
    toast({
      title: "Coming Soon",
      description: "Comment functionality will be available soon.",
    });
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `${post.user.firstName}'s Faith Experience`,
        text: post.content,
        url: window.location.href,
      });
    } else {
      toast({
        title: "Shared",
        description: "Post URL copied to clipboard.",
      });
    }
  };

  return (
    <Card className="shadow-sm border border-gray-200 overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {post.user.profileImageUrl ? (
            <img 
              src={post.user.profileImageUrl} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-faith-gold rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-faith-text">
              {post.user.firstName} {post.user.lastName}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              {post.location && (
                <>
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="mr-2">{post.location}</span>
                  <span>•</span>
                </>
              )}
              <span className="ml-2">{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>
        {isOwnPost ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditPost?.(post)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="w-8 h-8" /> // Empty space to maintain layout
        )}
      </div>
      
      {/* Post Content */}
      <div className="px-4 pb-4">
        <p className="text-faith-text mb-4 font-georgia whitespace-pre-wrap">
          {post.content}
        </p>
      </div>
      
      {/* Post Image */}
      {post.imageUrl && (
        <div className="px-4 mb-4">
          <img 
            src={post.imageUrl} 
            alt="Post content" 
            className="w-full h-64 object-cover rounded-lg" 
          />
        </div>
      )}
      
      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handlePrayer}
          disabled={prayerMutation.isPending}
          className={`flex items-center space-x-2 transition-colors ${
            hasPrayed 
              ? "text-faith-blue bg-blue-50" 
              : "text-gray-600 hover:text-faith-blue"
          }`}
        >
          <Heart className={`w-4 h-4 ${hasPrayed ? "fill-current" : ""}`} />
          <span className="text-sm">Pray</span>
          <span className="text-sm">{post.prayerCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleComment}
          className="flex items-center space-x-2 text-gray-600 hover:text-faith-blue transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">Comment</span>
          <span className="text-sm">{post.commentCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleShare}
          className="flex items-center space-x-2 text-gray-600 hover:text-faith-blue transition-colors"
        >
          <Share className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </Button>
      </div>
    </Card>
  );
}

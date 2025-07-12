import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Heart, MessageCircle, MoreHorizontal, User, MapPin, Edit, UserX, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import CommentsModal from "./comments-modal";
import ReportPostModal from "./report-post-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  location?: string;
  prayerCount: number;
  commentCount: number;
  loveCount: number;
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
  const [hasLoved, setHasLoved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  // const { toast } = useToast();
  const { user } = useAuth();
  
  // Check if current user owns this post
  const isOwnPost = user?.id === post.user.id;

  const prayerMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/posts/${post.id}/prayer`);
      const data = await response.json();
      console.log("Parsed API response:", data);
      return data;
    },
    onSuccess: (response: any) => {
      console.log("Prayer response:", response);
      setHasPrayed(response.action === "added");
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      console.log("Prayer action:", response.action);
    },
    onError: (error) => {
      console.error("Prayer toggle error:", error);
    },
  });

  const loveMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/posts/${post.id}/love`);
      const data = await response.json();
      console.log("Love API response:", data);
      return data;
    },
    onSuccess: (response: any) => {
      console.log("Love response:", response);
      setHasLoved(response.action === "added");
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      console.log("Love action:", response.action);
    },
    onError: (error) => {
      console.error("Love toggle error:", error);
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

  const handleLove = () => {
    loveMutation.mutate();
  };

  const handleComment = () => {
    setShowComments(true);
  };

  const blockUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("POST", `/api/users/${userId}/block`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
    onError: () => {
    },
  });

  const handleBlockUser = (userId: string) => {
    blockUserMutation.mutate(userId);
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setShowReportModal(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Flag className="w-4 h-4 mr-2" />
                Report Post
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleBlockUser(post.user.id)}
                className="text-red-600 focus:text-red-600"
              >
                <UserX className="w-4 h-4 mr-2" />
                Block User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            style={{ 
              pointerEvents: 'auto',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
            data-pin-nopin="true"
            data-pin-no-hover="true"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      )}
      
      {/* Post Actions */}
      <div className="px-2 py-3 border-t border-gray-100 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handlePrayer}
          disabled={prayerMutation.isPending}
          className={`flex items-center space-x-1 transition-colors px-2 ${
            hasPrayed 
              ? "text-faith-blue bg-blue-50" 
              : "text-gray-600 hover:text-faith-blue"
          }`}
        >
          <img 
            src="/cross.png" 
            alt="Cross" 
            className="w-3 h-auto"
          />
          <span className="text-xs">Pray</span>
          <span className="text-xs">{post.prayerCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLove}
          disabled={loveMutation.isPending}
          className={`flex items-center space-x-1 transition-colors px-2 ${
            hasLoved 
              ? "text-red-500 bg-red-50" 
              : "text-gray-600 hover:text-red-500"
          }`}
        >
          <Heart className={`w-3 h-3 ${hasLoved ? "fill-current text-red-500" : ""}`} />
          <span className="text-xs">Love</span>
          <span className="text-xs">{post.loveCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleComment}
          className="flex items-center space-x-1 text-gray-600 hover:text-faith-blue transition-colors px-2"
        >
          <MessageCircle className="w-3 h-3" />
          <span className="text-xs">Comment</span>
          <span className="text-xs">{post.commentCount}</span>
        </Button>
        

      </div>
      
      {/* Comments Modal */}
      <CommentsModal 
        open={showComments}
        onOpenChange={setShowComments}
        postId={post.id}
      />
      
      {/* Report Modal */}
      <ReportPostModal
        open={showReportModal}
        onOpenChange={setShowReportModal}
        postId={post.id}
      />
    </Card>
  );
}

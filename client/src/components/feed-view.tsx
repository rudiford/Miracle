import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Camera, MapPin, Heart, User, Cross } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PostCard from "./post-card";
import EditPostModal from "./edit-post-modal";
import { useAuth } from "@/hooks/useAuth";

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

interface FeedViewProps {
  onCreatePost: () => void;
}

export default function FeedView({ onCreatePost }: FeedViewProps) {
  console.log('FeedView component mounting...');
  const { user } = useAuth();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { data: posts = [], isLoading, error } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });
  
  console.log('FeedView state:', { posts: posts?.length, isLoading, error });
  
  if (error) {
    console.error('Posts query error:', error);
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">Error loading posts. Please try refreshing.</p>
        <Button onClick={() => window.location.reload()} className="mt-2">
          Refresh
        </Button>
      </div>
    );
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = (open: boolean) => {
    setIsEditModalOpen(open);
    if (!open) {
      setEditingPost(null);
    }
  };

  const handleCapturePhoto = () => {
    // TODO: Implement camera capture
    onCreatePost();
  };

  const handleAddLocation = () => {
    // TODO: Implement location capture
    onCreatePost();
  };

  const handleAddTestimony = () => {
    onCreatePost();
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <img 
            src="/cross.png" 
            alt="Cross" 
            className="w-12 h-auto mx-auto mb-4"
          />
          <p className="text-faith-text">Loading faith experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Create Post Section */}
      <Card className="mx-4 mt-4 shadow-sm border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-faith-blue rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <Button
              variant="ghost"
              onClick={onCreatePost}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-left px-4 py-3 h-auto rounded-full text-gray-600 justify-start"
            >
              Share your miracle or faith experience...
            </Button>
          </div>
          

        </CardContent>
      </Card>

      {/* Feed Posts */}
      <div className="space-y-4 px-4 pt-2">
        {posts.length === 0 ? (
          <div className="text-center py-6">
            <h3 className="text-lg font-semibold text-faith-text mb-2">Share Your First Miracle</h3>
            <p className="text-gray-600 mb-4">
              Be the first to share a faith experience with the community
            </p>
            <Button onClick={onCreatePost} className="bg-faith-blue hover:bg-blue-800">
              Create Post
            </Button>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onEditPost={handleEditPost} />
          ))
        )}
      </div>

      {/* Edit Post Modal */}
      <EditPostModal
        open={isEditModalOpen}
        onOpenChange={handleEditModalClose}
        post={editingPost}
      />
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import FeedView from "@/components/feed-view";
import BottomNavigation from "@/components/bottom-navigation";
import CreatePostModal from "@/components/create-post-modal";
import HelpModal from "@/components/help-modal";

export default function Home() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const goToAdmin = () => {
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-faith-light">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/cross.png" 
                alt="Cross" 
                className="w-12 h-auto"
              />
              <h1 className="text-xl font-bold text-faith-text">Proof of a Miracle</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Admin Button (if admin user) */}
              {user?.isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToAdmin}
                  className="text-faith-blue border-faith-blue hover:bg-faith-blue hover:text-white"
                >
                  Admin
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pb-20">
        <FeedView onCreatePost={() => setShowCreatePost(true)} />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        onCreatePost={() => setShowCreatePost(true)}
      />

      {/* Create Post Modal */}
      <CreatePostModal 
        open={showCreatePost} 
        onOpenChange={setShowCreatePost} 
      />

      {/* Help Modal */}
      <HelpModal />
    </div>
  );
}

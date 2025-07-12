import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon, Search, Plus, MessageCircle, User } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import FeedView from "@/components/feed-view";
import CreatePostModal from "@/components/create-post-modal";
import HelpModal from "@/components/help-modal";

export default function Home() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const goToAdmin = () => {
    window.location.href = "/admin";
  };

  const handleHome = () => {
    // Already on home feed view
  };

  const handleDiscover = () => {
    // TODO: Implement user search/discovery
    console.log("Discover users");
  };

  const handleMessages = () => {
    setLocation("/messages");
  };

  const handleProfile = () => {
    setLocation("/register");
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
          
          {/* Navigation Menu */}
          <div className="flex justify-around items-center pt-3 border-t border-gray-100 mt-3">
            <Button 
              variant="ghost" 
              onClick={handleHome}
              className="flex flex-col items-center space-y-1 py-2 px-3 text-faith-blue"
            >
              <HomeIcon className="w-5 h-5" />
              <span className="text-xs font-medium">Feed</span>
            </Button>
            
            <Button 
              variant="ghost"
              onClick={handleDiscover}
              className="flex flex-col items-center space-y-1 py-2 px-3 text-gray-400 hover:text-faith-blue transition-colors"
            >
              <Search className="w-5 h-5" />
              <span className="text-xs font-medium">Discover</span>
            </Button>
            
            <Button 
              onClick={() => setShowCreatePost(true)}
              className="bg-faith-blue hover:bg-blue-800 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="ghost"
              onClick={handleMessages}
              className="flex flex-col items-center space-y-1 py-2 px-3 text-gray-400 hover:text-faith-blue transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-medium">Messages</span>
            </Button>
            
            <Button 
              variant="ghost"
              onClick={handleProfile}
              className="flex flex-col items-center space-y-1 py-2 px-3 text-gray-400 hover:text-faith-blue transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div>
        <FeedView onCreatePost={() => setShowCreatePost(true)} />
      </div>

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

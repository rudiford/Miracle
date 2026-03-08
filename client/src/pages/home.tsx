import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon, Search, PlusCircle, MessageCircle, User, Settings, LogOut, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import FeedView from "@/components/feed-view";
import CreatePostModal from "@/components/create-post-modal";
import HelpModal from "@/components/help-modal";

export default function Home() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) {
    return (
      <div className="min-h-screen bg-faith-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const goToAdmin = () => {
    window.location.href = "/admin";
  };

  const handleMessages = () => {
    setLocation("/messages");
  };

  const handleProfile = () => {
    setLocation("/register");
  };

  return (
    <div className="min-h-screen bg-faith-light">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/cross.png" 
                alt="Cross" 
                className="w-10 h-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-xl font-bold text-faith-text">Proof of a Miracle</h1>
            </div>

            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-faith-blue font-medium"
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                Feed
              </Button>

              <Button 
                variant="ghost"
                size="sm"
                onClick={handleMessages}
                className="text-gray-600 hover:text-faith-blue font-medium"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Messages
              </Button>

              <Button 
                variant="ghost"
                size="sm"
                onClick={handleProfile}
                className="text-gray-600 hover:text-faith-blue font-medium"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>

              <Button 
                onClick={() => setShowCreatePost(true)}
                size="sm"
                className="bg-faith-blue hover:bg-blue-800 text-white font-medium ml-2"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                New Post
              </Button>

              <div className="border-l border-gray-200 ml-2 pl-2 flex items-center space-x-1">
                {user?.isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToAdmin}
                    className="text-faith-blue"
                    title="Admin Dashboard"
                  >
                    <Shield className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleProfile} title="Settings">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} title="Log Out">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto py-6 px-4">
        <FeedView onCreatePost={() => setShowCreatePost(true)} />
      </main>

      <CreatePostModal 
        open={showCreatePost} 
        onOpenChange={setShowCreatePost} 
      />

      <HelpModal />
    </div>
  );
}

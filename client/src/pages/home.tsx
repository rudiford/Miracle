import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Cross, List, Map, User, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import FeedView from "@/components/feed-view";
import MapView from "@/components/map-view";
import BottomNavigation from "@/components/bottom-navigation";
import CreatePostModal from "@/components/create-post-modal";
import HelpModal from "@/components/help-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ViewType = "feed" | "map";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("feed");
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
              <Cross className="text-faith-blue w-6 h-6" />
              <h1 className="text-xl font-bold text-faith-text">Proof of a Miracle</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <Button
                  variant={currentView === "feed" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("feed")}
                  className={`px-3 py-2 text-sm font-medium ${
                    currentView === "feed" 
                      ? "bg-faith-blue text-white" 
                      : "text-gray-600 hover:text-faith-blue"
                  }`}
                >
                  <List className="w-4 h-4 mr-1" />
                  Feed
                </Button>
                <Button
                  variant={currentView === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("map")}
                  className={`px-3 py-2 text-sm font-medium ${
                    currentView === "map" 
                      ? "bg-faith-blue text-white" 
                      : "text-gray-600 hover:text-faith-blue"
                  }`}
                >
                  <Map className="w-4 h-4 mr-1" />
                  Map
                </Button>
              </div>
              
              {/* Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-faith-blue rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user?.isAdmin && (
                    <DropdownMenuItem onClick={goToAdmin}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pb-20">
        {currentView === "feed" ? (
          <FeedView onCreatePost={() => setShowCreatePost(true)} />
        ) : (
          <MapView />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        currentView={currentView}
        onViewChange={setCurrentView}
        onCreatePost={() => setShowCreatePost(true)}
      />

      {/* Create Post Modal */}
      <CreatePostModal 
        open={showCreatePost} 
        onOpenChange={setShowCreatePost} 
      />

      {/* Help Modal */}
      <HelpModal currentView={currentView} />
    </div>
  );
}

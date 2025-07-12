import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface BottomNavigationProps {
  currentView: "feed" | "map";
  onViewChange: (view: "feed" | "map") => void;
  onCreatePost: () => void;
}

export default function BottomNavigation({ currentView, onViewChange, onCreatePost }: BottomNavigationProps) {
  const [, setLocation] = useLocation();

  const handleHome = () => {
    onViewChange("feed");
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        <Button 
          variant="ghost" 
          onClick={handleHome}
          className={`flex flex-col items-center space-y-1 py-2 px-3 ${
            currentView === "feed" ? "text-faith-blue" : "text-gray-400 hover:text-faith-blue"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
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
          onClick={onCreatePost}
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
    </nav>
  );
}

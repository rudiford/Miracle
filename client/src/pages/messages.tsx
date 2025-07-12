import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

interface Conversation {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

export default function Messages() {
  const [, setLocation] = useLocation();

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const goBack = () => {
    setLocation("/");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return "now";
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-faith-light flex items-center justify-center">
        <div className="text-center">
          <div className="cross-loading text-4xl text-faith-blue mb-4">✝</div>
          <p className="text-faith-text">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-faith-light">
      {/* Messages Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={goBack} className="text-faith-blue hover:text-blue-700">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-bold text-faith-text">Messages</h2>
          </div>
          <Button variant="ghost" className="text-faith-blue hover:text-blue-700">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Conversations List */}
      <div className="p-4 space-y-3">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">💬</div>
            <h3 className="text-lg font-semibold text-faith-text mb-2">No messages yet</h3>
            <p className="text-gray-600">Connect with fellow believers to start sharing your faith journey</p>
          </div>
        ) : (
          conversations.map((conversation, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  {conversation.user.profileImageUrl ? (
                    <img 
                      src={conversation.user.profileImageUrl} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-faith-gold rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-faith-text">
                      {conversation.user.firstName} {conversation.user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessage.createdAt)}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-faith-blue text-white rounded-full flex items-center justify-center text-xs mt-1">
                        <span>{conversation.unreadCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

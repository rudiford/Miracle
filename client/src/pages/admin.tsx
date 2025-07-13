import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowLeft, Shield, Users, Image, Flag, Cross, UserX, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import ReportsManagement from "@/components/reports-management";

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  reportedContent: number;
  activeMiracles: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  profileImageUrl?: string;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    retry: false,
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    retry: false,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "User Deleted",
        description: "User has been successfully removed.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    },
  });

  const goBack = () => {
    setLocation("/");
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (authLoading || (!user?.isAdmin && !authLoading)) {
    return (
      <div className="min-h-screen bg-faith-light flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/cross.png" 
            alt="Cross" 
            className="w-12 h-auto mx-auto mb-4"
          />
          <p className="text-faith-text">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-faith-light">
      {/* Admin Header */}
      <div className="bg-faith-blue text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-faith-gold" />
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
          </div>
          <Button variant="ghost" onClick={goBack} className="text-white hover:text-faith-gold">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Admin Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/admin/users")}>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-faith-blue mb-2 mx-auto" />
            <h3 className="text-2xl font-bold text-faith-text">
              {statsLoading ? "..." : stats?.totalUsers || 0}
            </h3>
            <p className="text-sm text-gray-600">Click to manage users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Image className="w-8 h-8 text-faith-gold mb-2 mx-auto" />
            <h3 className="text-2xl font-bold text-faith-text">
              {statsLoading ? "..." : stats?.totalPosts || 0}
            </h3>
            <p className="text-sm text-gray-600">Total Posts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Flag className="w-8 h-8 text-red-500 mb-2 mx-auto" />
            <h3 className="text-2xl font-bold text-faith-text">
              {statsLoading ? "..." : stats?.reportedContent || 0}
            </h3>
            <p className="text-sm text-gray-600">Reported</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <img 
              src="/cross.png" 
              alt="Cross" 
              className="w-8 h-auto mb-2 mx-auto"
            />
            <h3 className="text-2xl font-bold text-faith-text">
              {statsLoading ? "..." : stats?.activeMiracles || 0}
            </h3>
            <p className="text-sm text-gray-600">Active Miracles</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Admin Actions */}
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-faith-text">Moderation Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white h-auto py-3">
                <UserX className="w-4 h-4" />
                <span>Remove User</span>
              </Button>
              
              <Button className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white h-auto py-3">
                <Image className="w-4 h-4" />
                <span>Review Images</span>
              </Button>
              
              <Button 
                className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white h-auto py-3"
                onClick={() => setLocation("/admin/users")}
              >
                <Users className="w-4 h-4" />
                <span>View All Users</span>
              </Button>
              
              <Button className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white h-auto py-3">
                <CheckCircle className="w-4 h-4" />
                <span>Approve Content</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-faith-text">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="text-center py-4">
                <img 
                  src="/cross.png" 
                  alt="Cross" 
                  className="w-8 h-auto mx-auto mb-2"
                />
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No users found</p>
            ) : (
              <div className="space-y-3">
                {users.slice(0, 10).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {user.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt="Profile" 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-faith-blue rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-faith-text">
                          {user.firstName} {user.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                      disabled={deleteUserMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reports Management */}
        <ReportsManagement />
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, User, Trash2, Shield } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { User as DatabaseUser } from "@shared/schema";

export default function AdminUsers() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      toast({
        title: "Unauthorized",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  }, [user, authLoading, toast]);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !authLoading && user?.isAdmin,
  });

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all registered users in the system
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Total Users: {users?.length || 0}</span>
          </div>
        </div>

        {users && users.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Users Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No users have registered yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users?.map((profileUser: DatabaseUser) => (
              <Card key={profileUser.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={profileUser.profileImageUrl || undefined} 
                          alt={`${profileUser.firstName} ${profileUser.lastName}`} 
                        />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                          {profileUser.firstName?.[0]}{profileUser.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {profileUser.firstName} {profileUser.lastName}
                        </CardTitle>
                        <CardDescription>
                          {profileUser.email}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {profileUser.isAdmin && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {profileUser.age && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Age:</span>
                        <span className="ml-2 font-medium">{profileUser.age}</span>
                      </div>
                    )}
                    {profileUser.gender && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Gender:</span>
                        <span className="ml-2 font-medium capitalize">{profileUser.gender}</span>
                      </div>
                    )}
                  </div>

                  {(profileUser.city || profileUser.state || profileUser.country) && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>
                        {[profileUser.city, profileUser.state, profileUser.country]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {profileUser.createdAt && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        Joined {format(new Date(profileUser.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(profileUser.id)}
                      className="w-full"
                      disabled={profileUser.id === user?.id}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {profileUser.id === user?.id ? "Cannot Delete Self" : "Delete User"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
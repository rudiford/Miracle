import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserX, User } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BlockedUser {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  profileImageUrl?: string;
}

export default function BlockedUsersList() {
  // const { toast } = useToast();

  const { data: blockedUsers, isLoading } = useQuery({
    queryKey: ['/api/blocked-users'],
  });

  const unblockMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("DELETE", `/api/users/${userId}/block`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blocked-users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
    onError: () => {
    },
  });

  const handleUnblockUser = (userId: string) => {
    unblockMutation.mutate(userId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-faith-text">
            <UserX className="w-5 h-5 mr-2" />
            Blocked Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading blocked users...</p>
        </CardContent>
      </Card>
    );
  }

  const users = blockedUsers as BlockedUser[] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-faith-text">
          <UserX className="w-5 h-5 mr-2" />
          Blocked Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-gray-500">No blocked users</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
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
                      {user.firstName} {user.lastName}
                    </h3>
                    {user.email && (
                      <p className="text-sm text-gray-600">{user.email}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnblockUser(user.id)}
                  disabled={unblockMutation.isPending}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Unblock
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
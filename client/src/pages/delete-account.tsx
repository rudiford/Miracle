import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteAccount() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/users/delete-account", {
        reason,
        feedback,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account Deleted",
        description: "Your account and all associated data have been permanently deleted. You will be logged out shortly.",
      });
      // Redirect to logout after a brief delay
      setTimeout(() => {
        window.location.href = "/api/logout";
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account. Please contact support.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-faith-light flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/cross.png" 
            alt="Cross" 
            className="w-12 h-auto mx-auto mb-4"
          />
          <p className="text-faith-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-faith-light">
      {/* Header */}
      <div className="bg-faith-blue text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h1 className="text-lg font-bold">Delete Account</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="text-white hover:text-faith-gold"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <Trash2 className="w-5 h-5 mr-2" />
              Account Deletion Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">⚠️ Warning</h3>
              <p className="text-sm text-red-700">
                This action cannot be undone. Deleting your account will permanently remove:
              </p>
              <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                <li>Your profile and personal information</li>
                <li>All your posts and testimonies</li>
                <li>Your connections and messages</li>
                <li>Prayer counts and interactions</li>
                <li>All uploaded images and content</li>
              </ul>
            </div>

            {user && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Account to be deleted:</strong><br />
                  {user.firstName} {user.lastName}<br />
                  {user.email}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for deletion (optional)
                </label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., No longer using the app"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional feedback (optional)
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Help us improve by sharing your experience"
                  className="w-full"
                  rows={3}
                />
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  disabled={deleteAccountMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deleteAccountMutation.isPending ? "Deleting..." : "Delete My Account"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => setLocation("/")}
                className="text-gray-600"
              >
                Cancel and Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help or have questions? Contact us at{" "}
            <a href="mailto:support@proofofamiracle.com" className="text-faith-blue underline">
              support@proofofamiracle.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
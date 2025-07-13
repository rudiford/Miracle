import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Camera, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ProfileUpload from "./profile-upload";

const editPostSchema = z.object({
  content: z.string().min(1, "Please share your faith experience"),
  location: z.string().optional(),
});

type EditPostForm = z.infer<typeof editPostSchema>;

interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  location?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

interface EditPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
}

export default function EditPostModal({ open, onOpenChange, post }: EditPostModalProps) {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>();
  const { toast } = useToast();

  const form = useForm<EditPostForm>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      content: "",
      location: "",
    },
  });

  // Update form values when post changes
  useEffect(() => {
    if (post) {
      form.reset({
        content: post.content,
        location: post.location || "",
      });
      setCurrentImageUrl(post.imageUrl);
    }
  }, [post, form]);

  const editPostMutation = useMutation({
    mutationFn: async (data: EditPostForm) => {
      return await apiRequest("PATCH", `/api/posts/${post?.id}`, {
        ...data,
        imageUrl: currentImageUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post Updated",
        description: "Your faith experience has been updated successfully.",
      });
      onOpenChange(false);
      form.reset();
      setCurrentImageUrl(undefined);
    },
    onError: (error) => {
      console.error("Edit post error:", error);
      toast({
        title: "Error",
        description: "Failed to update your post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditPostForm) => {
    editPostMutation.mutate(data);
  };

  const handleImageUploaded = (url: string) => {
    setCurrentImageUrl(url);
  };

  const removeImage = () => {
    setCurrentImageUrl(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-faith-text">Edit Your Faith Experience</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-faith-text">Share your experience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about this miracle or faith experience..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-faith-text flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Location (optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Where did this happen? (e.g., Dallas, Texas)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="text-sm font-medium text-faith-text flex items-center mb-2">
                <Camera className="w-4 h-4 mr-1" />
                Photo (optional)
              </label>
              
              {currentImageUrl ? (
                <div className="relative">
                  <img 
                    src={currentImageUrl} 
                    alt="Post content" 
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <ProfileUpload
                  currentImageUrl={currentImageUrl}
                  onImageUploaded={handleImageUploaded}
                />
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={editPostMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editPostMutation.isPending}
                className="bg-faith-blue hover:bg-faith-blue/90"
              >
                {editPostMutation.isPending ? "Updating..." : "Update Post"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
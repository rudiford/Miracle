import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertPostSchema } from "@shared/schema";
import { z } from "zod";
import ProfileUpload from "@/components/profile-upload";
import { X } from "lucide-react";

const editPostSchema = insertPostSchema.extend({
  imageUrl: z.string().optional(),
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
      onOpenChange(false);
      form.reset();
      setCurrentImageUrl(undefined);
    },
    onError: (error) => {
      console.error("Edit post error:", error);
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
                  <FormLabel>Your Faith Experience</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share your miracle, answered prayer, or faith experience..."
                      className="min-h-[120px] resize-none border-faith-light/20 focus:border-faith"
                      maxLength={500}
                    />
                  </FormControl>
                  <div className="text-right text-sm text-faith-light">
                    {field.value?.length || 0}/500
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Where did this happen?"
                      className="border-faith-light/20 focus:border-faith"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Photo (Optional)</Label>
              <div className="space-y-3">
                {currentImageUrl && (
                  <div className="relative">
                    <img 
                      src={currentImageUrl} 
                      alt="Post" 
                      className="w-full h-48 object-cover rounded-lg border border-faith-light/20"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                <div className="flex justify-center">
                  <ProfileUpload
                    currentImageUrl={currentImageUrl}
                    onImageUploaded={handleImageUploaded}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editPostMutation.isPending}
                className="bg-faith hover:bg-faith/90"
              >
                {editPostMutation.isPending ? "Updating..." : "Update Experience"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
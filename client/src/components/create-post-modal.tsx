import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Camera, MapPin, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { insertPostSchema } from "@shared/schema";
import { z } from "zod";
import LocationPermissionGuide from "@/components/location-permission-guide";

const createPostSchema = insertPostSchema.extend({
  image: z.any().optional(),
});

type CreatePostForm = z.infer<typeof createPostSchema>;

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
      location: "",
      latitude: "",
      longitude: "",
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostForm) => {
      console.log("Creating post with data:", data);
      console.log("Selected image:", selectedImage);
      
      const formData = new FormData();
      formData.append("content", data.content);
      if (data.location) formData.append("location", data.location);
      if (data.latitude) formData.append("latitude", data.latitude);
      if (data.longitude) formData.append("longitude", data.longitude);
      if (selectedImage) formData.append("image", selectedImage);

      console.log("Sending FormData to /api/posts");
      
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Create post error response:", errorText);
        throw new Error(`Failed to create post: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Post created successfully:", result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post Created",
        description: "Your faith experience has been shared with the community.",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Post creation error:", error);
      console.error("Error details:", error.message);
      toast({
        title: "Error",
        description: `Failed to create post: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    form.reset();
    setSelectedImage(null);
    setImagePreview(null);
    setIsCapturingLocation(false);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptureLocation = () => {
    setIsCapturingLocation(true);
    
    if ("geolocation" in navigator) {
      // Enhanced options for better mobile support
      const options = {
        enableHighAccuracy: true,
        timeout: 15000, // 15 seconds
        maximumAge: 300000, // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          form.setValue("latitude", latitude.toString());
          form.setValue("longitude", longitude.toString());
          
          // Simple reverse geocoding placeholder
          form.setValue("location", `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
          
          setIsCapturingLocation(false);
          toast({
            title: "Location Captured",
            description: "Your current location has been added to the post.",
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsCapturingLocation(false);
          
          let errorMessage = "Could not capture your location.";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location permissions in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable. Please check your GPS settings.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again.";
              break;
            default:
              errorMessage = "An unknown error occurred while getting location.";
              break;
          }
          
          toast({
            title: "Location Error",
            description: errorMessage,
            variant: "destructive",
          });
        },
        options
      );
    } else {
      setIsCapturingLocation(false);
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: CreatePostForm) => {
    createPostMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-faith-text">Share Your Faith Experience</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Content Textarea */}
          <div>
            <Label htmlFor="content">Your testimony or experience *</Label>
            <Textarea
              id="content"
              {...form.register("content")}
              placeholder="Share your miracle, faith experience, or testimony..."
              className="min-h-[100px] resize-none"
              required
            />
            {form.formState.errors.content && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.content.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <Label>Add Photo</Label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button type="button" variant="outline" className="cursor-pointer" asChild>
                  <span className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Choose Photo</span>
                  </span>
                </Button>
              </label>
              
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
                id="camera-capture"
              />
              <label htmlFor="camera-capture">
                <Button type="button" variant="outline" className="cursor-pointer" asChild>
                  <span className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Camera</span>
                  </span>
                </Button>
              </label>
            </div>
            
            {imagePreview && (
              <div className="mt-4 relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <div className="flex space-x-2">
              <Input
                id="location"
                {...form.register("location")}
                placeholder="Enter location manually"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleCaptureLocation}
                disabled={isCapturingLocation}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {isCapturingLocation ? "Capturing..." : "Use Current"}
              </Button>
            </div>
            <div className="text-xs text-gray-600 mt-1 flex items-center justify-between">
              <span>If location capture fails, enable permissions or enter manually.</span>
              <LocationPermissionGuide />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-faith-blue hover:bg-blue-800"
              disabled={createPostMutation.isPending}
            >
              {createPostMutation.isPending ? "Sharing..." : "Share Experience"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

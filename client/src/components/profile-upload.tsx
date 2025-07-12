import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Camera, User } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";

interface ProfileUploadProps {
  currentImageUrl?: string | null;
  onImageUploaded: (url: string) => void;
}

export default function ProfileUpload({ currentImageUrl, onImageUploaded }: ProfileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  // const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await fetch("/api/users/profile-picture", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      return response.json();
    },
    onSuccess: (data) => {
      onImageUploaded(data.profileImageUrl);
      console.log("Profile picture updated successfully!");
    },
    onError: (error) => {
      console.error("Upload error:", error);
      console.error("Failed to upload profile picture!");
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      uploadMutation.mutate(file);
    }
  };

  return (
    <div className="relative inline-block">
      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
        {currentImageUrl ? (
          <img 
            src={currentImageUrl} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-8 h-8 text-gray-400" />
        )}
      </div>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="profile-picture-upload"
        disabled={isUploading}
      />
      
      <label htmlFor="profile-picture-upload">
        <Button
          type="button"
          size="sm"
          className="absolute bottom-4 right-0 bg-faith-blue text-white rounded-full w-8 h-8 p-0 cursor-pointer"
          disabled={isUploading}
          asChild
        >
          <span className="flex items-center justify-center">
            <Camera className="w-4 h-4" />
          </span>
        </Button>
      </label>
      
      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
          <img 
            src="/cross.png" 
            alt="Cross" 
            className="w-5 h-auto filter invert"
          />
        </div>
      )}
    </div>
  );
}

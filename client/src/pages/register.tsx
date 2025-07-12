import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Camera, User, Cross, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertUserSchema } from "@shared/schema";
import ProfileUpload from "@/components/profile-upload";
import { useLocation } from "wouter";
import { z } from "zod";
import HelpModal from "@/components/help-modal";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = insertUserSchema.extend({
  profilePicture: z.any().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: undefined,
      gender: "",
      city: "",
      state: "",
      country: "",
    },
  });

  // Load existing user data when component mounts or user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        age: user.age || undefined,
        gender: user.gender || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
      });
      setProfileImageUrl(user.profileImageUrl || null);
    }
  }, [user, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      return await apiRequest("PUT", "/api/users/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Welcome to our faith community!",
      });
      setLocation("/");
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterForm) => {
    const formData = {
      ...data,
      profileImageUrl,
    };
    updateProfileMutation.mutate(formData);
  };

  const goBack = () => {
    setLocation("/");
  };

  const handleDeleteAccount = () => {
    setLocation("/delete-account");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={goBack} className="mr-4 text-faith-blue hover:text-blue-700">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold text-faith-text">Join Our Faith Community</h2>
        </div>
        
        {/* Profile Creation Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="text-center">
            <ProfileUpload
              currentImageUrl={profileImageUrl}
              onImageUploaded={setProfileImageUrl}
            />
            <p className="text-sm text-gray-600 mt-2">Upload Profile Picture</p>
          </div>
          
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="block text-faith-text font-medium mb-2">
                First Name *
              </Label>
              <Input
                id="firstName"
                type="text"
                {...form.register("firstName")}
                placeholder="Your first name"
                className="w-full"
                required
              />
              {form.formState.errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.firstName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName" className="block text-faith-text font-medium mb-2">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                {...form.register("lastName")}
                placeholder="Your last name"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="age" className="block text-faith-text font-medium mb-2">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                {...form.register("age", { valueAsNumber: true })}
                placeholder="Your age"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="gender" className="block text-faith-text font-medium mb-2">
                Gender
              </Label>
              <Select onValueChange={(value) => form.setValue("gender", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="email" className="block text-faith-text font-medium mb-2">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="your@email.com"
                className="w-full"
                required
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="city" className="block text-faith-text font-medium mb-2">
                City
              </Label>
              <Input
                id="city"
                type="text"
                {...form.register("city")}
                placeholder="Your city"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="state" className="block text-faith-text font-medium mb-2">
                State
              </Label>
              <Input
                id="state"
                type="text"
                {...form.register("state")}
                placeholder="Your state"
                className="w-full"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="country" className="block text-faith-text font-medium mb-2">
                Country
              </Label>
              <Input
                id="country"
                type="text"
                {...form.register("country")}
                placeholder="Your country"
                className="w-full"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-faith-blue hover:bg-blue-800 text-white font-semibold py-4 px-6 h-auto shadow-lg"
            disabled={updateProfileMutation.isPending}
          >
            <img 
              src="/cross.png" 
              alt="Cross" 
              className="w-4 h-auto mr-2"
            />
            {updateProfileMutation.isPending ? "Joining..." : "Join Faith Community"}
          </Button>
        </form>
        
        {/* Danger Zone - Account Deletion */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Danger Zone</h3>
            <p className="text-red-700 mb-4">
              Once you delete your account, all your posts, messages, and data will be permanently removed. This action cannot be undone.
            </p>
            <Button 
              onClick={handleDeleteAccount}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
      
      {/* Help Modal */}
      <HelpModal currentView="register" />
    </div>
  );
}

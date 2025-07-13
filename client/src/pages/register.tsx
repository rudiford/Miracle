import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Camera, User, Cross, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertUserSchema } from "@shared/schema";
import ProfileUpload from "@/components/profile-upload";
import { useLocation } from "wouter";
import { z } from "zod";
import HelpModal from "@/components/help-modal";
import { useAuth } from "@/hooks/useAuth";
import { isProfileComplete, getIncompleteFields } from "@/lib/profileUtils";

const registerSchema = insertUserSchema.extend({
  profilePicture: z.any().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  // const { toast } = useToast();
  const { user, isLoading } = useAuth();
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

  // Load existing user data into the form
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
      // Invalidate both user and posts queries to refresh all displayed data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      // Force refetch posts to show updated user names
      queryClient.refetchQueries({ queryKey: ["/api/posts"] });
      alert("Profile Updated! Your name changes will now appear on all your posts.");
      setLocation("/");
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      alert("Error: Failed to update profile. Please try again.");
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

  const goToAdmin = () => {
    setLocation("/admin");
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
              <Select 
                value={form.watch("gender") || ""} 
                onValueChange={(value) => form.setValue("gender", value)}
              >
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
              <Select onValueChange={(value) => form.setValue("state", value)} value={form.watch("state") || ""}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AL">Alabama</SelectItem>
                  <SelectItem value="AK">Alaska</SelectItem>
                  <SelectItem value="AZ">Arizona</SelectItem>
                  <SelectItem value="AR">Arkansas</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="CO">Colorado</SelectItem>
                  <SelectItem value="CT">Connecticut</SelectItem>
                  <SelectItem value="DE">Delaware</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="GA">Georgia</SelectItem>
                  <SelectItem value="HI">Hawaii</SelectItem>
                  <SelectItem value="ID">Idaho</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                  <SelectItem value="IN">Indiana</SelectItem>
                  <SelectItem value="IA">Iowa</SelectItem>
                  <SelectItem value="KS">Kansas</SelectItem>
                  <SelectItem value="KY">Kentucky</SelectItem>
                  <SelectItem value="LA">Louisiana</SelectItem>
                  <SelectItem value="ME">Maine</SelectItem>
                  <SelectItem value="MD">Maryland</SelectItem>
                  <SelectItem value="MA">Massachusetts</SelectItem>
                  <SelectItem value="MI">Michigan</SelectItem>
                  <SelectItem value="MN">Minnesota</SelectItem>
                  <SelectItem value="MS">Mississippi</SelectItem>
                  <SelectItem value="MO">Missouri</SelectItem>
                  <SelectItem value="MT">Montana</SelectItem>
                  <SelectItem value="NE">Nebraska</SelectItem>
                  <SelectItem value="NV">Nevada</SelectItem>
                  <SelectItem value="NH">New Hampshire</SelectItem>
                  <SelectItem value="NJ">New Jersey</SelectItem>
                  <SelectItem value="NM">New Mexico</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="NC">North Carolina</SelectItem>
                  <SelectItem value="ND">North Dakota</SelectItem>
                  <SelectItem value="OH">Ohio</SelectItem>
                  <SelectItem value="OK">Oklahoma</SelectItem>
                  <SelectItem value="OR">Oregon</SelectItem>
                  <SelectItem value="PA">Pennsylvania</SelectItem>
                  <SelectItem value="RI">Rhode Island</SelectItem>
                  <SelectItem value="SC">South Carolina</SelectItem>
                  <SelectItem value="SD">South Dakota</SelectItem>
                  <SelectItem value="TN">Tennessee</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="UT">Utah</SelectItem>
                  <SelectItem value="VT">Vermont</SelectItem>
                  <SelectItem value="VA">Virginia</SelectItem>
                  <SelectItem value="WA">Washington</SelectItem>
                  <SelectItem value="WV">West Virginia</SelectItem>
                  <SelectItem value="WI">Wisconsin</SelectItem>
                  <SelectItem value="WY">Wyoming</SelectItem>
                  <SelectItem value="DC">Washington D.C.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="country" className="block text-faith-text font-medium mb-2">
                Country
              </Label>
              <Select onValueChange={(value) => form.setValue("country", value)} value={form.watch("country") || ""}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">🇺🇸 United States</SelectItem>
                  <SelectItem value="AF">🇦🇫 Afghanistan</SelectItem>
                  <SelectItem value="AL">🇦🇱 Albania</SelectItem>
                  <SelectItem value="DZ">🇩🇿 Algeria</SelectItem>
                  <SelectItem value="AR">🇦🇷 Argentina</SelectItem>
                  <SelectItem value="AM">🇦🇲 Armenia</SelectItem>
                  <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                  <SelectItem value="AT">🇦🇹 Austria</SelectItem>
                  <SelectItem value="AZ">🇦🇿 Azerbaijan</SelectItem>
                  <SelectItem value="BH">🇧🇭 Bahrain</SelectItem>
                  <SelectItem value="BD">🇧🇩 Bangladesh</SelectItem>
                  <SelectItem value="BY">🇧🇾 Belarus</SelectItem>
                  <SelectItem value="BE">🇧🇪 Belgium</SelectItem>
                  <SelectItem value="BZ">🇧🇿 Belize</SelectItem>
                  <SelectItem value="BO">🇧🇴 Bolivia</SelectItem>
                  <SelectItem value="BA">🇧🇦 Bosnia and Herzegovina</SelectItem>
                  <SelectItem value="BW">🇧🇼 Botswana</SelectItem>
                  <SelectItem value="BR">🇧🇷 Brazil</SelectItem>
                  <SelectItem value="BG">🇧🇬 Bulgaria</SelectItem>
                  <SelectItem value="KH">🇰🇭 Cambodia</SelectItem>
                  <SelectItem value="CM">🇨🇲 Cameroon</SelectItem>
                  <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                  <SelectItem value="CL">🇨🇱 Chile</SelectItem>
                  <SelectItem value="CN">🇨🇳 China</SelectItem>
                  <SelectItem value="CO">🇨🇴 Colombia</SelectItem>
                  <SelectItem value="CR">🇨🇷 Costa Rica</SelectItem>
                  <SelectItem value="HR">🇭🇷 Croatia</SelectItem>
                  <SelectItem value="CU">🇨🇺 Cuba</SelectItem>
                  <SelectItem value="CY">🇨🇾 Cyprus</SelectItem>
                  <SelectItem value="CZ">🇨🇿 Czech Republic</SelectItem>
                  <SelectItem value="DK">🇩🇰 Denmark</SelectItem>
                  <SelectItem value="DO">🇩🇴 Dominican Republic</SelectItem>
                  <SelectItem value="EC">🇪🇨 Ecuador</SelectItem>
                  <SelectItem value="EG">🇪🇬 Egypt</SelectItem>
                  <SelectItem value="SV">🇸🇻 El Salvador</SelectItem>
                  <SelectItem value="EE">🇪🇪 Estonia</SelectItem>
                  <SelectItem value="ET">🇪🇹 Ethiopia</SelectItem>
                  <SelectItem value="FI">🇫🇮 Finland</SelectItem>
                  <SelectItem value="FR">🇫🇷 France</SelectItem>
                  <SelectItem value="GE">🇬🇪 Georgia</SelectItem>
                  <SelectItem value="DE">🇩🇪 Germany</SelectItem>
                  <SelectItem value="GH">🇬🇭 Ghana</SelectItem>
                  <SelectItem value="GR">🇬🇷 Greece</SelectItem>
                  <SelectItem value="GT">🇬🇹 Guatemala</SelectItem>
                  <SelectItem value="HN">🇭🇳 Honduras</SelectItem>
                  <SelectItem value="HU">🇭🇺 Hungary</SelectItem>
                  <SelectItem value="IS">🇮🇸 Iceland</SelectItem>
                  <SelectItem value="IN">🇮🇳 India</SelectItem>
                  <SelectItem value="ID">🇮🇩 Indonesia</SelectItem>
                  <SelectItem value="IR">🇮🇷 Iran</SelectItem>
                  <SelectItem value="IQ">🇮🇶 Iraq</SelectItem>
                  <SelectItem value="IE">🇮🇪 Ireland</SelectItem>
                  <SelectItem value="IL">🇮🇱 Israel</SelectItem>
                  <SelectItem value="IT">🇮🇹 Italy</SelectItem>
                  <SelectItem value="JM">🇯🇲 Jamaica</SelectItem>
                  <SelectItem value="JP">🇯🇵 Japan</SelectItem>
                  <SelectItem value="JO">🇯🇴 Jordan</SelectItem>
                  <SelectItem value="KZ">🇰🇿 Kazakhstan</SelectItem>
                  <SelectItem value="KE">🇰🇪 Kenya</SelectItem>
                  <SelectItem value="KW">🇰🇼 Kuwait</SelectItem>
                  <SelectItem value="LV">🇱🇻 Latvia</SelectItem>
                  <SelectItem value="LB">🇱🇧 Lebanon</SelectItem>
                  <SelectItem value="LY">🇱🇾 Libya</SelectItem>
                  <SelectItem value="LT">🇱🇹 Lithuania</SelectItem>
                  <SelectItem value="LU">🇱🇺 Luxembourg</SelectItem>
                  <SelectItem value="MY">🇲🇾 Malaysia</SelectItem>
                  <SelectItem value="MX">🇲🇽 Mexico</SelectItem>
                  <SelectItem value="MD">🇲🇩 Moldova</SelectItem>
                  <SelectItem value="MA">🇲🇦 Morocco</SelectItem>
                  <SelectItem value="NL">🇳🇱 Netherlands</SelectItem>
                  <SelectItem value="NZ">🇳🇿 New Zealand</SelectItem>
                  <SelectItem value="NI">🇳🇮 Nicaragua</SelectItem>
                  <SelectItem value="NG">🇳🇬 Nigeria</SelectItem>
                  <SelectItem value="NO">🇳🇴 Norway</SelectItem>
                  <SelectItem value="OM">🇴🇲 Oman</SelectItem>
                  <SelectItem value="PK">🇵🇰 Pakistan</SelectItem>
                  <SelectItem value="PA">🇵🇦 Panama</SelectItem>
                  <SelectItem value="PY">🇵🇾 Paraguay</SelectItem>
                  <SelectItem value="PE">🇵🇪 Peru</SelectItem>
                  <SelectItem value="PH">🇵🇭 Philippines</SelectItem>
                  <SelectItem value="PL">🇵🇱 Poland</SelectItem>
                  <SelectItem value="PT">🇵🇹 Portugal</SelectItem>
                  <SelectItem value="QA">🇶🇦 Qatar</SelectItem>
                  <SelectItem value="RO">🇷🇴 Romania</SelectItem>
                  <SelectItem value="RU">🇷🇺 Russia</SelectItem>
                  <SelectItem value="SA">🇸🇦 Saudi Arabia</SelectItem>
                  <SelectItem value="RS">🇷🇸 Serbia</SelectItem>
                  <SelectItem value="SG">🇸🇬 Singapore</SelectItem>
                  <SelectItem value="SK">🇸🇰 Slovakia</SelectItem>
                  <SelectItem value="SI">🇸🇮 Slovenia</SelectItem>
                  <SelectItem value="ZA">🇿🇦 South Africa</SelectItem>
                  <SelectItem value="KR">🇰🇷 South Korea</SelectItem>
                  <SelectItem value="ES">🇪🇸 Spain</SelectItem>
                  <SelectItem value="LK">🇱🇰 Sri Lanka</SelectItem>
                  <SelectItem value="SE">🇸🇪 Sweden</SelectItem>
                  <SelectItem value="CH">🇨🇭 Switzerland</SelectItem>
                  <SelectItem value="TW">🇹🇼 Taiwan</SelectItem>
                  <SelectItem value="TH">🇹🇭 Thailand</SelectItem>
                  <SelectItem value="TR">🇹🇷 Turkey</SelectItem>
                  <SelectItem value="UA">🇺🇦 Ukraine</SelectItem>
                  <SelectItem value="AE">🇦🇪 United Arab Emirates</SelectItem>
                  <SelectItem value="GB">🇬🇧 United Kingdom</SelectItem>
                  <SelectItem value="UY">🇺🇾 Uruguay</SelectItem>
                  <SelectItem value="UZ">🇺🇿 Uzbekistan</SelectItem>
                  <SelectItem value="VE">🇻🇪 Venezuela</SelectItem>
                  <SelectItem value="VN">🇻🇳 Vietnam</SelectItem>
                  <SelectItem value="YE">🇾🇪 Yemen</SelectItem>
                  <SelectItem value="ZM">🇿🇲 Zambia</SelectItem>
                  <SelectItem value="ZW">🇿🇼 Zimbabwe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Privacy Policy Agreement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">
              By joining our faith community, you agree to our privacy practices. We protect your personal information and give you control over your data.
            </p>
            <div className="flex flex-wrap gap-2 text-sm">
              <a 
                href="/privacy-policy.md" 
                target="_blank" 
                className="text-faith-blue hover:underline font-medium"
              >
                Privacy Policy
              </a>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">Account deletion available anytime</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">GDPR compliant</span>
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
        
        {/* Admin Panel Access (if admin user) */}
        {user?.isAdmin && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Administrator Panel
              </h3>
              <p className="text-blue-700 mb-4">
                Access administrative features to manage users, view reports, and monitor community activity.
              </p>
              <Button 
                onClick={goToAdmin}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Open Admin Dashboard
              </Button>
            </div>
          </div>
        )}
        
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

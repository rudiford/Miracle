import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PWAInstallGuide from "@/components/pwa-install-guide";

export default function Landing() {
  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  const handleRegister = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-faith-blue to-blue-900 text-white flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 text-center">
        {/* Cross image */}
        <div className="mb-2 mt-4">
          <img 
            src="/cross.png" 
            alt="Cross" 
            className="mx-auto w-60 h-auto"
          />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-2 font-georgia">
          Proof of a Miracle
        </h1>
        
        <p className="text-xl mb-3 max-w-lg opacity-90">
          Discovering miracles and faith experiences around the world
        </p>
        
        {/* Faith community message */}
        <div className="w-full max-w-lg mb-3">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-base font-medium opacity-90 leading-relaxed">
                  Share your faith experiences and God's miracles with others from around the world
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-3 w-full max-w-md">
          <Button 
            onClick={handleSignIn}
            className="w-full bg-faith-gold hover:bg-yellow-500 text-faith-blue text-base font-semibold py-4 px-6 h-auto shadow-lg"
          >
            Sign In
          </Button>
          
          <Button 
            onClick={handleRegister}
            variant="outline"
            className="w-full border-2 border-white text-white hover:bg-white hover:text-faith-blue text-base font-semibold py-4 px-6 h-auto"
          >
            Create Account
          </Button>
          
          <div className="pt-4">
            <PWAInstallGuide />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-6 text-center opacity-75 text-base">
        <p className="font-georgia italic">
          "For where two or three gather in my name, there am I with them." - Matthew 18:20
        </p>
      </div>
    </div>
  );
}

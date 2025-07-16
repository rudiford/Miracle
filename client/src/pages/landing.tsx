import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import PWAInstallGuide from "@/components/pwa-install-guide";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Landing() {
  const { language, setLanguage, t } = useLanguage();

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
          Share your faith experiences and connect with believers worldwide
        </p>
        
        {/* Faith community message */}
        <div className="w-full max-w-lg mb-3">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-base font-medium opacity-90 leading-relaxed">
                  Join our Christian community to share testimonies, discover miracles, and strengthen your faith through the power of shared experiences.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4 w-full max-w-md">
          {/* Dual Language Login Buttons */}
          <div className="flex gap-3 w-full">
            <Button 
              onClick={() => {
                setLanguage('en');
                handleSignIn();
              }}
              className="flex-1 bg-faith-gold hover:bg-yellow-500 text-faith-blue text-sm font-semibold py-4 px-4 h-auto shadow-lg"
            >
              🇺🇸 Log In
            </Button>
            
            <Button 
              onClick={() => {
                setLanguage('es');
                handleSignIn();
              }}
              className="flex-1 bg-faith-gold hover:bg-yellow-500 text-faith-blue text-sm font-semibold py-4 px-4 h-auto shadow-lg"
            >
              🇪🇸 Iniciar Sesión
            </Button>
          </div>
          
          {/* Dual Language Get Started Buttons */}
          <div className="flex gap-3 w-full">
            <Button 
              onClick={() => {
                setLanguage('en');
                handleRegister();
              }}
              variant="outline"
              className="flex-1 border-2 border-white text-white hover:bg-white hover:text-faith-blue text-sm font-semibold py-4 px-4 h-auto"
            >
              🇺🇸 Get Started
            </Button>
            
            <Button 
              onClick={() => {
                setLanguage('es');
                handleRegister();
              }}
              variant="outline"
              className="flex-1 border-2 border-white text-white hover:bg-white hover:text-faith-blue text-sm font-semibold py-4 px-4 h-auto"
            >
              🇪🇸 Comenzar
            </Button>
          </div>
          
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

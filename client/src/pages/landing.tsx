import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages } from "lucide-react";
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
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-10 sm:block">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
          <Languages className="w-4 h-4 text-white" />
          <Select value={language} onValueChange={(value: 'en' | 'es') => setLanguage(value)}>
            <SelectTrigger className="w-20 bg-transparent border-white/20 text-white text-sm min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="es">ES</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Language Selector */}
      <div className="sm:hidden fixed top-2 right-2 z-20">
        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-md p-1.5">
          <Languages className="w-3 h-3 text-white" />
          <Select value={language} onValueChange={(value: 'en' | 'es') => setLanguage(value)}>
            <SelectTrigger className="w-16 h-6 bg-transparent border-white/20 text-white text-xs p-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="es">ES</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
          {t('landing.title')}
        </h1>
        
        <p className="text-xl mb-3 max-w-lg opacity-90">
          {t('landing.subtitle')}
        </p>
        
        {/* Faith community message */}
        <div className="w-full max-w-lg mb-3">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-base font-medium opacity-90 leading-relaxed">
                  {t('landing.description')}
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
            {t('landing.login')}
          </Button>
          
          <Button 
            onClick={handleRegister}
            variant="outline"
            className="w-full border-2 border-white text-white hover:bg-white hover:text-faith-blue text-base font-semibold py-4 px-6 h-auto"
          >
            {t('landing.getStarted')}
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

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Users, BookOpen } from "lucide-react";

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
      <header className="max-w-6xl mx-auto w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="/cross.png" 
            alt="Cross" 
            className="w-10 h-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-xl font-bold">Proof of a Miracle</span>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => {
              setLanguage('en');
              handleSignIn();
            }}
            className="bg-faith-gold hover:bg-yellow-500 text-faith-blue font-semibold px-6"
          >
            Log In
          </Button>
          <Button 
            onClick={() => {
              setLanguage('es');
              handleSignIn();
            }}
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-faith-blue font-semibold px-6"
          >
            Iniciar Sesion
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center items-center px-6 text-center max-w-4xl mx-auto">
        <div className="mb-6">
          <img 
            src="/cross.png" 
            alt="Cross" 
            className="mx-auto w-40 h-auto"
            onError={(e) => {
              e.currentTarget.outerHTML = `
                <svg class="mx-auto w-40 h-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M45 10 L55 10 L55 45 L90 45 L90 55 L55 55 L55 90 L45 90 L45 55 L10 55 L10 45 L45 45 Z" 
                        fill="black" stroke="white" stroke-width="2"/>
                </svg>
              `;
            }}
          />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-4 font-georgia">
          Proof of a Miracle
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-2xl opacity-90">
          Share your faith experiences and connect with believers worldwide
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <Heart className="w-10 h-10 mx-auto mb-3 text-faith-gold" />
              <h3 className="text-lg font-semibold mb-2">Share Testimonies</h3>
              <p className="text-sm opacity-80">Share your miracle stories and inspire others in their faith journey</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="w-10 h-10 mx-auto mb-3 text-faith-gold" />
              <h3 className="text-lg font-semibold mb-2">Connect with Believers</h3>
              <p className="text-sm opacity-80">Join a global community of faith and support one another in prayer</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-faith-gold" />
              <h3 className="text-lg font-semibold mb-2">Strengthen Your Faith</h3>
              <p className="text-sm opacity-80">Discover real stories of God's work and grow in your spiritual walk</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button 
            onClick={() => {
              setLanguage('en');
              handleRegister();
            }}
            className="flex-1 bg-faith-gold hover:bg-yellow-500 text-faith-blue text-lg font-semibold py-6 h-auto shadow-lg"
          >
            Get Started
          </Button>
          
          <Button 
            onClick={() => {
              setLanguage('es');
              handleRegister();
            }}
            variant="outline"
            className="flex-1 border-2 border-white text-white hover:bg-white hover:text-faith-blue text-lg font-semibold py-6 h-auto"
          >
            Comenzar
          </Button>
        </div>
      </div>
      
      <footer className="p-8 text-center opacity-75">
        <p className="font-georgia italic text-lg">
          "For where two or three gather in my name, there am I with them." - Matthew 18:20
        </p>
      </footer>
    </div>
  );
}

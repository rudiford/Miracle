import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PWAInstallGuide from "@/components/pwa-install-guide";
import WoodenCross from "@/components/wooden-cross";

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
        {/* Wooden cross with purple cloth */}
        <div className="mb-8">
          <WoodenCross className="mb-4 mx-auto" size={120} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-georgia">
          Proof of a Miracle
        </h1>
        
        <p className="text-xl mb-8 max-w-md opacity-90">
          Discovering miracles and faith experiences around the world
        </p>
        
        {/* Faith community gathering placeholder */}
        <div className="w-full max-w-sm mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6">
              <div className="w-full h-48 bg-white/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm font-medium opacity-90 leading-relaxed">
                    Share your faith experiences and God's miracles with others from around the world
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4 w-full max-w-sm">
          <Button 
            onClick={handleSignIn}
            className="w-full bg-faith-gold hover:bg-yellow-500 text-faith-blue font-semibold py-4 px-6 h-auto shadow-lg"
          >
            Sign In
          </Button>
          
          <Button 
            onClick={handleRegister}
            variant="outline"
            className="w-full border-2 border-white text-white hover:bg-white hover:text-faith-blue font-semibold py-4 px-6 h-auto"
          >
            Create Account
          </Button>
          
          <div className="pt-4">
            <PWAInstallGuide />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-6 text-center opacity-75 text-sm">
        <p className="font-georgia italic">
          "For where two or three gather in my name, there am I with them." - Matthew 18:20
        </p>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// PWA install guide temporarily disabled for debugging

export default function Landing() {
  console.log('Landing page rendering...');
  
  const handleSignIn = () => {
    window.location.href = "/api/auth/login";
  };

  const handleRegister = () => {
    window.location.href = "/api/auth/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-900 text-white flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 text-center">
        {/* Cross image */}
        <div className="mb-2 mt-4">
          <div className="w-60 h-60 mx-auto flex items-center justify-center">
            <div className="text-8xl">✞</div>
          </div>
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
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-blue-900 text-base font-semibold py-4 px-6 h-auto shadow-lg"
          >
            Sign In
          </Button>
          
          <Button 
            onClick={handleRegister}
            variant="outline"
            className="w-full border-2 border-white text-white hover:bg-white hover:text-blue-900 text-base font-semibold py-4 px-6 h-auto"
          >
            Create Account
          </Button>
          
          <div className="pt-4">
            <button className="text-sm text-white/70 hover:text-white">
              Install on Phone
            </button>
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

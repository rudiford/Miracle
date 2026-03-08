import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Users, BookOpen, Globe, MessageCircle, Shield } from "lucide-react";

export default function LandingPage() {
  const { setLanguage } = useLanguage();

  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/cross.png"
              alt="Cross"
              className="w-9 h-auto"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="text-xl font-bold text-gray-900">Proof of a Miracle</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setLanguage('en');
                handleSignIn();
              }}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Log In
            </Button>
            <Button
              onClick={() => {
                setLanguage('en');
                handleSignIn();
              }}
              className="bg-faith-blue hover:bg-blue-700 text-white font-semibold px-6"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-faith-blue to-blue-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-faith-gold rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 font-georgia">
                Share Your Faith.
                <br />
                <span className="text-faith-gold">Inspire the World.</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed max-w-lg">
                Join a global community of believers sharing testimonies, connecting in prayer, and discovering the miracles happening all around us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => {
                    setLanguage('en');
                    handleSignIn();
                  }}
                  className="bg-faith-gold hover:bg-yellow-500 text-blue-900 text-lg font-bold py-6 px-8 h-auto shadow-lg"
                >
                  Join the Community
                </Button>
                <Button
                  onClick={() => {
                    setLanguage('es');
                    handleSignIn();
                  }}
                  variant="outline"
                  className="border-2 border-white/50 text-white hover:bg-white/10 text-lg font-semibold py-6 px-8 h-auto"
                >
                  Unirse en Espanol
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-faith-gold/20 rounded-full blur-2xl scale-110" />
                <img
                  src="/cross.png"
                  alt="Cross"
                  className="w-64 md:w-80 h-auto relative z-10 drop-shadow-2xl"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              A Place for Every Believer
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you've witnessed a miracle or need encouragement, our community is here for you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Heart className="w-7 h-7 text-faith-blue" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Share Testimonies</h3>
                <p className="text-gray-600 leading-relaxed">
                  Post your miracle stories with photos and location. Let your experience uplift and encourage others in their faith.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Users className="w-7 h-7 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Connect & Pray</h3>
                <p className="text-gray-600 leading-relaxed">
                  Build meaningful connections with fellow believers. Send messages, share prayers, and grow together.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Globe className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Global Community</h3>
                <p className="text-gray-600 leading-relaxed">
                  Discover faith experiences from around the world. Available in English and Spanish for a truly global reach.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                More Than a Social Network
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Proof of a Miracle is built with purpose — a safe, faith-centered space where your stories matter and your voice is heard.
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageCircle className="w-5 h-5 text-faith-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Private Messaging</h4>
                    <p className="text-gray-600">Connect one-on-one with community members for prayer and fellowship.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Rich Testimonies</h4>
                    <p className="text-gray-600">Share stories with photos, locations, and receive prayers and love from the community.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Safe & Moderated</h4>
                    <p className="text-gray-600">Content moderation and user safety tools keep our community positive and uplifting.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-faith-blue to-blue-800 rounded-3xl p-10 text-white text-center">
              <img
                src="/cross.png"
                alt="Cross"
                className="w-24 h-auto mx-auto mb-6"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <p className="text-2xl font-georgia italic mb-4 leading-relaxed">
                "For where two or three gather in my name, there am I with them."
              </p>
              <p className="text-faith-gold font-semibold">Matthew 18:20</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-900 via-faith-blue to-blue-800 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Share Your Story?
          </h2>
          <p className="text-lg opacity-90 mb-10 max-w-xl mx-auto">
            Join thousands of believers who are discovering and sharing the miracles happening every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                setLanguage('en');
                handleSignIn();
              }}
              className="bg-faith-gold hover:bg-yellow-500 text-blue-900 text-lg font-bold py-6 px-10 h-auto shadow-lg"
            >
              Get Started Free
            </Button>
            <Button
              onClick={() => {
                setLanguage('es');
                handleSignIn();
              }}
              variant="outline"
              className="border-2 border-white/50 text-white hover:bg-white/10 text-lg font-semibold py-6 px-10 h-auto"
            >
              Comenzar Gratis
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <img
                src="/cross.png"
                alt="Cross"
                className="w-7 h-auto opacity-60"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="font-semibold text-gray-300">Proof of a Miracle</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} Proof of a Miracle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

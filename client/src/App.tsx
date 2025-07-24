import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";

import { useAuth } from "@/hooks/useAuth";
import { isProfileComplete } from "@/lib/profileUtils";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Register from "@/pages/register";
import Messages from "@/pages/messages";
import Admin from "@/pages/admin";
import AdminUsers from "@/pages/admin-users";
import Privacy from "@/pages/privacy";
import DeleteAccount from "@/pages/delete-account";


function Router() {
  const { isAuthenticated, isLoading, user, error } = useAuth();
  const { language } = useLanguage();
  const profileComplete = isProfileComplete(user, language);

  console.log('Router state:', { isAuthenticated, isLoading, user, profileComplete, error });
  console.log('Browser:', navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Other');
  
  // Add detailed logging for debugging
  if (isAuthenticated && user) {
    console.log('User authenticated, rendering authenticated routes');
    console.log('Profile complete:', profileComplete);
  } else if (isAuthenticated && !user) {
    console.log('Authenticated but no user data - potential issue');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-faith-blue to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <img 
            src="/cross.png" 
            alt="Cross" 
            className="w-16 h-auto mx-auto mb-4"
          />
          <p className="text-xl">Loading your faith journey...</p>
          <div className="mt-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Auth error:', error);
    console.error('Browser info:', navigator.userAgent);
    return (
      <div className="min-h-screen bg-gradient-to-b from-faith-blue to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <img 
            src="/cross.png" 
            alt="Cross" 
            className="w-16 h-auto mx-auto mb-4"
          />
          <p className="text-xl">Connection error. Please refresh the page.</p>
          <p className="text-sm mt-2 opacity-75">If issues persist, try clearing your browser cache.</p>
          <div className="mt-4 space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-faith-gold text-faith-blue rounded-lg font-semibold"
            >
              Refresh
            </button>
            <button 
              onClick={() => window.location.href = "/api/login"} 
              className="px-6 py-2 bg-transparent border-2 border-white text-white rounded-lg font-semibold"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/register" component={Register} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/delete-account" component={DeleteAccount} />
        </>
      ) : !profileComplete ? (
        <>
          {/* Force profile completion for authenticated users */}
          <Route path="/register" component={Register} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/delete-account" component={DeleteAccount} />
          <Route component={() => <Register />} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/messages" component={Messages} />
          <Route path="/register" component={Register} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/delete-account" component={DeleteAccount} />
          {user?.isAdmin && <Route path="/admin" component={Admin} />}
          {user?.isAdmin && <Route path="/admin/users" component={AdminUsers} />}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router />
        {/* <Toaster /> */}
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;

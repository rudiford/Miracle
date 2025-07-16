import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";

import { useAuth } from "@/hooks/useAuth";
import { isProfileComplete } from "@/lib/profileUtils";
import { LanguageProvider } from "@/contexts/LanguageContext";
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
  const profileComplete = isProfileComplete(user);

  console.log('Router state:', { isAuthenticated, isLoading, user, profileComplete, error });

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
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Auth error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-faith-blue to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <img 
            src="/cross.png" 
            alt="Cross" 
            className="w-16 h-auto mx-auto mb-4"
          />
          <p className="text-xl">Connection error. Please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-faith-gold text-faith-blue rounded-lg font-semibold"
          >
            Refresh
          </button>
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

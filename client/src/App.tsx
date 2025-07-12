import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "react-error-boundary";

import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Register from "@/pages/register";
import Messages from "@/pages/messages";
import Admin from "@/pages/admin";
import Privacy from "@/pages/privacy";
import DeleteAccount from "@/pages/delete-account";

function ErrorFallback({error}: {error: Error}) {
  // Log the error but don't show the error overlay in preview
  console.log('Error caught by boundary:', error);
  
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-800 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">
          {error.message || "An unexpected error occurred"}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

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

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/register" component={Register} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/delete-account" component={DeleteAccount} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/messages" component={Messages} />
          <Route path="/register" component={Register} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/delete-account" component={DeleteAccount} />
          {user?.isAdmin && <Route path="/admin" component={Admin} />}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.log('Error boundary caught:', error, errorInfo);
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

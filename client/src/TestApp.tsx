import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function TestApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-blue-500 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">
          TEST APP WORKING
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default TestApp;
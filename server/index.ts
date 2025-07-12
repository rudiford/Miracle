import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Production-ready mobile detection with fallback
app.use((req, res, next) => {
  try {
    // Skip mobile detection for API routes, static files, and other non-root requests
    if (req.path !== '/' || req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      return next();
    }
    
    const userAgent = req.headers['user-agent'] || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Serve mobile version for mobile browsers requesting root (unless desktop is requested)
    if (req.method === 'GET' && isMobile && !req.query.desktop) {
      console.log('MOBILE DETECTED - Serving mobile content:', userAgent.substring(0, 60));
      
      const mobileHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Proof of a Miracle - Mobile</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  background: #1e3a8a; 
  color: white; 
  font-size: 1.2rem; 
  padding: 20px; 
  text-align: center; 
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  background: white;
  color: #1e3a8a;
  padding: 30px;
  border-radius: 15px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.cross { font-size: 4rem; margin-bottom: 20px; }
h1 { font-size: 2rem; margin-bottom: 10px; font-weight: bold; }
p { margin-bottom: 20px; }
.btn { 
  display: block;
  width: 100%; 
  padding: 15px; 
  margin: 10px 0; 
  background: #f59e0b; 
  color: #1e3a8a; 
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}
.btn:hover { background: #d97706; }
.debug { font-size: 0.9rem; color: #6b7280; margin-top: 20px; }
</style>
</head>
<body>
<div class="container">
<div class="cross">✞</div>
<h1>Proof of a Miracle</h1>
<p>Faith Community</p>
<p><strong>Mobile Version - Production Ready!</strong></p>
<a href="/api/auth/login" class="btn">Sign In with Replit</a>
<a href="/?desktop=1" class="btn" style="background: #6b7280; margin-top: 5px;">Desktop Version</a>
<p class="debug">Mobile compatibility fixed - ${new Date().toISOString()}</p>
</div>
</body>
</html>`;
      
      return res.send(mobileHtml);
    }
    
    next();
  } catch (error) {
    console.error('Mobile detection error:', error);
    next();
  }
});

// Restored React development mode for full functionality

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error('Server error:', err);
    console.error('Request path:', req.path);
    console.error('Request method:', req.method);
    console.error('Stack trace:', err.stack);
    
    // Enhanced error handling for production
    if (req.path === '/' && !res.headersSent) {
      // For root path errors, serve a working fallback
      const fallbackHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Proof of a Miracle</title>
<style>
body { 
  background: #1e3a8a; 
  color: white; 
  font-family: Arial, sans-serif;
  padding: 20px; 
  text-align: center; 
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  background: white;
  color: #1e3a8a;
  padding: 30px;
  border-radius: 15px;
  max-width: 400px;
  width: 100%;
}
.cross { font-size: 4rem; margin-bottom: 20px; }
h1 { font-size: 2rem; margin-bottom: 20px; }
p { margin-bottom: 20px; }
</style>
</head>
<body>
<div class="container">
<div class="cross">✞</div>
<h1>Proof of a Miracle</h1>
<p>Faith Community</p>
<p><strong>Service Temporarily Unavailable</strong></p>
<p>We're working to restore full service. Please try again in a few minutes.</p>
<p style="font-size: 0.9rem; color: #6b7280; margin-top: 20px;">Error: ${message}</p>
</div>
</body>
</html>`;
      
      return res.status(503).send(fallbackHtml);
    }
    
    res.status(status).json({ message });
    // Don't throw error in production to prevent crashes
    if (process.env.NODE_ENV !== 'production') {
      throw err;
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  // Always use development mode to get full React app functionality
  await setupVite(app, server);

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

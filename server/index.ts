import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// CRITICAL: Mobile detection must happen FIRST, before any other middleware
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent);
  
  // Immediately serve mobile version for mobile browsers requesting root (unless desktop is requested)
  if (req.method === 'GET' && req.path === '/' && isMobile && !req.query.desktop) {
    console.log('MOBILE DETECTED - Serving mobile version:', userAgent.substring(0, 60));
    console.log('Request details:', { method: req.method, path: req.path, query: req.query });
    
    const mobileHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>Proof of a Miracle</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  font-family: Arial, sans-serif; 
  background: #1e3a8a;
  color: white; 
  padding: 20px;
  min-height: 100vh;
}
.container { 
  background: white; 
  border-radius: 15px; 
  padding: 30px; 
  max-width: 400px; 
  margin: 50px auto;
  text-align: center; 
  color: #1e3a8a; 
}
.cross { font-size: 4rem; margin-bottom: 20px; color: #1e3a8a; }
h1 { font-size: 2rem; margin-bottom: 10px; color: #1e3a8a; }
p { margin-bottom: 20px; color: #374151; }
.btn { 
  display: block;
  width: 100%; 
  padding: 15px; 
  margin: 10px 0; 
  border: none; 
  border-radius: 8px; 
  font-size: 1.1rem; 
  font-weight: bold; 
  text-decoration: none;
  text-align: center;
  background: #f59e0b; 
  color: #1e3a8a; 
}
.debug { font-size: 0.8rem; color: #6b7280; margin-top: 20px; }
</style>
</head>
<body>
<div class="container">
<div class="cross">✞</div>
<h1>Proof of a Miracle</h1>
<p>Faith Community</p>
<p>Mobile Version Working!</p>
<a href="/api/auth/login" class="btn">Sign In with Replit</a>
<div class="debug">
<p>If you see this, the mobile version is working!</p>
</div>
</div>
</body>
</html>`;
    
    return res.send(mobileHtml);
  }
  
  next();
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

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
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

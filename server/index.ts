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
    
    const mobileHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proof of a Miracle</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, sans-serif; 
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
            color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .app { background: rgba(255, 255, 255, 0.95); border-radius: 15px; padding: 30px; max-width: 400px; width: 100%; text-align: center; color: #1e3a8a; }
        .cross { font-size: 3rem; margin-bottom: 20px; }
        h1 { font-size: 1.8rem; margin-bottom: 10px; }
        p { margin-bottom: 20px; opacity: 0.8; }
        .btn { width: 100%; padding: 12px; margin: 8px 0; border: none; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; }
        .btn-primary { background: #f59e0b; color: #1e3a8a; }
        .btn-secondary { background: #6b7280; color: white; }
        .status { padding: 15px; margin: 15px 0; border-radius: 8px; font-size: 0.9rem; }
        .loading { background: #f3f4f6; color: #374151; }
        .hidden { display: none; }
        .spinner { width: 20px; height: 20px; border: 2px solid #f3f4f6; border-top: 2px solid #1e3a8a; border-radius: 50%; animation: spin 1s linear infinite; margin: 10px auto; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="app">
        <div class="cross">✞</div>
        <h1>Proof of a Miracle</h1>
        <p>Faith Community - Mobile</p>
        
        <div id="loading-section">
            <div class="status loading">
                <div class="spinner"></div>
                <p>Loading...</p>
            </div>
        </div>
        
        <div id="auth-section" class="hidden">
            <div id="login-section">
                <p style="margin-bottom: 15px;">Join our faith community</p>
                <button class="btn btn-primary" onclick="signIn()">Sign In with Replit</button>
            </div>
        </div>
    </div>

    <script>
        console.log('Mobile version loaded directly');
        
        async function checkAuth() {
            try {
                const response = await fetch('/api/auth/user', { credentials: 'include' });
                if (response.ok) {
                    const user = await response.json();
                    document.getElementById('auth-section').innerHTML = 
                        '<div class="status" style="background: #d1fae5; color: #065f46;">Welcome, ' + user.firstName + '!</div>' +
                        '<button class="btn btn-primary" onclick="window.location.href=\\'/\\?desktop=1\\'">Enter Full App</button>' +
                        '<button class="btn btn-secondary" onclick="window.location.href=\\'/api/auth/logout\\'">Sign Out</button>';
                } else {
                    document.getElementById('login-section').style.display = 'block';
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                document.getElementById('login-section').style.display = 'block';
            }
            document.getElementById('loading-section').style.display = 'none';
            document.getElementById('auth-section').style.display = 'block';
        }
        
        function signIn() {
            window.location.href = '/api/auth/login';
        }
        
        checkAuth();
    </script>
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

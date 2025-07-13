import express from 'express';
import { setupAuth, isAuthenticated } from './replitAuth';
import { storage } from './storage';

const app = express();
app.use(express.json());

// Simple logging
const log = (message: string) => console.log(`[FRESH] ${message}`);

// Basic CORS and headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Device detection
function isMobile(userAgent: string): boolean {
  return /Mobile|Android|iPhone|iPad/i.test(userAgent);
}

// Main route - clean and simple
app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const mobile = isMobile(userAgent);
  
  log(`${mobile ? 'MOBILE' : 'DESKTOP'} request from ${userAgent.substring(0, 50)}...`);

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Proof of a Miracle - Faith Community</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}
.container {
  max-width: 400px;
  background: rgba(255,255,255,0.1);
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}
.cross {
  font-size: ${mobile ? '80px' : '120px'};
  color: #f59e0b;
  margin: 20px 0;
  text-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
}
h1 {
  font-size: ${mobile ? '1.8rem' : '2.5rem'};
  margin: 20px 0;
  font-weight: bold;
}
p {
  font-size: 1.1rem;
  margin: 15px 0;
  opacity: 0.9;
}
.btn {
  display: inline-block;
  background: #f59e0b;
  color: white;
  padding: 15px 30px;
  text-decoration: none;
  border-radius: 10px;
  font-weight: bold;
  margin: 20px 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}
.btn:hover {
  background: #d97706;
  transform: translateY(-2px);
}
.status {
  background: #059669;
  padding: 10px;
  border-radius: 8px;
  margin: 20px 0;
  font-size: 0.9rem;
}
</style>
</head>
<body>
<div class="container">
  <div class="cross">✞</div>
  <h1>Proof of a Miracle</h1>
  <p>Faith Community for Believers</p>
  <div class="status">FRESH START - CLEAN IMPLEMENTATION</div>
  <p>Share testimonies • Connect with believers • Discover miracles</p>
  
  <a href="http://localhost:5000/api/login" class="btn">Sign In</a>
  <a href="/app" class="btn">Enter App</a>
  
  <p style="font-size: 0.8rem; margin-top: 30px; opacity: 0.7;">
    ${mobile ? 'Mobile' : 'Desktop'} • ${new Date().toLocaleTimeString()}
  </p>
</div>
</body>
</html>`);
});

// Simple app route
app.get('/app', isAuthenticated, async (req, res) => {
  const user = req.user as any;
  const userId = user?.claims?.sub;
  
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Faith Community - Main App</title>
<style>
body {
  font-family: system-ui, sans-serif;
  background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
  color: white;
  margin: 0;
  padding: 20px;
}
.header {
  text-align: center;
  padding: 20px 0;
  border-bottom: 2px solid rgba(255,255,255,0.2);
  margin-bottom: 30px;
}
.cross { font-size: 48px; color: #f59e0b; }
h1 { margin: 10px 0; }
.container { max-width: 600px; margin: 0 auto; }
.post-form {
  background: rgba(255,255,255,0.1);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
}
textarea {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 8px;
  background: rgba(255,255,255,0.9);
  color: #1e3a8a;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
}
.btn {
  background: #f59e0b;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin: 10px 5px;
}
.btn:hover { background: #d97706; }
.logout { background: #dc2626; }
.logout:hover { background: #b91c1c; }
</style>
</head>
<body>
<div class="header">
  <div class="cross">✞</div>
  <h1>Proof of a Miracle</h1>
  <p>Welcome to the Faith Community, ${userId || 'Believer'}</p>
</div>

<div class="container">
  <div class="post-form">
    <h3>Share Your Testimony</h3>
    <textarea placeholder="Share a miracle, testimony, or prayer request..."></textarea>
    <br>
    <button class="btn">Post Testimony</button>
  </div>
  
  <div style="text-align: center;">
    <button class="btn">Community Feed</button>
    <button class="btn">My Profile</button>
    <a href="/api/logout" class="btn logout">Sign Out</a>
  </div>
</div>
</body>
</html>`);
});

// Initialize fresh server
async function startFreshServer() {
  try {
    log('Setting up authentication system...');
    // Setup authentication
    await setupAuth(app);
    log('Authentication setup complete');
    
    // API Routes
    app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    });

    app.post('/api/posts', isAuthenticated, async (req: any, res) => {
      const userId = req.user.claims.sub;
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Content required' });
      }
      
      const post = await storage.createPost(userId, { content });
      res.json(post);
    });

    app.get('/api/posts', async (req, res) => {
      const posts = await storage.getAllPosts();
      res.json(posts);
    });

    const PORT = process.env.PORT || 6000;
    app.listen(PORT, '0.0.0.0', () => {
      log(`Fresh server running on port ${PORT}`);
      log('Clean implementation started successfully');
      log('Visit http://localhost:' + PORT + ' to test');
    });
    
  } catch (error) {
    log('Error starting fresh server: ' + error);
  }
}

export { startFreshServer, app };
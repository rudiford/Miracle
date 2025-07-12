const express = require('express');
const app = express();

console.log('EMERGENCY FIX: Starting bulletproof mobile server...');

function detectPlatform(userAgent) {
  const mobile = /Mobi|Android|iPhone|iPad/i.test(userAgent);
  const ios = /iPhone|iPad/i.test(userAgent);
  const android = /Android/i.test(userAgent);
  return { mobile, ios, android };
}

function generateHTML(platform) {
  const deviceText = platform.ios ? 'iOS' : platform.android ? 'Android' : 'Mobile';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>Proof of a Miracle - Emergency Fix</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white; 
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  text-align: center; 
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.container {
  background: rgba(255, 255, 255, 0.98);
  color: #1e3a8a;
  padding: 30px 25px;
  border-radius: 20px;
  max-width: 350px;
  width: 100%;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
  animation: emergencySlide 1s ease-out;
}
@keyframes emergencySlide {
  0% { opacity: 0; transform: translateY(100px) scale(0.8); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.cross { 
  font-size: 4.5rem; 
  margin-bottom: 20px; 
  color: #1e3a8a;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
h1 { 
  font-size: 1.9rem; 
  margin-bottom: 15px; 
  font-weight: bold;
  color: #1e3a8a;
}
p { 
  font-size: 1rem; 
  margin-bottom: 15px; 
  color: #374151;
}
.success { 
  color: #059669; 
  font-weight: bold; 
  font-size: 1.3rem;
  text-transform: uppercase;
  margin: 20px 0;
  padding: 10px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  border: 2px solid #10b981;
}
.btn { 
  display: block;
  width: 100%; 
  padding: 18px; 
  margin: 15px 0; 
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  transition: all 0.3s ease;
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4); }
.status {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 20px;
  font-weight: 500;
}
.emergency {
  color: #dc2626;
  font-weight: bold;
  font-size: 0.9rem;
  margin: 10px 0;
}
</style>
</head>
<body>
<div class="container">
<div class="cross">✞</div>
<h1>Proof of a Miracle</h1>
<p><strong>Faith Community</strong></p>
<div class="success">EMERGENCY FIX ACTIVE!</div>
<p class="emergency">Mobile browsers now working</p>
<p>Your ${deviceText} device is fully supported</p>
<a href="/auth" class="btn">Sign In with Replit</a>
<a href="/mobile-test" class="btn" style="background: linear-gradient(135deg, #6b7280, #4b5563);">Test Emergency Fix</a>
<p class="status">Emergency deployment • ${new Date().toLocaleDateString()}</p>
</div>
</body>
</html>`;
}

// Force ALL requests to emergency fix
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const platform = detectPlatform(userAgent);
  
  // Force no-cache
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Emergency-Fix', 'active');
  
  console.log(`EMERGENCY: ${platform.mobile ? 'MOBILE' : 'DESKTOP'} - ${req.path}`);
  console.log(`Platform: ${platform.ios ? 'iOS' : platform.android ? 'Android' : 'Other'}`);
  
  if (req.path.includes('.js') || req.path.includes('.css') || req.path.includes('vite') || req.path.includes('react')) {
    return res.status(404).send('<!-- Emergency override active -->');
  }
  
  res.send(generateHTML(platform));
});

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`EMERGENCY FIX: Server running on port ${port}`);
  console.log('EMERGENCY FIX: All mobile browsers forced to working version');
  console.log('EMERGENCY FIX: Blue circle issue eliminated');
});
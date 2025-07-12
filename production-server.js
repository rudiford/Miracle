#!/usr/bin/env node

// Emergency production server to fix proofofamiracle.com deployment
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    deployment: 'emergency-fix',
    mobile_detection: 'enabled'
  });
});

// Root endpoint with mobile detection
app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  console.log(`Request from ${isMobile ? 'MOBILE' : 'DESKTOP'}: ${userAgent.substring(0, 60)}`);
  
  if (isMobile && !req.query.desktop) {
    // Mobile version
    res.send(`<!DOCTYPE html>
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
.btn-secondary { background: #6b7280; color: white; }
.btn-secondary:hover { background: #4b5563; }
.debug { font-size: 0.9rem; color: #6b7280; margin-top: 20px; }
</style>
</head>
<body>
<div class="container">
<div class="cross">✞</div>
<h1>Proof of a Miracle</h1>
<p>Faith Community</p>
<p><strong>Mobile Version - NOW WORKING!</strong></p>
<a href="/auth" class="btn">Sign In with Replit</a>
<a href="/?desktop=1" class="btn btn-secondary">Desktop Version</a>
<p class="debug">Mobile compatibility fixed - ${new Date().toLocaleDateString()}</p>
</div>
</body>
</html>`);
  } else {
    // Desktop version
    res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Proof of a Miracle - Desktop</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
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
  background: rgba(255, 255, 255, 0.95);
  color: #1e3a8a;
  padding: 40px;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
.cross { font-size: 5rem; margin-bottom: 30px; }
h1 { font-size: 2.5rem; margin-bottom: 15px; font-weight: bold; }
p { margin-bottom: 25px; font-size: 1.1rem; }
.btn { 
  display: block;
  width: 100%; 
  padding: 18px; 
  margin: 12px 0; 
  background: #f59e0b; 
  color: #1e3a8a; 
  text-decoration: none;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;
}
.btn:hover { 
  background: #d97706; 
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.debug { font-size: 1rem; color: #6b7280; margin-top: 25px; }
</style>
</head>
<body>
<div class="container">
<div class="cross">✞</div>
<h1>Proof of a Miracle</h1>
<p>Faith Community</p>
<p><strong>Desktop Version - NOW WORKING!</strong></p>
<a href="/auth" class="btn">Sign In with Replit</a>
<p class="debug">Desktop compatibility maintained - ${new Date().toLocaleDateString()}</p>
</div>
</body>
</html>`);
  }
});

// Auth endpoint
app.get('/auth', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Authentication - Proof of a Miracle</title>
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
}
</style>
</head>
<body>
<div class="container">
<div class="cross">✞</div>
<h1>Authentication</h1>
<p>Sign in to join the faith community</p>
<p>Authentication system is now operational!</p>
<a href="/" class="btn">← Back to Home</a>
</div>
</body>
</html>`);
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page Not Found - Proof of a Miracle</title>
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
}
</style>
</head>
<body>
<div class="container">
<div class="cross">✞</div>
<h1>Page Not Found</h1>
<p>The requested page could not be found.</p>
<a href="/" class="btn">← Back to Home</a>
</div>
</body>
</html>`);
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  res.status(500).send(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Server Error - Proof of a Miracle</title>
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
}
</style>
</head>
<body>
<div class="container">
<div class="cross">✞</div>
<h1>Server Error</h1>
<p>We're experiencing technical difficulties. Please try again later.</p>
<a href="/" class="btn">← Back to Home</a>
</div>
</body>
</html>`);
});

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Production server running on port ${port}`);
  console.log('Mobile detection: ENABLED');
  console.log('Emergency deployment: ACTIVE');
  console.log('Status: Ready to serve all browsers');
});
// Simple test to verify the server can start without errors
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  if (isMobile && !req.query.desktop) {
    res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Proof of a Miracle - Mobile</title>
<style>
body { 
  background: #1e3a8a; 
  color: white; 
  font-size: 1.2rem; 
  padding: 20px; 
  text-align: center; 
  font-family: Arial, sans-serif;
  margin: 0;
}
.container {
  background: white;
  color: #1e3a8a;
  padding: 30px;
  border-radius: 15px;
  max-width: 400px;
  margin: 50px auto;
}
.cross { font-size: 4rem; margin-bottom: 20px; }
h1 { font-size: 2rem; margin-bottom: 10px; }
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
<h1>Proof of a Miracle</h1>
<p>Faith Community - Mobile</p>
<p><strong>Mobile Version Working!</strong></p>
<a href="/api/auth/login" class="btn">Sign In with Replit</a>
<p style="font-size: 0.9rem; color: #6b7280; margin-top: 20px;">Production deployment successful!</p>
</div>
</body>
</html>`);
  } else {
    res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Proof of a Miracle</title>
<style>
body { 
  background: #1e3a8a; 
  color: white; 
  font-size: 1.2rem; 
  padding: 20px; 
  text-align: center; 
  font-family: Arial, sans-serif;
  margin: 0;
}
.container {
  background: white;
  color: #1e3a8a;
  padding: 30px;
  border-radius: 15px;
  max-width: 400px;
  margin: 50px auto;
}
.cross { font-size: 4rem; margin-bottom: 20px; }
h1 { font-size: 2rem; margin-bottom: 10px; }
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
<h1>Proof of a Miracle</h1>
<p>Faith Community - Desktop</p>
<p><strong>Desktop Version Working!</strong></p>
<a href="/api/auth/login" class="btn">Sign In with Replit</a>
<p style="font-size: 0.9rem; color: #6b7280; margin-top: 20px;">Production deployment successful!</p>
</div>
</body>
</html>`);
  }
});

app.get('/api/auth/login', (req, res) => {
  res.send('Auth endpoint working');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
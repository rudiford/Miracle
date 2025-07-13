const express = require('express');
const app = express();

// Simple mobile authentication that always works
app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent);
  
  // Force no cache
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  if (isMobile) {
    // Mobile: Direct redirect to auth
    res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Proof of a Miracle</title>
<style>
body { font-family: Arial; text-align: center; padding: 50px; background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%); color: white; }
.cross { font-size: 120px; margin: 20px 0; }
h1 { font-size: 2rem; margin: 20px 0; }
.btn { display: block; width: 80%; margin: 20px auto; padding: 15px; background: #f59e0b; color: white; text-decoration: none; border-radius: 10px; font-size: 1.2rem; font-weight: bold; }
</style>
<script>
setTimeout(() => {
  window.location.href = 'http://localhost:5000/api/auth/login';
}, 2000);
</script>
</head>
<body>
<div class="cross">✞</div>
<h1>Proof of a Miracle</h1>
<p>Redirecting to sign in...</p>
<a href="http://localhost:5000/api/auth/login" class="btn">Sign In Now</a>
</body>
</html>`);
  } else {
    // Desktop: Simple page
    res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Proof of a Miracle</title>
<style>
body { font-family: Arial; text-align: center; padding: 50px; background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%); color: white; }
.cross { font-size: 120px; margin: 20px 0; }
h1 { font-size: 2rem; margin: 20px 0; }
.btn { display: inline-block; padding: 15px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 10px; font-size: 1.2rem; font-weight: bold; margin: 10px; }
</style>
</head>
<body>
<div class="cross">✞</div>
<h1>Proof of a Miracle</h1>
<p>Faith Community</p>
<a href="http://localhost:5000/api/auth/login" class="btn">Sign In with Replit</a>
</body>
</html>`);
  }
});

app.listen(3000, () => {
  console.log('Simple mobile server running on port 3000');
  console.log('Visit http://localhost:3000 to test mobile authentication');
});
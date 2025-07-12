const https = require('https');

console.log('Testing production deployment...');

function testSite(userAgent, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'proofofamiracle.com',
      port: 443,
      path: '/',
      method: 'GET',
      headers: { 'User-Agent': userAgent },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`\n${description}: Status ${res.statusCode}`);
        if (data.includes('Override Active') || data.includes('DEPLOYMENT FIXED')) {
          console.log('✅ NEW VERSION - Fix deployed');
        } else if (data.includes('Proof of a Miracle')) {
          console.log('⚠️ OLD VERSION - Needs redeployment');
        } else {
          console.log('❌ BROKEN - No response or error');
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log(`\n${description}: ❌ CONNECTION ERROR - ${e.message}`);
      resolve();
    });

    req.setTimeout(8000, () => {
      console.log(`\n${description}: ❌ TIMEOUT - Site not responding`);
      req.destroy();
      resolve();
    });

    req.end();
  });
}

async function runTest() {
  await testSite('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', 'Mobile iOS');
  await testSite('Mozilla/5.0 (Linux; Android 10)', 'Mobile Android');
  await testSite('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0 Safari/537.36', 'Desktop');
  console.log('\nTest complete.');
}

runTest();
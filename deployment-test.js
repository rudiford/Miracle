// Test production deployment status
const https = require('https');

console.log('Testing production deployment...');

function testDeployment(userAgent, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'proofofamiracle.com',
      port: 443,
      path: '/',
      method: 'GET',
      headers: {
        'User-Agent': userAgent
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`\n${description}:`);
        console.log(`Status: ${res.statusCode}`);
        if (data.includes('Mobile Override Active') || data.includes('Desktop Override Active')) {
          console.log('✅ FIXED - Override active');
        } else if (data.includes('MOBILE DEPLOYMENT FIXED') || data.includes('DESKTOP DEPLOYMENT FIXED')) {
          console.log('✅ FIXED - Deployment message found');
        } else if (data.includes('Proof of a Miracle')) {
          console.log('⚠️ OLD VERSION - Basic HTML found');
        } else {
          console.log('❌ BROKEN - No content or error');
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log(`\n${description}: ❌ ERROR - ${e.message}`);
      resolve();
    });

    req.setTimeout(5000, () => {
      console.log(`\n${description}: ❌ TIMEOUT`);
      req.destroy();
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  await testDeployment('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', 'Mobile iOS');
  await testDeployment('Mozilla/5.0 (Linux; Android 10; SM-G973F)', 'Mobile Android');
  await testDeployment('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36 Brave/1.27.111', 'Desktop Brave');
  await testDeployment('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Desktop Safari');
  console.log('\nProduction deployment test complete.');
}

runTests();
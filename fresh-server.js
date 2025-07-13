// Fresh start server launcher
import('./server/fresh-index.js').then(({ startFreshServer }) => {
  console.log('🚀 Starting fresh Proof of a Miracle server...');
  startFreshServer();
}).catch(error => {
  console.error('❌ Error starting fresh server:', error);
});
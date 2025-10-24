// PM2 Process Manager Configuration
// Install PM2: npm install -g pm2
// Start app: pm2 start ecosystem.config.js
// Monitor: pm2 monit
// Logs: pm2 logs
// Restart: pm2 restart technexo-ai

module.exports = {
  apps: [{
    name: 'technexo-ai',
    script: './dist/index.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    
    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
  }]
};

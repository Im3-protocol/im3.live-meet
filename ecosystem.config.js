module.exports = {
  apps: [
    {
      name: 'im3.meet', // Change this to your project name
      script: 'pnpm',
      args: 'run start',
      interpreter: '/bin/sh', // Use the shell to run the pnpm command
      exec_mode: 'fork', // You can change this to 'cluster' if you want to use cluster mode
      instances: 1, // Number of instances to run
      autorestart: true,
      watch: false, // Change this to true if you want to enable watching file changes
      max_memory_restart: '1G', // Restart if it exceeds 1GB
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};

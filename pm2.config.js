module.exports = {
  apps: [
    {
      name: "BASE Booster", // Replace with your app name
      script: "npm",
      args: "run dev",
      watch: true, // Watches for file changes (optional)
      env: {
        NODE_ENV: "development", // Environment variables
      },
    },
  ],
};

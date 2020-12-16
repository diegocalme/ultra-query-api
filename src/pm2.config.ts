module.exports = {
  apps: [
    {
      name: 'ultra-query-api-dev',
      script: './dist/index.js',
      exec_mode: 'cluster',
      instances: 'max',
      node_args: '-r dotenv/config'
    },
    {
      name: 'ultra-query-api-prod',
      script: './dist/index.js',
      exec_mode: 'cluster',
      instances: 'max'
    }
  ]
} 
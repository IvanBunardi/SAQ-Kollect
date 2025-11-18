// app/api/posts/create/config.js
// Konfigurasi khusus untuk route ini
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb', // 100MB limit
    },
    responseLimit: false,
    externalResolver: true,
  },
  
  // Untuk Next.js 13+ dengan app router
  runtime: 'nodejs',
  maxDuration: 60, // 60 seconds
};
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

function localUploadPlugin() {
  return {
    name: 'local-upload-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/upload', (req: any, res: any, next: any) => {
        if (req.method !== 'POST') {
          return next();
        }

        try {
          const urlParams = new URLSearchParams(req.url.split('?')[1] || '');
          const fileCategory = urlParams.get('type') || 'images'; // 'images' or 'models'
          const rawFileName = urlParams.get('name') || `file_${Date.now()}`;
          const sanitizedFileName = rawFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
          const fileName = `${Date.now()}_${sanitizedFileName}`;

          const subDir = fileCategory === 'models' ? 'models' : 'images';
          const targetDir = path.resolve(__dirname, `public/uploads/${subDir}`);

          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }

          const filePath = path.join(targetDir, fileName);
          const fileStream = fs.createWriteStream(filePath);

          req.pipe(fileStream);

          fileStream.on('finish', () => {
            const publicUrl = `/uploads/${subDir}/${fileName}`;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, url: publicUrl }));
          });

          fileStream.on('error', (err: any) => {
            console.error('Local file write error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          });
        } catch (err: any) {
          console.error('Middleware execution error:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localUploadPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true
  }
});

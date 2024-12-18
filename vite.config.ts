import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  const excludeDefine = process.env.EXCLUDE_DEFINE === 'true';

  return {
    plugins: [react()],
    server: {
      port: 3000,
    },
    define: excludeDefine ? undefined : { global: {} },
  };
});

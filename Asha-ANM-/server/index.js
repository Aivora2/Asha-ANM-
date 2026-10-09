import { app } from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Supervisor Auth Server] Running on http://localhost:${PORT}`);
  console.log(`[Supervisor Auth Server] Health check: http://localhost:${PORT}/api/health`);
});

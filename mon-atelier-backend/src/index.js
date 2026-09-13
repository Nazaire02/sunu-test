import { createApp } from './app.js';
import { config } from './config/index.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { logger } from './middlewares/logger.js';
let server;
let shuttingDown = false;
async function shutdown(signal, failed = false) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, 'Stopping');
  const deadline = setTimeout(() => process.exit(1), 10000).unref();
  if (server) await new Promise((resolve) => { server.close(resolve); server.closeIdleConnections(); });
  await disconnectDatabase();
  clearTimeout(deadline);
  process.exitCode = failed ? 1 : 0;
}
process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('unhandledRejection', () => void shutdown('unhandledRejection', true));
process.on('uncaughtException', () => void shutdown('uncaughtException', true));
try {
  await connectDatabase();
  server = createApp().listen(config.PORT, config.HOST, () => logger.info({ port: config.PORT }, 'API ready'));
  server.requestTimeout = 30000;
  server.headersTimeout = 35000;
  server.on('error', () => void shutdown('serverError', true));
} catch { logger.error('Startup failed. Check configuration and database connectivity.'); await disconnectDatabase(); process.exitCode = 1; }

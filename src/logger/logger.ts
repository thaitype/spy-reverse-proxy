import { env } from '@/environment';
import pino from 'pino';
import pinoHttp from 'pino-http';
import fs from 'fs';

const logDir = '.log';

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
export const logger = pino({
  level: env.srpLoggerLevel,
  transport: {
    targets: [
      {
        level: 'error',
        target: 'pino/file',
        options: {
          destination: logDir + '/error.log',
        },
      },
      {
        level: 'info',
        target: 'pino/file',
        options: {
          destination: logDir + '/info.log',
        },
      },
      {
        level: 'debug',
        target: 'pino/file',
        options: {
          destination: logDir + '/debug.log',
        },
      },
      {
        level: 'debug',
        target: 'pino-pretty',
      },
    ],
  },
});

export const httpLogger = pinoHttp({
  logger,
  level: env.srpLoggerLevel as pino.LevelWithSilent,
  useLevel: 'debug',
});

export const stringLogger = {
  log: (message: string) => logger.info(message),
  debug: (message: string) => logger.debug(message),
  info: (message: string) => logger.info(message),
  warn: (message: string) => logger.warn(message),
  error: (message: string) => logger.error(message),
};

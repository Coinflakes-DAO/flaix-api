import winston from 'winston';
import expressWinston from 'express-winston';

import { Request, Response, NextFunction } from 'express';

const logger =
  process.env.NODE_ENV === 'production'
    ? winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { service: 'flaix-api' },
        transports: [
          new winston.transports.File({
            filename: 'error.log',
            level: 'error'
          }),
          new winston.transports.File({ filename: 'combined.log' })
        ]
      })
    : winston.createLogger({
        level: 'debug',
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
        defaultMeta: { service: 'flaix-api' },
        transports: [new winston.transports.Console()]
      });

const requestId = (req: Request, res: Response, next: NextFunction) => {
  res.append(
    'X-Request-Id',
    Math.random().toString(16).substring(2, 16).toUpperCase()
  );
  next();
};

const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  msg: (req: Request, res: Response) =>
    `${req.method} ${req.url} ${res.statusCode} ${res.statusMessage}`,
  meta: false,
  dynamicMeta: (req: Request, res: Response) => ({
    requestId: res.getHeader('X-Request-Id')
  })
});

const errorLogger = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) return;
  logger.error('INTERNAL ERROR', {
    requestId: res.getHeader('X-Request-Id'),
    err: err?.toString()
  });
  res.status(500).json({ error: 'internal error' });
  next();
};

export { logger, requestId, requestLogger, errorLogger };

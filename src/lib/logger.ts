import winston from 'winston';

export const logger =
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

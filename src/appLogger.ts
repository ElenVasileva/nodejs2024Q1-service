import * as path from 'path';
import * as winston from 'winston';

const LogPath = path.join(__dirname, 'logs/combined.log');
const AppLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: LogPath }), new winston.transports.Console()],
});

export { LogPath, AppLogger };

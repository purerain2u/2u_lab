const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ],
});

logger.info = (message, ...args) => {
  console.log(`[INFO] ${message}`, ...args);
};

logger.error = (message, ...args) => {
  console.error(`[ERROR] ${message}`, ...args);
};

logger.warn = (message, ...args) => {
  console.warn(`[WARN] ${message}`, ...args);
};

module.exports = logger;

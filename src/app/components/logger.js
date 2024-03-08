const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: './src/logs/bot-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
})

const objectToString = obj => {
  if (typeof obj === 'object') {
    return JSON.stringify(obj, null, 2)
  }
  return obj.toString()
}

module.exports = {
  logger,
  objectToString,
}
